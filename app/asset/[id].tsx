import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { BuySellModal } from '@/components/BuySellModal';
import { AssetChart } from '@/components/charts/AssetChart';
import { PriceChangeBadge } from '@/components/PriceChangeBadge';
import { useAssetDetail } from '@/hooks/useAssetDetail';
import { usePortfolioStore } from '@/store/portfolioStore';
import { colors } from '@/theme/colors';
import { formatCompactNumber, formatPrice, formatQuantity } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const decodedId = decodeURIComponent(id ?? '');
  const { data: asset, isLoading, isError, error } = useAssetDetail(decodedId);
  const position = usePortfolioStore((s) => s.positions[decodedId]);
  const [tradeModal, setTradeModal] = useState<{ visible: boolean; side: 'buy' | 'sell' }>({
    visible: false,
    side: 'buy',
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (isError || !asset) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error instanceof Error ? error.message : 'Failed to load asset'}</Text>
      </View>
    );
  }

  const positive = (asset.change24h ?? 0) >= 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: asset.symbol }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {asset.image && <Image source={{ uri: asset.image }} style={styles.headerImage} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{asset.name}</Text>
            <Text style={styles.symbol}>
              {asset.symbol} · {asset.assetClass === 'crypto' ? 'Crypto' : 'Stock'}
            </Text>
          </View>
        </View>

        <View style={styles.priceBlock}>
          <Text style={styles.price}>{formatPrice(asset.price)}</Text>
          <PriceChangeBadge value={asset.change24h} size="md" />
        </View>

        <AssetChart assetId={asset.id} positive={positive} />

        <View style={styles.statsGrid}>
          <StatCell label="24h" value={asset.change24h} isPercent />
          <StatCell label="7d" value={asset.change7d} isPercent />
          <StatCell label="30d" value={asset.change30d} isPercent />
        </View>

        {(asset.marketCap != null || asset.volume24h != null) && (
          <View style={styles.metaGrid}>
            {asset.marketCap != null && <MetaRow label="Market Cap" value={formatCompactNumber(asset.marketCap)} />}
            {asset.volume24h != null && <MetaRow label="24h Volume" value={formatCompactNumber(asset.volume24h)} />}
            {asset.rank != null && <MetaRow label="Rank" value={`#${asset.rank}`} />}
          </View>
        )}

        {position && (
          <View style={styles.positionCard}>
            <Text style={styles.positionTitle}>Your Position</Text>
            <View style={styles.positionRow}>
              <Text style={styles.positionLabel}>Holdings</Text>
              <Text style={styles.positionValue}>{formatQuantity(position.quantity)} {asset.symbol}</Text>
            </View>
            <View style={styles.positionRow}>
              <Text style={styles.positionLabel}>Avg Cost</Text>
              <Text style={styles.positionValue}>{formatPrice(position.avgCost)}</Text>
            </View>
            <View style={styles.positionRow}>
              <Text style={styles.positionLabel}>Market Value</Text>
              <Text style={styles.positionValue}>{formatPrice(position.quantity * asset.price)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          style={[styles.actionButton, styles.sellButton, !position && styles.actionButtonDisabled]}
          onPress={() => position && setTradeModal({ visible: true, side: 'sell' })}
          disabled={!position}
        >
          <Text style={styles.actionButtonText}>Sell</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.buyButton]} onPress={() => setTradeModal({ visible: true, side: 'buy' })}>
          <Text style={styles.actionButtonText}>Buy</Text>
        </Pressable>
      </View>

      <BuySellModal
        visible={tradeModal.visible}
        initialSide={tradeModal.side}
        asset={asset}
        onClose={() => setTradeModal((s) => ({ ...s, visible: false }))}
      />
    </View>
  );
}

function StatCell({ label, value, isPercent }: { label: string; value: number | null; isPercent?: boolean }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statLabel}>{label}</Text>
      {isPercent ? <PriceChangeBadge value={value} /> : <Text style={styles.statValue}>{value ?? '—'}</Text>}
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  errorText: { ...typography.body, color: colors.textTertiary, textAlign: 'center' },
  scrollContent: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerImage: { width: 44, height: 44, borderRadius: radius.pill },
  name: { ...typography.heading, color: colors.textPrimary },
  symbol: { ...typography.caption, color: colors.textTertiary },
  priceBlock: { gap: spacing.xs },
  price: { ...typography.displayLarge, color: colors.textPrimary },
  statsGrid: { flexDirection: 'row', gap: spacing.sm },
  statCell: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs, alignItems: 'flex-start' },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  statValue: { ...typography.bodyStrong, color: colors.textPrimary },
  metaGrid: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { ...typography.body, color: colors.textTertiary },
  metaValue: { ...typography.bodyStrong, color: colors.textPrimary },
  positionCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  positionTitle: { ...typography.subheading, color: colors.textPrimary, marginBottom: spacing.xs },
  positionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  positionLabel: { ...typography.body, color: colors.textTertiary },
  positionValue: { ...typography.bodyStrong, color: colors.textPrimary },
  actionBar: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  actionButton: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  actionButtonDisabled: { opacity: 0.4 },
  buyButton: { backgroundColor: colors.positive },
  sellButton: { backgroundColor: colors.negative },
  actionButtonText: { ...typography.heading, color: colors.textInverse },
});
