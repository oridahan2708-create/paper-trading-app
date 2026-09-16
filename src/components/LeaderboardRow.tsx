import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors } from '@/theme/colors';
import { radius, spacing, typography } from '@/theme/spacing';
import { TraderAvatar } from './TraderAvatar';

interface Props {
  rank: number;
  name: string;
  handle: string;
  initials: string;
  color: string;
  verified?: boolean;
  primaryStatText: string;
  primaryStatColor?: string;
  primaryStatLabel: string;
  secondaryText: string;
  isYou?: boolean;
  traderId?: string;
}

export function LeaderboardRow({
  rank,
  name,
  handle,
  initials,
  color,
  verified,
  primaryStatText,
  primaryStatColor,
  primaryStatLabel,
  secondaryText,
  isYou,
  traderId,
}: Props) {
  const rankColor = rank === 1 ? colors.gold : rank === 2 ? colors.silver : rank === 3 ? colors.bronze : colors.textTertiary;

  return (
    <Pressable
      style={[styles.row, isYou && styles.rowYou]}
      onPress={() => traderId && router.push(`/trader/${traderId}`)}
      disabled={!traderId}
    >
      <Text style={[styles.rank, { color: rankColor }]}>{rank}</Text>
      <TraderAvatar initials={initials} color={color} verified={verified} size={38} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name} {isYou && '(You)'}
        </Text>
        <Text style={styles.handle} numberOfLines={1}>
          {handle} · {secondaryText}
        </Text>
      </View>
      <View style={styles.statCol}>
        <Text style={[styles.statValue, primaryStatColor ? { color: primaryStatColor } : null]}>{primaryStatText}</Text>
        <Text style={styles.statLabel}>{primaryStatLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.md },
  rowYou: { backgroundColor: colors.accentMuted, borderRadius: radius.md },
  rank: { ...typography.heading, width: 24, textAlign: 'center' },
  info: { flex: 1, gap: 2 },
  name: { ...typography.bodyStrong, color: colors.textPrimary },
  handle: { ...typography.caption, color: colors.textTertiary },
  statCol: { alignItems: 'flex-end' },
  statValue: { ...typography.bodyStrong, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textTertiary },
});
