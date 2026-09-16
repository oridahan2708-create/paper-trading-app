import { StyleSheet, Text, View } from 'react-native';

import type { AnalystProfile } from '@/data/analysts';
import { colors } from '@/theme/colors';
import { radius, spacing, typography } from '@/theme/spacing';

export function AnalystCard({ analyst }: { analyst: AnalystProfile }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {analyst.name
            .split(' ')
            .map((p) => p[0])
            .join('')}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{analyst.name}</Text>
        <Text style={styles.title}>{analyst.title}</Text>
        <Text style={styles.bio}>{analyst.bio}</Text>
        <View style={styles.tagsRow}>
          {analyst.focus.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginHorizontal: spacing.lg, marginBottom: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.bodyStrong, color: colors.textSecondary },
  name: { ...typography.bodyStrong, color: colors.textPrimary },
  title: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  bio: { ...typography.body, color: colors.textSecondary, lineHeight: 19 },
  tagsRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm, flexWrap: 'wrap' },
  tag: { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  tagText: { ...typography.caption, color: colors.textSecondary },
});
