import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { Asset } from '@/api/types';
import { usePortfolioStore } from '@/store/portfolioStore';
import { colors } from '@/theme/colors';
import { formatPrice, formatQuantity } from '@/lib/format';
import { radius, spacing, typography } from '@/theme/spacing';

interface Props {
  visible: boolean;
  onClose: () => void;
  asset: Asset;
  initialSide?: 'buy' | 'sell';
}

const QUICK_PERCENTAGES = [25, 50, 75, 100];

export function BuySellModal({ visible, onClose, asset, initialSide = 'buy' }: Props) {
  const [side, setSide] = useState<'buy' | 'sell'>(initialSide);
  const [amountText, setAmountText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const position = usePortfolioStore((s) => s.positions[asset.id]);
  const buy = usePortfolioStore((s) => s.buy);
  const sell = usePortfolioStore((s) => s.sell);

  const heldQuantity = position?.quantity ?? 0;
  const amountUsd = parseFloat(amountText) || 0;
  const quantity = asset.price > 0 ? amountUsd / asset.price : 0;

  const maxUsd = side === 'buy' ? cashBalance : heldQuantity * asset.price;

  const applyPercentage = (pct: number) => {
    const value = (maxUsd * pct) / 100;
    setAmountText(value > 0 ? value.toFixed(2) : '');
  };

  const handleSubmit = () => {
    setError(null);
    if (amountUsd <= 0) {
      setError('Enter an amount');
      return;
    }
    const assetRef = { id: asset.id, symbol: asset.symbol, name: asset.name, assetClass: asset.assetClass, image: asset.image };
    const result =
      side === 'buy' ? buy(assetRef, quantity, asset.price) : sell(asset.id, quantity, asset.price);
    if (!result.ok) {
      setError(result.error ?? 'Trade failed');
      return;
    }
    setAmountText('');
    onClose();
  };

  const title = useMemo(() => `${side === 'buy' ? 'Buy' : 'Sell'} ${asset.symbol}`, [side, asset.symbol]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.sideToggle}>
            <Pressable
              style={[styles.sideButton, side === 'buy' && styles.sideButtonBuyActive]}
              onPress={() => setSide('buy')}
            >
              <Text style={[styles.sideButtonText, side === 'buy' && styles.sideButtonTextActive]}>Buy</Text>
            </Pressable>
            <Pressable
              style={[styles.sideButton, side === 'sell' && styles.sideButtonSellActive]}
              onPress={() => setSide('sell')}
            >
              <Text style={[styles.sideButtonText, side === 'sell' && styles.sideButtonTextActive]}>Sell</Text>
            </Pressable>
          </View>

          <Text style={styles.priceLabel}>Market price: {formatPrice(asset.price)} (demo, live)</Text>

          <View style={styles.amountRow}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              value={amountText}
              onChangeText={setAmountText}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              style={styles.amountInput}
              autoFocus
            />
          </View>
          <Text style={styles.quantityPreview}>≈ {formatQuantity(quantity)} {asset.symbol}</Text>

          <View style={styles.quickRow}>
            {QUICK_PERCENTAGES.map((pct) => (
              <Pressable key={pct} style={styles.quickChip} onPress={() => applyPercentage(pct)}>
                <Text style={styles.quickChipText}>{pct}%</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.availableText}>
            {side === 'buy'
              ? `Available: ${formatPrice(cashBalance)}`
              : `You hold: ${formatQuantity(heldQuantity)} ${asset.symbol} (${formatPrice(heldQuantity * asset.price)})`}
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.submitButton, side === 'sell' && styles.submitButtonSell]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>{side === 'buy' ? 'Buy (Demo)' : 'Sell (Demo)'}</Text>
          </Pressable>
          <Text style={styles.disclaimer}>Paper trading only — no real money is used.</Text>
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
  sideToggle: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 3, gap: 2 },
  sideButton: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: 'center' },
  sideButtonBuyActive: { backgroundColor: colors.positiveMuted },
  sideButtonSellActive: { backgroundColor: colors.negativeMuted },
  sideButtonText: { ...typography.bodyStrong, color: colors.textTertiary },
  sideButtonTextActive: { color: colors.textPrimary },
  priceLabel: { ...typography.caption, color: colors.textTertiary },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  dollarSign: { ...typography.displayMedium, color: colors.textSecondary },
  amountInput: { ...typography.displayLarge, color: colors.textPrimary, flex: 1, padding: 0 },
  quantityPreview: { ...typography.body, color: colors.textTertiary },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quickChip: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center' },
  quickChipText: { ...typography.bodyStrong, color: colors.textPrimary },
  availableText: { ...typography.caption, color: colors.textSecondary },
  errorText: { ...typography.bodyStrong, color: colors.negative },
  submitButton: { backgroundColor: colors.positive, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  submitButtonSell: { backgroundColor: colors.negative },
  submitButtonText: { ...typography.heading, color: colors.textInverse },
  disclaimer: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
});
