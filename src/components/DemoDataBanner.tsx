import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import { radius, spacing, typography } from '@/theme/spacing';

export function DemoDataBanner({ text }: { text: string }) {
  return (
    <View style={styles.banner}>
      <Ionicons name="information-circle" size={14} color={colors.textTertiary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { ...typography.caption, color: colors.textTertiary, flex: 1 },
});
