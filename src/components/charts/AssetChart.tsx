import { useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useChartData } from '@/hooks/useChartData';
import { colors } from '@/theme/colors';
import { radius, spacing, typography } from '@/theme/spacing';
import type { ChartRange } from '@/api/types';
import { LineChartView } from './LineChartView';
import { CandlestickChartView } from './CandlestickChartView';

const RANGES: ChartRange[] = ['1D', '1W', '1M', '3M', '1Y'];
const CHART_HEIGHT = 220;

interface Props {
  assetId: string;
  positive: boolean;
}

export function AssetChart({ assetId, positive }: Props) {
  const [range, setRange] = useState<ChartRange>('1M');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [width, setWidth] = useState(0);
  const { data, isLoading, isError, error } = useChartData(assetId, range);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.rangeRow}>
          {RANGES.map((r) => (
            <Pressable key={r} onPress={() => setRange(r)} style={[styles.rangeChip, range === r && styles.rangeChipActive]}>
              <Text style={[styles.rangeText, range === r && styles.rangeTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.typeToggle}>
          <Pressable
            onPress={() => setChartType('line')}
            style={[styles.typeButton, chartType === 'line' && styles.typeButtonActive]}
          >
            <Ionicons name="trending-up" size={16} color={chartType === 'line' ? colors.textPrimary : colors.textTertiary} />
          </Pressable>
          <Pressable
            onPress={() => setChartType('candlestick')}
            style={[styles.typeButton, chartType === 'candlestick' && styles.typeButtonActive]}
          >
            <Ionicons name="stats-chart" size={16} color={chartType === 'candlestick' ? colors.textPrimary : colors.textTertiary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.chartArea} onLayout={onLayout}>
        {isLoading && <ActivityIndicator color={colors.accent} />}
        {isError && (
          <Text style={styles.errorText}>{error instanceof Error ? error.message : 'Failed to load chart data'}</Text>
        )}
        {!isLoading && !isError && data && width > 0 && (
          chartType === 'line' ? (
            <LineChartView data={data.line} width={width} height={CHART_HEIGHT} positive={positive} />
          ) : (
            <CandlestickChartView data={data.candles} width={width} height={CHART_HEIGHT} />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rangeRow: { flexDirection: 'row', gap: spacing.xs },
  rangeChip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.pill },
  rangeChipActive: { backgroundColor: colors.surfaceAlt },
  rangeText: { ...typography.captionStrong, color: colors.textTertiary },
  rangeTextActive: { color: colors.textPrimary },
  typeToggle: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 2 },
  typeButton: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.sm },
  typeButtonActive: { backgroundColor: colors.surfaceAlt },
  chartArea: { height: CHART_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  errorText: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', paddingHorizontal: spacing.lg },
});
