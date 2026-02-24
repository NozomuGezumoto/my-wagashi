import { ScrollView, Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BEER_COLORS } from '../src/constants/theme';

const POLICY_SECTIONS = [
  {
    title: '1. 収集する情報',
    content:
      '本アプリでは、以下の情報を端末内に保存します。\n\n・ごちそうさまでした・食べてみたいの記録\n・メモ・評価\n・写真（フォトライブラリ/カメラから選択）\n・カスタムスポット（地図上に追加した和菓子屋）\n・除外リスト・フィルタ設定\n\nこれらはすべて端末内のみに保存され、サーバーには送信されません。\n\nフォトライブラリ・カメラの権限は、和菓子の写真追加のためのみ使用します。地図表示に Google Maps を使用しますが、ユーザーの位置情報を取得することはありません。',
  },
  {
    title: '2. 利用目的',
    content:
      '収集した情報は、ユーザーによる和菓子屋の記録・管理、メモや写真の保存・表示、地図上でのお気に入り表示、アプリの機能提供の目的でのみ利用します。',
  },
  {
    title: '3. 第三者への提供',
    content:
      '本アプリは、ユーザーの個人情報を第三者に提供しません。ユーザーが入力した情報（メモ・写真など）は Google に送信されません。',
  },
  {
    title: '4. データの保存場所',
    content: 'すべてのデータは端末内に保存されます。クラウドへのバックアップは行いません。',
  },
  {
    title: '5. データの削除',
    content: 'アプリをアンインストールすることで、端末内のデータは削除されます。',
  },
  {
    title: '6. お子様の利用',
    content: '本アプリは13歳未満の方を対象としていません。',
  },
  {
    title: '7. お問い合わせ',
    content: 'ご質問はアプリのストアページまたは開発者までお問い合わせください。\n\n最終更新：2025年2月',
  },
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={BEER_COLORS.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>プライバシーポリシー</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <Text style={styles.intro}>
          My Wagashi は、ユーザーのプライバシーを尊重し、個人情報の取り扱いについて以下のとおり定めます。
        </Text>
        {POLICY_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: BEER_COLORS.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 15,
    color: BEER_COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BEER_COLORS.primary,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: BEER_COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'justify',
  },
});
