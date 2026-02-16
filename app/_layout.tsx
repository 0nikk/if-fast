import { Stack } from 'expo-router';
import { FastingProvider } from '../context/FastingContext';

export default function RootLayout() {
  return (
    <FastingProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </FastingProvider>
  );
}
