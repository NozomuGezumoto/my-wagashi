// ============================================
// My Wagashi (和菓子) - State Management
// ごちそうさまでした / 食べてみたい = チェックで記録
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WagashiGenre } from '../types';
import { SEED_WANT_TO_TRY_IDS } from '../data/seedWantToTry';

export type WagashiSpotPinType = 'shop' | 'cafe' | 'factory';

export interface TriedWagashiSpot {
  id: string;
  triedAt: string;
}

export interface WagashiSpotMemo {
  id: string;
  note: string;
  rating?: number;
  photos?: string[];
  updatedAt: string;
}

export interface CustomWagashiSpot {
  id: string;
  name: string;
  type: WagashiSpotPinType;
  genre: WagashiGenre;
  lat: number;
  lng: number;
  address?: string;
  createdAt: string;
}

export type FilterMode = 'all' | 'tried' | 'wantToTry';
export type PrefectureFilter = string;
export type GenreFilter = WagashiGenre | '';

interface StoreState {
  triedWagashiSpots: TriedWagashiSpot[];
  wantToTryWagashiSpots: string[];
  wagashiSpotMemos: WagashiSpotMemo[];
  customWagashiSpots: CustomWagashiSpot[];
  excludedWagashiSpots: string[];

  filterMode: FilterMode;
  prefectureFilter: PrefectureFilter;
  genreFilter: GenreFilter;
  hideExcluded: boolean;

  setFilterMode: (mode: FilterMode) => void;
  setPrefectureFilter: (filter: PrefectureFilter) => void;
  setGenreFilter: (filter: GenreFilter) => void;
  setHideExcluded: (value: boolean) => void;

  excludeWagashiSpot: (id: string) => void;
  unexcludeWagashiSpot: (id: string) => void;
  clearAllExcluded: () => void;
  isExcluded: (id: string) => boolean;

  markAsTried: (id: string) => void;
  unmarkAsTried: (id: string) => void;
  isTried: (id: string) => boolean;
  getTriedCount: () => number;

  markAsWantToTry: (id: string) => void;
  unmarkAsWantToTry: (id: string) => void;
  isWantToTry: (id: string) => boolean;
  getWantToTryCount: () => number;

  setWagashiSpotMemo: (id: string, note: string, rating?: number) => void;
  getWagashiSpotMemo: (id: string) => WagashiSpotMemo | undefined;

  addWagashiSpotPhoto: (id: string, photoUri: string) => void;
  removeWagashiSpotPhoto: (id: string, photoUri: string) => void;
  getWagashiSpotPhotos: (id: string) => string[];

  addCustomWagashiSpot: (spot: Omit<CustomWagashiSpot, 'id' | 'createdAt'>) => string;
  updateCustomWagashiSpot: (id: string, updates: Partial<CustomWagashiSpot>) => void;
  deleteCustomWagashiSpot: (id: string) => void;
  getCustomWagashiSpots: () => CustomWagashiSpot[];
  isCustomWagashiSpot: (id: string) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      triedWagashiSpots: [],
      wantToTryWagashiSpots: [],
      wagashiSpotMemos: [],
      customWagashiSpots: [],
      excludedWagashiSpots: [],
      filterMode: 'all',
      prefectureFilter: '',
      genreFilter: '',
      hideExcluded: false,

      setFilterMode: (mode) => set({ filterMode: mode }),
      setPrefectureFilter: (filter) => set({ prefectureFilter: filter }),
      setGenreFilter: (filter) => set({ genreFilter: filter }),
      setHideExcluded: (value) => set({ hideExcluded: value }),

      excludeWagashiSpot: (id) => {
        set((state) => {
          if (state.excludedWagashiSpots.includes(id)) return state;
          return { excludedWagashiSpots: [...state.excludedWagashiSpots, id] };
        });
      },
      unexcludeWagashiSpot: (id) => {
        set((state) => ({
          excludedWagashiSpots: state.excludedWagashiSpots.filter((s) => s !== id),
        }));
      },
      clearAllExcluded: () => set({ excludedWagashiSpots: [] }),
      isExcluded: (id) => get().excludedWagashiSpots.includes(id),

