import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { MockHolding } from '@/data/mockTraders';
import { useLivePrices } from '@/hooks/useLivePrices';
import { usePortfolioStore } from '@/store/portfolioStore';
import { colors } from '@/theme/colors';
import { formatPrice } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

interface Props {
  visible: boolean;
  onClose: () => void;
  trader: { id: string; name: string };
  holdings: MockHolding[];
}

const PRESETS = [1_000, 5_000, 10_000, 25_000];

export function MirrorPortfolioModal({ visible, onClose, trader, holdings }: Props) {
  const [amountText, setAmountText] = useState('5000');
  const [error, setError] = useState<string | null>(null);
  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const buy = usePortfolioStore((s) => s.buy);
  const toggleCopyTrader = usePortfolioStore((s) => s.toggleCopyTrader);

  const ids = holdings.map((h) => h.assetId);
  const { prices, isLoading } = useLivePrices(visible ? ids : []);

  const amount = parseFloat(amountText) || 0;

  const handleConfirm = () => {
    setError(null);
    if (amount <= 0) {
      setError('Enter an allocation amount');
      return;
    }
    if (amount > cashBalance) {
      setError('Insufficient virtual balance for this allocation');
      return;
    }
    for (const holding of holdings) {
      const live = prices[holding.assetId];
      if (!live) continue;
      const usdAmount = (amount * holding.weightPct) / 100;
      const quantity = usdAmount / live.price;
      if (quantity > 0) {
        buy(
          { id: holding.assetId, symbol: holding.symbol, name: holding.name, assetClass: holding.assetClass, image: holding.image },
          quantity,
          live.price,
          'copy',
          trader
        );
      }
    }
    toggleCopyTrader(trader.id);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Copy {trader.name}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={styles.subtitle}>
            We'll mirror their current holdings proportionally using your demo balance at today's live prices.
          </Text>

          <View style={styles.amountRow}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              value={amountText}
              onChangeText={setAmountText}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          <View style={styles.presetRow}>
            {PRESETS.map((p) => (
              <Pressable key={p} style={styles.presetChip} onPress={() => setAmountText(String(p))}>
                <Text style={styles.presetChipText}>${p.toLocaleString()}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.holdingsPreview}>
            {holdings.map((h) => (
              <View key={h.assetId} style={styles.holdingRow}>
                <Text style={styles.holdingSymbol}>{h.symbol}</Text>
                <Text style={styles.holdingWeight}>{h.weightPct}%</Text>
                <Text style={styles.holdingUsd}>{formatPrice((amount * h.weightPct) / 100)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.availableText}>Available: {formatPrice(cashBalance)}</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable style={styles.submitButton} onPress={handleConfirm} disabled={isLoading}>
            <Text style={styles.submitButtonText}>{isLoading ? 'Fetching live prices…' : 'Start Copying (Demo)'}</Text>
          </Pressable>
          <Text style={styles.disclaimer}>Paper trading only — no real money is used.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.backgroundElevated, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.heading, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textTertiary },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dollarSign: { ...typography.displayMedium, color: colors.textSecondary },
  amountInput: { ...typography.displayLarge, color: colors.textPrimary, flex: 1, padding: 0 },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  presetChip: { backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  presetChipText: { ...typography.captionStrong, color: colors.textPrimary },
  holdingsPreview: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  holdingRow: { flexDirection: 'row', justifyContent: 'space-between' },
  holdingSymbol: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 },
  holdingWeight: { ...typography.body, color: colors.textTertiary, width: 50, textAlign: 'right' },
  holdingUsd: { ...typography.bodyStrong, color: colors.textPrimary, width: 90, textAlign: 'right' },
  availableText: { ...typography.caption, color: colors.textSecondary },
  errorText: { ...typography.bodyStrong, color: colors.negative },
  submitButton: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  submitButtonText: { ...typography.heading, color: colors.textPrimary },
  disclaimer: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
});
