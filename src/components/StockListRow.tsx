import { StyleSheet, Text, View } from 'react-native';

import type { StockSymbol } from '@/api/finnhub';
import { useEnrichedStockAsset } from '@/hooks/useStocks';
import { colors } from '@/theme/colors';
import { spacing, typography } from '@/theme/spacing';
import { AssetRow } from './AssetRow';

interface Props {
  stock: StockSymbol;
}

export function StockListRow({ stock }: Props) {
  const { asset, isLoading, error } = useEnrichedStockAsset(stock, true);

  if (asset) return <AssetRow asset={asset} />;

  return (
    <View style={styles.placeholderRow}>
      <View style={styles.iconPlaceholder} />
      <View style={styles.info}>
        <Text style={styles.symbol}>{stock.displaySymbol || stock.symbol}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {stock.description}
        </Text>
      </View>
      <Text style={styles.status}>{error ? 'Unavailable' : isLoading ? 'Loading…' : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  iconPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt },
  info: { flex: 1, gap: 2 },
  symbol: { ...typography.bodyStrong, color: colors.textPrimary },
  name: { ...typography.caption, color: colors.textTertiary },
  status: { ...typography.caption, color: colors.textTertiary },
});
