import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { EducationArticle } from '@/data/education';
import { colors } from '@/theme/colors';
import { radius, spacing, typography } from '@/theme/spacing';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function EducationCard({ article }: { article: EducationArticle }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <Pressable style={styles.card} onPress={toggle}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.title}>{article.title}</Text>
          {!expanded && <Text style={styles.summary}>{article.summary}</Text>}
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textTertiary} />
      </View>
      {expanded && (
        <View style={styles.body}>
          {article.body.map((paragraph, i) => (
            <Text key={i} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginHorizontal: spacing.lg, marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  category: { ...typography.captionStrong, color: colors.accentSecondary, marginBottom: 2 },
  title: { ...typography.subheading, color: colors.textPrimary },
  summary: { ...typography.caption, color: colors.textTertiary, marginTop: 4 },
  body: { marginTop: spacing.md, gap: spacing.sm },
  paragraph: { ...typography.body, color: colors.textSecondary, lineHeight: 20 },
});
