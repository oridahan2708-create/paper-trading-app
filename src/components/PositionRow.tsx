import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import type { ValuedPosition } from '@/hooks/usePortfolioValuation';
import { changeColor, colors } from '@/theme/colors';
import { formatPercent, formatPrice, formatQuantity } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

export function PositionRow({ position }: { position: ValuedPosition }) {
  return (
    <Pressable style={styles.row} onPress={() => router.push(`/asset/${encodeURIComponent(position.assetId)}`)}>
      <View style={styles.icon}>
        {position.image ? (
          <Image source={{ uri: position.image }} style={styles.iconImage} />
        ) : (
          <Text style={styles.iconFallback}>{position.symbol.slice(0, 2)}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.symbol}>{position.symbol}</Text>
        <Text style={styles.quantity}>
          {formatQuantity(position.quantity)} · avg {formatPrice(position.avgCost)}
        </Text>
      </View>
      <View style={styles.valueCol}>
        <Text style={styles.value}>{formatPrice(position.marketValue)}</Text>
        <Text style={[styles.pnl, { color: changeColor(position.unrealizedPnl) }]}>
          {position.unrealizedPnl >= 0 ? '+' : ''}
          {formatPrice(position.unrealizedPnl)} ({formatPercent(position.unrealizedPnlPct)})
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.md },
  icon: { width: 36, height: 36, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  iconImage: { width: 36, height: 36 },
  iconFallback: { ...typography.captionStrong, color: colors.textSecondary },
  info: { flex: 1, gap: 2 },
  symbol: { ...typography.bodyStrong, color: colors.textPrimary },
  quantity: { ...typography.caption, color: colors.textTertiary },
  valueCol: { alignItems: 'flex-end', gap: 2 },
  value: { ...typography.bodyStrong, color: colors.textPrimary },
  pnl: { ...typography.caption },
});
