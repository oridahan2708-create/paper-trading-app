import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';

import type { TradeRecord } from '@/store/portfolioStore';
import { changeColor, colors } from '@/theme/colors';
import { formatPrice, formatQuantity } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

export function TradeHistoryRow({ trade }: { trade: TradeRecord }) {
  const isBuy = trade.side === 'buy';
  return (
    <View style={styles.row}>
      <View style={[styles.sideBadge, { backgroundColor: isBuy ? colors.positiveMuted : colors.negativeMuted }]}>
        <Text style={[styles.sideText, { color: isBuy ? colors.positive : colors.negative }]}>
          {isBuy ? 'BUY' : 'SELL'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.symbol}>{trade.symbol}</Text>
        <Text style={styles.meta}>
          {formatQuantity(trade.quantity)} @ {formatPrice(trade.price)} · {format(trade.timestamp, 'MMM d, h:mm a')}
        </Text>
        {trade.source === 'copy' && trade.copiedFromTraderName && (
          <Text style={styles.copyTag}>Copied from {trade.copiedFromTraderName}</Text>
        )}
      </View>
      <View style={styles.totalCol}>
        <Text style={styles.total}>{formatPrice(trade.total)}</Text>
        {trade.realizedPnl != null && (
          <Text style={[styles.pnl, { color: changeColor(trade.realizedPnl) }]}>
            {trade.realizedPnl >= 0 ? '+' : ''}
            {formatPrice(trade.realizedPnl)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.md },
  sideBadge: { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  sideText: { ...typography.captionStrong },
  info: { flex: 1, gap: 2 },
  symbol: { ...typography.bodyStrong, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textTertiary },
  copyTag: { ...typography.caption, color: colors.accentSecondary },
  totalCol: { alignItems: 'flex-end', gap: 2 },
  total: { ...typography.bodyStrong, color: colors.textPrimary },
  pnl: { ...typography.caption },
});
