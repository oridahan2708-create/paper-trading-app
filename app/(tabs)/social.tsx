import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { DemoDataBanner } from '@/components/DemoDataBanner';
import { FeedPost } from '@/components/FeedPost';
import { SegmentedControl } from '@/components/SegmentedControl';
import { getTraderById, MOCK_TRADES } from '@/data/mockTraders';
import { usePortfolioStore } from '@/store/portfolioStore';
import { colors } from '@/theme/colors';
import { spacing, typography } from '@/theme/spacing';

type Segment = 'trending' | 'following';

export default function SocialFeedScreen() {
  const [segment, setSegment] = useState<Segment>('trending');
  const followedTraders = usePortfolioStore((s) => s.followedTraders);

  const feed = useMemo(() => {
    const sorted = [...MOCK_TRADES].sort((a, b) => a.minutesAgo - b.minutesAgo);
    if (segment === 'following') {
      return sorted.filter((t) => followedTraders.includes(t.traderId));
    }
    return sorted;
  }, [segment, followedTraders]);

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <SegmentedControl
          options={[
            { value: 'trending', label: 'Trending' },
            { value: 'following', label: `Following (${followedTraders.length})` },
          ]}
          value={segment}
          onChange={setSegment}
        />
      </View>
      <DemoDataBanner text="Social feed uses simulated trader profiles and trades for demonstration." />
      <FlatList
        data={feed}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => {
          const trader = getTraderById(item.traderId);
          if (!trader) return null;
          return <FeedPost trade={item} trader={trader} />;
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptySubtitle}>Follow traders from the Leaderboard to see their trades here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerArea: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  listContent: { paddingBottom: spacing.xxxl },
  emptyState: { alignItems: 'center', marginTop: spacing.xxxl, paddingHorizontal: spacing.xl, gap: spacing.xs },
  emptyTitle: { ...typography.heading, color: colors.textPrimary },
  emptySubtitle: { ...typography.body, color: colors.textTertiary, textAlign: 'center' },
});
