import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CopyTradeModal } from '@/components/CopyTradeModal';
import { DemoDataBanner } from '@/components/DemoDataBanner';
import { LineChartView } from '@/components/charts/LineChartView';
import { MirrorPortfolioModal } from '@/components/MirrorPortfolioModal';
import { TraderAvatar } from '@/components/TraderAvatar';
import { getTraderById, getTraderHoldings, getTraderTrades } from '@/data/mockTraders';
import { usePortfolioStore } from '@/store/portfolioStore';
import { colors } from '@/theme/colors';
import { formatCompactCount, formatPercent, formatPrice, formatQuantity, formatRelativeMinutes } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

export default function TraderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trader = getTraderById(id ?? '');
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [mirrorVisible, setMirrorVisible] = useState(false);
  const [copyTrade, setCopyTrade] = useState<{ assetId: string; side: 'buy' | 'sell' } | null>(null);

  const followedTraders = usePortfolioStore((s) => s.followedTraders);
  const copyingTraders = usePortfolioStore((s) => s.copyingTraders);
  const followTrader = usePortfolioStore((s) => s.followTrader);
  const unfollowTrader = usePortfolioStore((s) => s.unfollowTrader);
  const toggleCopyTrader = usePortfolioStore((s) => s.toggleCopyTrader);

  const holdings = useMemo(() => getTraderHoldings(trader?.id ?? ''), [trader?.id]);
  const trades = useMemo(() => getTraderTrades(trader?.id ?? ''), [trader?.id]);

  if (!trader) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Trader not found</Text>
      </View>
    );
  }

  const isFollowing = followedTraders.includes(trader.id);
  const isCopying = copyingTraders.includes(trader.id);
  const equityLine = trader.equityCurve.map((value, i) => ({ time: i, value }));

  const handleCopyToggle = () => {
    if (isCopying) {
      toggleCopyTrader(trader.id);
    } else {
      setMirrorVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: trader.handle }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <DemoDataBanner text="This is a simulated trader profile for demonstration purposes." />

        <View style={styles.header}>
          <TraderAvatar initials={trader.initials} color={trader.avatarColor} verified={trader.verified} size={64} />
          <Text style={styles.name}>{trader.name}</Text>
          <Text style={styles.handle}>{trader.handle}</Text>
          <View style={styles.tagsRow}>
            {trader.focus.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.bio}>{trader.bio}</Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.followButton, isFollowing && styles.followButtonActive]}
            onPress={() => (isFollowing ? unfollowTrader(trader.id) : followTrader(trader.id))}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
          <Pressable style={[styles.copyButton, isCopying && styles.copyButtonActive]} onPress={handleCopyToggle}>
            <Ionicons name="repeat" size={16} color={isCopying ? colors.textInverse : colors.accent} />
            <Text style={[styles.copyButtonText, isCopying && styles.copyButtonTextActive]}>
              {isCopying ? 'Copying' : 'Copy Trader'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          <Stat label="All-time" value={formatPercent(trader.totalReturnPct)} positive={trader.totalReturnPct >= 0} />
          <Stat label="30d" value={formatPercent(trader.return30dPct)} positive={trader.return30dPct >= 0} />
          <Stat label="Win rate" value={`${trader.winRate}%`} />
          <Stat label="Followers" value={formatCompactCount(trader.followers)} />
        </View>

        <View style={styles.chartCard} onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width - spacing.lg * 2)}>
          <Text style={styles.sectionTitle}>Portfolio Performance (demo)</Text>
          {layoutWidth > 0 && (
            <LineChartView data={equityLine} width={layoutWidth} height={140} positive={trader.totalReturnPct >= 0} />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Holdings</Text>
          {holdings.map((h) => (
            <View key={h.assetId} style={styles.holdingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.holdingSymbol}>{h.symbol}</Text>
                <Text style={styles.holdingName}>{h.name}</Text>
              </View>
              <Text style={styles.holdingWeight}>{h.weightPct}%</Text>
              <Pressable
                style={styles.smallCopyButton}
                onPress={() => setCopyTrade({ assetId: h.assetId, side: 'buy' })}
              >
                <Text style={styles.smallCopyButtonText}>Copy</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trades</Text>
          {trades.map((t) => (
            <View key={t.id} style={styles.tradeRow}>
              <View style={[styles.sideBadge, { backgroundColor: t.side === 'buy' ? colors.positiveMuted : colors.negativeMuted }]}>
                <Text style={[styles.sideText, { color: t.side === 'buy' ? colors.positive : colors.negative }]}>
                  {t.side === 'buy' ? 'BUY' : 'SELL'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tradeSymbol}>
                  {formatQuantity(t.quantity)} {t.symbol}
                </Text>
                <Text style={styles.tradeMeta}>
                  @ {formatPrice(t.price)} · {formatRelativeMinutes(t.minutesAgo)}
                </Text>
              </View>
              <Pressable style={styles.smallCopyButton} onPress={() => setCopyTrade({ assetId: t.assetId, side: t.side })}>
                <Text style={styles.smallCopyButtonText}>Copy</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <MirrorPortfolioModal
        visible={mirrorVisible}
        onClose={() => setMirrorVisible(false)}
        trader={{ id: trader.id, name: trader.name }}
        holdings={holdings}
      />
      {copyTrade && (
        <CopyTradeModal
          visible={Boolean(copyTrade)}
          onClose={() => setCopyTrade(null)}
          assetId={copyTrade.assetId}
          side={copyTrade.side}
          trader={{ id: trader.id, name: trader.name }}
        />
      )}
    </View>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <View style={styles.statCell}>
      <Text
        style={[
          styles.statValue,
          positive === true && { color: colors.positive },
          positive === false && { color: colors.negative },
        ]}
      >
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...typography.body, color: colors.textTertiary },
  scrollContent: { paddingBottom: spacing.xxxl, gap: spacing.lg },
  header: { alignItems: 'center', paddingHorizontal: spacing.xl, gap: spacing.xs },
  name: { ...typography.displayMedium, color: colors.textPrimary, marginTop: spacing.sm },
  handle: { ...typography.body, color: colors.textTertiary },
  tagsRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs, flexWrap: 'wrap', justifyContent: 'center' },
  tag: { backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  tagText: { ...typography.caption, color: colors.textSecondary },
  bio: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl },
  followButton: { flex: 1, backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  followButtonActive: { backgroundColor: colors.surface },
  followButtonText: { ...typography.bodyStrong, color: colors.textPrimary },
  followButtonTextActive: { color: colors.textPrimary },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  copyButtonText: { ...typography.bodyStrong, color: colors.accent },
  copyButtonTextActive: { color: colors.textInverse },
  statsGrid: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm },
  statCell: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', gap: 4 },
  statValue: { ...typography.bodyStrong, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  chartCard: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm },
  sectionTitle: { ...typography.subheading, color: colors.textPrimary },
  section: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  holdingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  holdingSymbol: { ...typography.bodyStrong, color: colors.textPrimary },
  holdingName: { ...typography.caption, color: colors.textTertiary },
  holdingWeight: { ...typography.body, color: colors.textSecondary, width: 44, textAlign: 'right' },
  tradeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sideBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm },
  sideText: { ...typography.captionStrong },
  tradeSymbol: { ...typography.bodyStrong, color: colors.textPrimary },
  tradeMeta: { ...typography.caption, color: colors.textTertiary },
  smallCopyButton: { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  smallCopyButtonText: { ...typography.captionStrong, color: colors.accentSecondary },
});
