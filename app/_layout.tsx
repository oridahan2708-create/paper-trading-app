import 'react-native-gesture-handler';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { queryClient } from '@/lib/queryClient';
import { usePortfolioStore } from '@/store/portfolioStore';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.backgroundElevated,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accent,
  },
};

export default function RootLayout() {
  const hasHydrated = usePortfolioStore((s) => s.hasHydrated);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={navTheme}>
            <StatusBar style="light" />
            {!hasHydrated ? (
              <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={colors.accent} size="large" />
              </View>
            ) : (
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.backgroundElevated },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: { color: colors.textPrimary },
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="asset/[id]" options={{ title: '' }} />
              <Stack.Screen name="trader/[id]" options={{ title: 'Trader' }} />
              </Stack>
            )}
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
