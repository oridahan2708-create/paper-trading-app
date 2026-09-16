import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import type { Asset } from '@/api/types';
import { changeColor, colors } from '@/theme/colors';
import { formatPercent, formatPrice } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

interface Props {
  assets: Asset[];
}

export function TrendingStrip({ assets }: Props) {
  const top = [...assets].filter((a) => a.change24h != null).sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0)).slice(0, 10);

  if (top.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔥 Trending now</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {top.map((asset) => (
          <Pressable key={asset.id} style={styles.card} onPress={() => router.push(`/asset/${encodeURIComponent(asset.id)}`)}>
            <Text style={styles.symbol}>{asset.symbol}</Text>
            <Text style={styles.price}>{formatPrice(asset.price)}</Text>
            <Text style={[styles.change, { color: changeColor(asset.change24h ?? 0) }]}>{formatPercent(asset.change24h)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, paddingTop: spacing.sm },
  heading: { ...typography.subheading, color: colors.textPrimary, paddingHorizontal: spacing.lg },
  scrollContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    minWidth: 110,
    gap: 4,
  },
  symbol: { ...typography.bodyStrong, color: colors.textPrimary },
  price: { ...typography.caption, color: colors.textSecondary },
  change: { ...typography.captionStrong },
});
