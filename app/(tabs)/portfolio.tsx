import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AdjustBalanceModal } from '@/components/AdjustBalanceModal';
import { PositionRow } from '@/components/PositionRow';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TradeHistoryRow } from '@/components/TradeHistoryRow';
import { usePortfolioValuation } from '@/hooks/usePortfolioValuation';
import { usePortfolioStore } from '@/store/portfolioStore';
import { changeColor, colors } from '@/theme/colors';
import { formatPercent, formatPrice } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

type Tab = 'positions' | 'history';

export default function PortfolioScreen() {
  const [tab, setTab] = useState<Tab>('positions');
  const [balanceModalVisible, setBalanceModalVisible] = useState(false);
  const { valuedPositions, cashBalance, totalValue, totalReturn, totalReturnPct } = usePortfolioValuation();
  const history = usePortfolioStore((s) => s.history);

  const returnColor = changeColor(totalReturn);

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
        <Text style={styles.totalValue}>{formatPrice(totalValue)}</Text>
        <Text style={[styles.returnText, { color: returnColor }]}>
          {totalReturn >= 0 ? '+' : ''}
          {formatPrice(totalReturn)} ({formatPercent(totalReturnPct)}) all-time
        </Text>
        <View style={styles.summaryFooter}>
          <View>
            <Text style={styles.summaryLabel}>Cash available</Text>
            <Text style={styles.cashValue}>{formatPrice(cashBalance)}</Text>
          </View>
          <Pressable style={styles.adjustButton} onPress={() => setBalanceModalVisible(true)}>
            <Text style={styles.adjustButtonText}>Adjust Balance</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.tabsWrapper}>
        <SegmentedControl
          options={[
            { value: 'positions', label: `Positions (${valuedPositions.length})` },
            { value: 'history', label: `History (${history.length})` },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>

      {tab === 'positions' ? (
        <FlatList
          data={valuedPositions}
          keyExtractor={(p) => p.assetId}
          renderItem={({ item }) => <PositionRow position={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No open positions</Text>
              <Text style={styles.emptySubtitle}>Buy a stock or coin from the Markets tab to get started.</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => <TradeHistoryRow trade={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No trades yet</Text>
              <Text style={styles.emptySubtitle}>Your buy and sell history will show up here.</Text>
            </View>
          }
        />
      )}

      <AdjustBalanceModal visible={balanceModalVisible} onClose={() => setBalanceModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  summaryCard: { margin: spacing.lg, padding: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.xl, gap: 4 },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  totalValue: { ...typography.displayLarge, color: colors.textPrimary },
  returnText: { ...typography.bodyStrong },
  summaryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: spacing.lg },
  cashValue: { ...typography.heading, color: colors.textPrimary },
  adjustButton: { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  adjustButtonText: { ...typography.bodyStrong, color: colors.textPrimary },
  tabsWrapper: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  listContent: { paddingBottom: spacing.xxxl },
  emptyState: { alignItems: 'center', marginTop: spacing.xxxl, paddingHorizontal: spacing.xl, gap: spacing.xs },
  emptyTitle: { ...typography.heading, color: colors.textPrimary },
  emptySubtitle: { ...typography.body, color: colors.textTertiary, textAlign: 'center' },
});
