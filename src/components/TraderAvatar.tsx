import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  initials: string;
  color: string;
  size?: number;
  verified?: boolean;
}

export function TraderAvatar({ initials, color, size = 44, verified }: Props) {
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: `${color}33` }]}>
        <Text style={[styles.initials, { color, fontSize: size * 0.36 }]}>{initials}</Text>
      </View>
      {verified && (
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={size * 0.34} color="#00D1FF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontWeight: '700' },
  badge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#05060A', borderRadius: 20 },
});
