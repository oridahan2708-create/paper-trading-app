import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import type { Asset } from '@/api/types';
import { colors } from '@/theme/colors';
import { formatCompactNumber, formatPrice } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';
import { PriceChangeBadge } from './PriceChangeBadge';

interface Props {
  asset: Asset;
  onPress?: () => void;
}

export function AssetRow({ asset, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress ?? (() => router.push(`/asset/${encodeURIComponent(asset.id)}`))}
    >
      <View style={styles.icon}>
        {asset.image ? (
          <Image source={{ uri: asset.image }} style={styles.iconImage} />
        ) : (
          <Text style={styles.iconFallback}>{asset.symbol.slice(0, 2)}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.symbol} numberOfLines={1}>
          {asset.symbol}
        </Text>
        <Text style={styles.name} numberOfLines={1}>
          {asset.name}
        </Text>
      </View>
      {asset.marketCap != null && (
        <Text style={styles.marketCap} numberOfLines={1}>
          {formatCompactNumber(asset.marketCap)}
        </Text>
      )}
      <View style={styles.priceCol}>
        <Text style={styles.price} numberOfLines={1}>
          {formatPrice(asset.price)}
        </Text>
        <PriceChangeBadge value={asset.change24h} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  rowPressed: { backgroundColor: colors.surface },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconImage: { width: 36, height: 36 },
  iconFallback: { ...typography.captionStrong, color: colors.textSecondary },
  info: { flex: 1, gap: 2 },
  symbol: { ...typography.bodyStrong, color: colors.textPrimary },
  name: { ...typography.caption, color: colors.textTertiary },
  marketCap: { ...typography.caption, color: colors.textSecondary, width: 64, textAlign: 'right' },
  priceCol: { alignItems: 'flex-end', gap: spacing.xs, minWidth: 90 },
  price: { ...typography.bodyStrong, color: colors.textPrimary },
});
