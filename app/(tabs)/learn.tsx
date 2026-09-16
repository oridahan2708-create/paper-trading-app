import { useMemo, type ReactNode } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnalystCard } from '@/components/AnalystCard';
import { AssetRow } from '@/components/AssetRow';
import { DemoDataBanner } from '@/components/DemoDataBanner';
import { EducationCard } from '@/components/EducationCard';
import { CURATED_ANALYSTS } from '@/data/analysts';
import { EDUCATION_ARTICLES } from '@/data/education';
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets';
import { useSpotlightStocks } from '@/hooks/useSpotlightStocks';
import { colors } from '@/theme/colors';
import { spacing, typography } from '@/theme/spacing';

export default function LearnScreen() {
  const crypto = useCryptoMarkets();
  const { assets: spotlightStocks, isLoading: stocksLoading } = useSpotlightStocks();

  const topGainersCrypto = useMemo(() => {
    return [...(crypto.data ?? [])]
      .filter((a) => a.change24h != null)
      .sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0))
      .slice(0, 5);
  }, [crypto.data]);

  const topGainersStocks = useMemo(() => {
    return [...spotlightStocks].sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0)).slice(0, 5);
  }, [spotlightStocks]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Section title="Trending & Top Performers" subtitle="Based on live 24h price data. Not financial advice.">
        <Text style={styles.subheading}>Crypto Movers</Text>
        {crypto.isLoading ? (
          <ActivityIndicator color={colors.accent} style={styles.spinner} />
        ) : (
          topGainersCrypto.map((a) => <AssetRow key={a.id} asset={a} />)
        )}
        <Text style={[styles.subheading, { marginTop: spacing.md }]}>Stock Spotlight</Text>
        {stocksLoading ? (
          <ActivityIndicator color={colors.accent} style={styles.spinner} />
        ) : (
          topGainersStocks.map((a) => <AssetRow key={a.id} asset={a} />)
        )}
      </Section>

      <Section title="Learn the Basics" subtitle="Beginner-friendly guides on evaluating assets and trading concepts.">
        {EDUCATION_ARTICLES.map((article) => (
          <EducationCard key={article.id} article={article} />
        ))}
      </Section>

      <Section title="People to Follow" subtitle="Well-known investors and educators. Verify official accounts yourself — impersonation scams are common.">
        <DemoDataBanner text="Bios show general public facts only, not performance claims or endorsements. Not financial advice." />
        {CURATED_ANALYSTS.map((analyst) => (
          <AnalystCard key={analyst.id} analyst={analyst} />
        ))}
      </Section>
    </ScrollView>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxxl, paddingTop: spacing.sm },
  section: { marginBottom: spacing.xl },
  sectionHeader: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { ...typography.displayMedium, color: colors.textPrimary, fontSize: 20 },
  sectionSubtitle: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  subheading: { ...typography.bodyStrong, color: colors.textSecondary, paddingHorizontal: spacing.lg, marginBottom: spacing.xs },
  spinner: { marginVertical: spacing.lg },
});
