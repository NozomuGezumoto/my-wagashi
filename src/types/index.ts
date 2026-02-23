// ============================================
// My Wagashi (和菓子) - Wagashi spot types
// Pins = 全国の和菓子屋（和菓子店・甘味処・工房）
// ============================================

export type WagashiSpotType = 'shop' | 'cafe' | 'factory';

/** ジャンル = 主な材料（フィルタ用） */
export type WagashiGenre =
  | 'mochi'    // 餅系
  | 'an'       // 餡・羊羹系
  | 'nerikiri' // 練り切り・きんとん
  | 'baked'    // 焼き菓子
  | 'sugar'    // 落雁・糖芸
  | 'manju'    // 饅頭系
  | 'other';   // その他・総合

export const WAGASHI_GENRE_OPTIONS: { value: WagashiGenre; label: string; shortLabel: string }[] = [
  { value: 'mochi', label: '餅系（大福・おはぎ・柏餅・団子など）', shortLabel: '餅系' },
  { value: 'an', label: '餡・羊羹系（羊羹・最中・どら焼き・練り羊羹など）', shortLabel: '餡・羊羹' },
  { value: 'nerikiri', label: '練り切り・きんとん（上生菓子）', shortLabel: '練り切り' },
  { value: 'baked', label: '焼き菓子（せんべい・煎餅・八つ橋・カステラなど）', shortLabel: '焼き菓子' },
  { value: 'sugar', label: '落雁・糖芸（落雁・有平糖・金平糖・和三盆など）', shortLabel: '落雁・糖芸' },
  { value: 'manju', label: '饅頭系（焼き饅頭・蒸し饅頭・栗饅頭・もみじ饅頭など）', shortLabel: '饅頭系' },
  { value: 'other', label: 'その他・総合', shortLabel: 'その他' },
];

export function getWagashiGenreLabel(genre: WagashiGenre): string {
  return WAGASHI_GENRE_OPTIONS.find((o) => o.value === genre)?.label ?? genre;
}

export interface WagashiSpot {
  id: string;
  name: string;
  name_reading?: string;
  prefecture: string;
  address?: string;
  type: WagashiSpotType;
  /** 主な材料（ジャンル） */
  genre?: WagashiGenre;
  characteristics?: string;
  source?: string;
}

export interface WagashiFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: WagashiSpot & { 'addr:prefecture'?: string; 'addr:full'?: string };
}

export interface WagashiGeoJSON {
  type: 'FeatureCollection';
  features: WagashiFeature[];
}

export interface WagashiPin {
  id: string;
  lat: number;
  lng: number;
  name: string;
  nameReading: string;
  type: WagashiSpotType;
  /** 主な材料（ジャンル） */
  genre: WagashiGenre;
  address: string;
  prefecture: string;
  characteristics?: string;
  isCustom?: boolean;
}

// 都道府県リスト
export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
] as const;

export type Prefecture = typeof PREFECTURES[number];
