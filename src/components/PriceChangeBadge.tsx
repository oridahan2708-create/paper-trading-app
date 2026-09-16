import { StyleSheet, Text, View } from 'react-native';

import { changeColor, changeMutedColor } from '@/theme/colors';
import { formatPercent } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

interface Props {
  value: number | null | undefined;
  size?: 'sm' | 'md';
}

export function PriceChangeBadge({ value, size = 'sm' }: Props) {
  const color = changeColor(value ?? 0);
  const bg = changeMutedColor(value ?? 0);
  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'md' && styles.badgeMd]}>
      <Text style={[styles.text, { color }, size === 'md' && styles.textMd]}>{formatPercent(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill, alignSelf: 'flex-start' },
  badgeMd: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  text: { ...typography.captionStrong },
  textMd: { ...typography.bodyStrong },
});
