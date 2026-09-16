import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import type { MockTrade, MockTrader } from '@/data/mockTraders';
import { colors } from '@/theme/colors';
import { formatPrice, formatQuantity, formatRelativeMinutes } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';
import { CopyTradeModal } from './CopyTradeModal';
import { TraderAvatar } from './TraderAvatar';

interface Props {
  trade: MockTrade;
  trader: MockTrader;
}

export function FeedPost({ trade, trader }: Props) {
  const [copyVisible, setCopyVisible] = useState(false);
  const isBuy = trade.side === 'buy';

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => router.push(`/trader/${trader.id}`)}>
        <TraderAvatar initials={trader.initials} color={trader.avatarColor} verified={trader.verified} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={styles.traderName}>{trader.name}</Text>
          <Text style={styles.handle}>{trader.handle}</Text>
        </View>
        <Text style={styles.time}>{formatRelativeMinutes(trade.minutesAgo)}</Text>
      </Pressable>

      <View style={styles.tradeRow}>
        <View style={[styles.sideBadge, { backgroundColor: isBuy ? colors.positiveMuted : colors.negativeMuted }]}>
          <Text style={[styles.sideText, { color: isBuy ? colors.positive : colors.negative }]}>
            {isBuy ? 'BOUGHT' : 'SOLD'}
          </Text>
        </View>
        <Text style={styles.assetText}>
          {formatQuantity(trade.quantity)} {trade.symbol}
        </Text>
        <Text style={styles.priceText}>@ {formatPrice(trade.price)}</Text>
      </View>

      {trade.note && <Text style={styles.note}>"{trade.note}"</Text>}

      <Pressable style={styles.copyButton} onPress={() => setCopyVisible(true)}>
        <Text style={styles.copyButtonText}>Copy This Trade (Demo)</Text>
      </Pressable>

      <CopyTradeModal
        visible={copyVisible}
        onClose={() => setCopyVisible(false)}
        assetId={trade.assetId}
        side={trade.side}
        trader={{ id: trader.id, name: trader.name }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, marginHorizontal: spacing.lg, marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  traderName: { ...typography.bodyStrong, color: colors.textPrimary },
  handle: { ...typography.caption, color: colors.textTertiary },
  time: { ...typography.caption, color: colors.textTertiary },
  tradeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  sideBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  sideText: { ...typography.captionStrong },
  assetText: { ...typography.bodyStrong, color: colors.textPrimary },
  priceText: { ...typography.body, color: colors.textSecondary },
  note: { ...typography.body, color: colors.textSecondary, fontStyle: 'italic' },
  copyButton: { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center', marginTop: spacing.xs },
  copyButtonText: { ...typography.bodyStrong, color: colors.accentSecondary },
});
