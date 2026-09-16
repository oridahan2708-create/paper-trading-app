import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import { useAssetDetail } from '@/hooks/useAssetDetail';
import { colors } from '@/theme/colors';
import { spacing, typography } from '@/theme/spacing';
import { BuySellModal } from './BuySellModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  assetId: string;
  side: 'buy' | 'sell';
  trader: { id: string; name: string };
}

export function CopyTradeModal({ visible, onClose, assetId, side, trader }: Props) {
  const { data: asset, isLoading, isError } = useAssetDetail(visible ? assetId : undefined);

  if (!visible) return null;

  if (isLoading || !asset) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.loadingCard}>
            {isError ? (
              <Text style={styles.errorText}>Couldn't load live price for this asset.</Text>
            ) : (
              <>
                <ActivityIndicator color={colors.accent} />
                <Text style={styles.loadingText}>Fetching live price…</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <BuySellModal
      visible={visible}
      onClose={onClose}
      asset={asset}
      initialSide={side}
      source="copy"
      copiedFrom={trader}
    />
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center' },
  loadingCard: { backgroundColor: colors.backgroundElevated, borderRadius: 16, padding: spacing.xl, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.body, color: colors.textSecondary },
  errorText: { ...typography.body, color: colors.textTertiary },
});