      markAsTried: (id) => {
        if (get().triedWagashiSpots.some((t) => t.id === id)) return;
        set((state) => ({
          triedWagashiSpots: [...state.triedWagashiSpots, { id, triedAt: new Date().toISOString() }],
        }));
      },
      unmarkAsTried: (id) => {
        set((state) => ({
          triedWagashiSpots: state.triedWagashiSpots.filter((t) => t.id !== id),
        }));
      },
      isTried: (id) => get().triedWagashiSpots.some((t) => t.id === id),
      getTriedCount: () => get().triedWagashiSpots.length,

      markAsWantToTry: (id) => {
        if (get().wantToTryWagashiSpots.includes(id)) return;
        set((state) => ({ wantToTryWagashiSpots: [...state.wantToTryWagashiSpots, id] }));
      },
      unmarkAsWantToTry: (id) => {
        set((state) => ({
          wantToTryWagashiSpots: state.wantToTryWagashiSpots.filter((s) => s !== id),
        }));
      },
      isWantToTry: (id) => get().wantToTryWagashiSpots.includes(id),
      getWantToTryCount: () => get().wantToTryWagashiSpots.length,

      setWagashiSpotMemo: (id, note, rating) => {
        set((state) => {
          const existing = state.wagashiSpotMemos.find((m) => m.id === id);
          if (existing) {
            return {
              wagashiSpotMemos: state.wagashiSpotMemos.map((m) =>
                m.id === id ? { ...m, note, rating, updatedAt: new Date().toISOString() } : m
              ),
            };
          }
          return {
            wagashiSpotMemos: [...state.wagashiSpotMemos, { id, note, rating, updatedAt: new Date().toISOString() }],
          };
        });
      },
      getWagashiSpotMemo: (id) => get().wagashiSpotMemos.find((m) => m.id === id),

      addWagashiSpotPhoto: (id, photoUri) => {
        set((state) => {
          const existing = state.wagashiSpotMemos.find((m) => m.id === id);
          const photos = existing?.photos || [];
          if (photos.length >= 4) return state;
          if (existing) {
            return {
              wagashiSpotMemos: state.wagashiSpotMemos.map((m) =>
                m.id === id ? { ...m, photos: [...photos, photoUri], updatedAt: new Date().toISOString() } : m
              ),
            };
          }
          return {
            wagashiSpotMemos: [...state.wagashiSpotMemos, { id, note: '', photos: [photoUri], updatedAt: new Date().toISOString() }],
          };
        });
      },
      removeWagashiSpotPhoto: (id, photoUri) => {
        set((state) => ({
          wagashiSpotMemos: state.wagashiSpotMemos.map((m) =>
            m.id === id ? { ...m, photos: (m.photos || []).filter((p) => p !== photoUri), updatedAt: new Date().toISOString() } : m
          ),
        }));
      },
      getWagashiSpotPhotos: (id) => {
        const memo = get().wagashiSpotMemos.find((m) => m.id === id);
        return memo?.photos || [];
      },

      addCustomWagashiSpot: (spot) => {
        const id = `custom-${Date.now()}`;
        set((state) => ({
          customWagashiSpots: [...state.customWagashiSpots, { ...spot, id, createdAt: new Date().toISOString() }],
        }));
        return id;
      },
      updateCustomWagashiSpot: (id, updates) => {
        set((state) => ({
          customWagashiSpots: state.customWagashiSpots.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },
      deleteCustomWagashiSpot: (id) => {
        set((state) => ({
          customWagashiSpots: state.customWagashiSpots.filter((s) => s.id !== id),
          triedWagashiSpots: state.triedWagashiSpots.filter((t) => t.id !== id),
          wantToTryWagashiSpots: state.wantToTryWagashiSpots.filter((s) => s !== id),
          wagashiSpotMemos: state.wagashiSpotMemos.filter((m) => m.id !== id),
        }));
      },
      getCustomWagashiSpots: () => get().customWagashiSpots,
      isCustomWagashiSpot: (id) => id.startsWith('custom-'),
    }),
    {
      name: 'my-wagashi-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        triedWagashiSpots: state.triedWagashiSpots,
        wantToTryWagashiSpots: state.wantToTryWagashiSpots,
        wagashiSpotMemos: state.wagashiSpotMemos,
        customWagashiSpots: state.customWagashiSpots,
        excludedWagashiSpots: state.excludedWagashiSpots,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.wantToTryWagashiSpots?.length) {
          setTimeout(() => {
            useStore.setState({ wantToTryWagashiSpots: SEED_WANT_TO_TRY_IDS });
          }, 0);
        }
      },
    }
  )
);
