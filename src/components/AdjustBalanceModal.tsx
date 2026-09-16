import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { usePortfolioStore } from '@/store/portfolioStore';
import { colors } from '@/theme/colors';
import { radius, spacing, typography } from '@/theme/spacing';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PRESETS = [0, 1_000, 10_000, 100_000, 1_000_000];

export function AdjustBalanceModal({ visible, onClose }: Props) {
  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const setCashBalance = usePortfolioStore((s) => s.setCashBalance);
  const resetPortfolio = usePortfolioStore((s) => s.resetPortfolio);
  const [text, setText] = useState(String(cashBalance));

  const parsed = Math.max(0, parseFloat(text) || 0);

  const applyAdjust = () => {
    setCashBalance(parsed);
    onClose();
  };

  const applyReset = () => {
    resetPortfolio(parsed);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Set Virtual Balance</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={styles.subtitle}>Practice with any size portfolio — from $0 up to any amount.</Text>

          <View style={styles.amountRow}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.presetRow}>
            {PRESETS.map((p) => (
              <Pressable key={p} style={styles.presetChip} onPress={() => setText(String(p))}>
                <Text style={styles.presetChipText}>${p.toLocaleString()}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.primaryButton} onPress={applyAdjust}>
            <Text style={styles.primaryButtonText}>Set Cash Balance</Text>
          </Pressable>
          <Text style={styles.helper}>Adjusts your cash without touching current positions.</Text>

          <Pressable style={styles.secondaryButton} onPress={applyReset}>
            <Text style={styles.secondaryButtonText}>Reset Entire Portfolio to This Amount</Text>
          </Pressable>
          <Text style={styles.helper}>Clears all positions and trade history for a fresh start.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.heading, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textTertiary },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  dollarSign: { ...typography.displayMedium, color: colors.textSecondary },
  amountInput: { ...typography.displayLarge, color: colors.textPrimary, flex: 1, padding: 0 },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  presetChip: { backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  presetChipText: { ...typography.captionStrong, color: colors.textPrimary },
  primaryButton: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.md },
  primaryButtonText: { ...typography.heading, color: colors.textPrimary },
  secondaryButton: { backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  secondaryButtonText: { ...typography.bodyStrong, color: colors.textPrimary },
  helper: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: -spacing.sm },
});
