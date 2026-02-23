// ============================================
// Add Custom Wagashi Spot Modal
// データにない和菓子屋を追加
// ============================================

import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BEER_COLORS, SPACING, RADIUS } from '../constants/theme';
import { useStore } from '../store/useStore';
import type { WagashiPin, WagashiGenre } from '../types';
import { WAGASHI_GENRE_OPTIONS } from '../types';

interface AddWagashiModalProps {
  visible: boolean;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number };
  onSuccess?: (spotId: string) => void;
}

type WagashiSpotType = WagashiPin['type'];

const WAGASHI_TYPES: { value: WagashiSpotType; label: string; emoji: string }[] = [
  { value: 'shop', label: '和菓子店', emoji: '🍡' },
  { value: 'cafe', label: '甘味処・喫茶', emoji: '🍡' },
  { value: 'factory', label: '工房・直売', emoji: '🏭' },
];

export default function AddWagashiModal({
  visible,
  onClose,
  initialLocation,
  onSuccess,
}: AddWagashiModalProps) {
  const addCustomWagashiSpot = useStore((state) => state.addCustomWagashiSpot);

  const [name, setName] = useState('');
  const [type, setType] = useState<WagashiSpotType>('shop');
  const [genre, setGenre] = useState<WagashiGenre>('other');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (visible) {
      setName('');
      setType('shop');
      setGenre('other');
      setAddress('');
    }
  }, [visible]);

  const resetForm = useCallback(() => {
    setName('');
    setType('shop');
    setGenre('other');
    setAddress('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      Alert.alert('エラー', '店名を入力してください');
      return;
    }
    if (!initialLocation) {
      Alert.alert('エラー', '場所が選択されていません');
      return;
    }
    const spotId = addCustomWagashiSpot({
      name: name.trim(),
      type,
      genre,
      lat: initialLocation.lat,
      lng: initialLocation.lng,
      address: address.trim() || undefined,
    });
    Alert.alert('登録完了', `「${name.trim()}」を追加しました`, [
      { text: 'OK', onPress: () => { handleClose(); onSuccess?.(spotId); } },
    ]);
  }, [name, type, genre, initialLocation, address, addCustomWagashiSpot, handleClose, onSuccess]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>和菓子屋を追加</Text>
              <Pressable style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={24} color={BEER_COLORS.textMuted} />
              </Pressable>
            </View>
            {initialLocation && (
              <View style={styles.locationDisplay}>
                <Ionicons name="location" size={20} color={BEER_COLORS.primary} />
                <Text style={styles.locationText}>
                  {initialLocation.lat.toFixed(6)}, {initialLocation.lng.toFixed(6)}
                </Text>
              </View>
            )}
            <View style={styles.field}>
              <Text style={styles.label}>店名 *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="例: ○○和菓子店"
                placeholderTextColor={BEER_COLORS.textMuted}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>お店の種類</Text>
              <View style={styles.typeSelector}>
                {WAGASHI_TYPES.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[styles.typeOption, type === option.value && styles.typeOptionActive]}
                    onPress={() => setType(option.value)}
                  >
                    <Text style={styles.typeEmoji}>{option.emoji}</Text>
                    <Text style={[styles.typeLabel, type === option.value && styles.typeLabelActive]}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>ジャンル（主な材料）</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreScroll}>
                {WAGASHI_GENRE_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[styles.genreOption, genre === option.value && styles.genreOptionActive]}
                    onPress={() => setGenre(option.value)}
                  >
                    <Text style={[styles.genreOptionText, genre === option.value && styles.genreOptionTextActive]}>{option.shortLabel}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>住所（任意）</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="例: 京都府京都市..."
                placeholderTextColor={BEER_COLORS.textMuted}
              />
            </View>
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>和菓子屋を追加</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  container: { backgroundColor: BEER_COLORS.backgroundCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, maxHeight: '90%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: '700', color: BEER_COLORS.textPrimary },
  closeButton: { padding: SPACING.sm, marginRight: -SPACING.sm },
  locationDisplay: { flexDirection: 'row', alignItems: 'center', backgroundColor: BEER_COLORS.primary + '10', padding: SPACING.md, borderRadius: RADIUS.lg, marginBottom: SPACING.lg, gap: SPACING.sm },
  locationText: { fontSize: 14, color: BEER_COLORS.primary, fontWeight: '500' },
  field: { marginBottom: SPACING.lg },
  label: { fontSize: 14, fontWeight: '600', color: BEER_COLORS.textSecondary, marginBottom: SPACING.sm },
  input: { backgroundColor: BEER_COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, fontSize: 16, color: BEER_COLORS.textPrimary, borderWidth: 1, borderColor: BEER_COLORS.border },
  typeSelector: { flexDirection: 'row', gap: SPACING.sm },
  typeOption: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: BEER_COLORS.surface, borderWidth: 2, borderColor: BEER_COLORS.border },
  typeOptionActive: { borderColor: BEER_COLORS.primary, backgroundColor: BEER_COLORS.primary + '10' },
  typeEmoji: { fontSize: 24, marginBottom: SPACING.xs },
  typeLabel: { fontSize: 12, fontWeight: '600', color: BEER_COLORS.textMuted },
  typeLabelActive: { color: BEER_COLORS.primary },
  genreScroll: { marginHorizontal: -SPACING.xl },
  genreOption: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: RADIUS.md, backgroundColor: BEER_COLORS.surface, borderWidth: 2, borderColor: BEER_COLORS.border, marginRight: SPACING.sm },
  genreOptionActive: { borderColor: BEER_COLORS.primary, backgroundColor: BEER_COLORS.primary + '10' },
  genreOptionText: { fontSize: 13, fontWeight: '600', color: BEER_COLORS.textMuted },
  genreOptionTextActive: { color: BEER_COLORS.primary },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: BEER_COLORS.primary, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, gap: SPACING.sm, marginTop: SPACING.md, marginBottom: SPACING.xl },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
