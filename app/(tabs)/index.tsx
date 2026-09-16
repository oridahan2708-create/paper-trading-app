import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { AssetRow } from '@/components/AssetRow';
import { SearchBar } from '@/components/SearchBar';
import { SegmentedControl } from '@/components/SegmentedControl';
import { StockListRow } from '@/components/StockListRow';
import { TrendingStrip } from '@/components/TrendingStrip';
import { useCryptoMarkets, useCryptoSearch } from '@/hooks/useCryptoMarkets';
import { useStockSearch, useStockSymbols } from '@/hooks/useStocks';
import { colors } from '@/theme/colors';
import { spacing, typography } from '@/theme/spacing';

type Segment = 'crypto' | 'stocks';

export default function DashboardScreen() {
  const [segment, setSegment] = useState<Segment>('crypto');
  const [query, setQuery] = useState('');
  const isSearching = query.trim().length > 0;

  const crypto = useCryptoMarkets();
  const stocks = useStockSymbols();
  const cryptoSearch = useCryptoSearch(query);
  const stockSearch = useStockSearch(query);

  const filteredStocks = useMemo(() => {
    if (!stocks.data) return [];
    return stocks.data;
  }, [stocks.data]);

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <SearchBar value={query} onChangeText={setQuery} />
        {!isSearching && (
          <SegmentedControl
            options={[
              { value: 'crypto', label: 'Crypto' },
              { value: 'stocks', label: 'Stocks' },
            ]}
            value={segment}
            onChange={setSegment}
          />
        )}
      </View>

      {isSearching ? (
        <FlatList
          data={[
            ...(cryptoSearch.data ?? []).map((a) => ({ kind: 'crypto' as const, asset: a })),
            ...(stockSearch.data ?? []).map((s) => ({ kind: 'stock' as const, stock: s })),
          ]}
          keyExtractor={(item, i) => (item.kind === 'crypto' ? item.asset.id : `stock:${item.stock.symbol}`) + i}
          renderItem={({ item }) =>
            item.kind === 'crypto' ? <AssetRow asset={item.asset} /> : <StockListRow stock={item.stock} />
          }
          ListEmptyComponent={
            cryptoSearch.isLoading || stockSearch.isLoading ? (
              <ActivityIndicator style={styles.spinner} color={colors.accent} />
            ) : (
              <Text style={styles.emptyText}>No results for "{query}"</Text>
            )
          }
          contentContainerStyle={styles.listContent}
        />
      ) : segment === 'crypto' ? (
        <FlatList
          data={crypto.data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AssetRow asset={item} />}
          ListHeaderComponent={crypto.data ? <TrendingStrip assets={crypto.data.slice(0, 50)} /> : null}
          onEndReached={() => crypto.hasNextPage && crypto.fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            crypto.isFetchingNextPage ? <ActivityIndicator style={styles.spinner} color={colors.accent} /> : null
          }
          ListEmptyComponent={
            crypto.isLoading ? (
              <ActivityIndicator style={styles.spinner} color={colors.accent} />
            ) : crypto.isError ? (
              <Text style={styles.emptyText}>{(crypto.error as Error)?.message ?? 'Failed to load markets'}</Text>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={7}
        />
      ) : (
        <FlatList
          data={filteredStocks}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => <StockListRow stock={item} />}
          ListHeaderComponent={
            stocks.isLoading ? null : (
              <Text style={styles.helperText}>
                {filteredStocks.length.toLocaleString()} US-listed stocks &amp; ETFs — prices update live as you scroll
              </Text>
            )
          }
          ListEmptyComponent={
            stocks.isLoading ? (
              <ActivityIndicator style={styles.spinner} color={colors.accent} />
            ) : stocks.isError ? (
              <Text style={styles.emptyText}>{(stocks.error as Error)?.message ?? 'Failed to load stock list'}</Text>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerArea: { padding: spacing.lg, gap: spacing.md },
  listContent: { paddingBottom: spacing.xxxl },
  spinner: { marginTop: spacing.xxl },
  emptyText: { ...typography.body, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.xxl },
  helperText: { ...typography.caption, color: colors.textTertiary, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
});
