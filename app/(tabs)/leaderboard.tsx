import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { DemoDataBanner } from '@/components/DemoDataBanner';
import { LeaderboardRow } from '@/components/LeaderboardRow';
import { SegmentedControl } from '@/components/SegmentedControl';
import { MOCK_TRADERS } from '@/data/mockTraders';
import { usePortfolioValuation } from '@/hooks/usePortfolioValuation';
import { changeColor, colors } from '@/theme/colors';
import { formatCompactCount, formatPercent } from '@/lib/format';
import { spacing, typography } from '@/theme/spacing';

type Board = 'traders' | 'demo';
type Metric = 'return' | 'winRate' | 'volume';

export default function LeaderboardScreen() {
  const [board, setBoard] = useState<Board>('traders');
  const [metric, setMetric] = useState<Metric>('return');
  const { totalReturnPct } = usePortfolioValuation();

  const rankedTraders = useMemo(() => {
    const sorted = [...MOCK_TRADERS];
    if (metric === 'return') sorted.sort((a, b) => b.totalReturnPct - a.totalReturnPct);
    else if (metric === 'winRate') sorted.sort((a, b) => b.winRate - a.winRate);
    else sorted.sort((a, b) => b.volumeTraded - a.volumeTraded);
    return sorted;
  }, [metric]);

  const demoEntries = useMemo(() => {
    const entries = MOCK_TRADERS.map((t) => ({
      id: t.id,
      name: t.name,
      handle: t.handle,
      initials: t.initials,
      color: t.avatarColor,
      verified: t.verified,
      value: t.totalReturnPct,
      isYou: false,
    }));
    entries.push({
      id: 'you',
      name: 'You',
      handle: '@you',
      initials: 'ME',
      color: colors.accent,
      verified: false,
      value: totalReturnPct,
      isYou: true,
    });
    return entries.sort((a, b) => b.value - a.value);
  }, [totalReturnPct]);

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <SegmentedControl
          options={[
            { value: 'traders', label: 'Top Traders' },
            { value: 'demo', label: 'Demo: You vs. All' },
          ]}
          value={board}
          onChange={setBoard}
        />
      </View>
      <DemoDataBanner text="Leaderboard ranks simulated trader profiles for demonstration purposes." />

      {board === 'traders' && (
        <View style={styles.metricRow}>
          <SegmentedControl
            options={[
              { value: 'return', label: 'Gains' },
              { value: 'winRate', label: 'Win Rate' },
              { value: 'volume', label: 'Volume' },
            ]}
            value={metric}
            onChange={setMetric}
          />
        </View>
      )}

      {board === 'traders' ? (
        <FlatList
          data={rankedTraders}
          keyExtractor={(t) => t.id}
          renderItem={({ item, index }) => {
            const statValue = metric === 'winRate' ? item.winRate : metric === 'return' ? item.totalReturnPct : item.volumeTraded;
            const statText =
              metric === 'volume' ? `$${formatCompactCount(item.volumeTraded)}` : formatPercent(statValue);
            const statColor = metric === 'volume' ? colors.textPrimary : changeColor(statValue);
            return (
              <LeaderboardRow
                rank={index + 1}
                name={item.name}
                handle={item.handle}
                initials={item.initials}
                color={item.avatarColor}
                verified={item.verified}
                traderId={item.id}
                primaryStatText={statText}
                primaryStatColor={statColor}
                primaryStatLabel={metric === 'winRate' ? 'win rate' : metric === 'return' ? 'all-time' : 'traded'}
                secondaryText={`${formatCompactCount(item.followers)} followers`}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={demoEntries}
          keyExtractor={(e) => e.id}
          renderItem={({ item, index }) => (
            <LeaderboardRow
              rank={index + 1}
              name={item.name}
              handle={item.handle}
              initials={item.initials}
              color={item.color}
              verified={item.verified}
              isYou={item.isYou}
              traderId={item.isYou ? undefined : item.id}
              primaryStatText={formatPercent(item.value)}
              primaryStatColor={changeColor(item.value)}
              primaryStatLabel="all-time"
              secondaryText={item.isYou ? 'Your paper portfolio' : 'Simulated trader'}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<Text style={styles.demoHeader}>How your paper portfolio stacks up against demo traders</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerArea: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  metricRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  listContent: { paddingBottom: spacing.xxxl },
  demoHeader: { ...typography.caption, color: colors.textTertiary, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
});
