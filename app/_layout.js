import { Stack, Tabs } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Home, Film, Tv, MoreHorizontal } from 'lucide-react-native';

const RootLayout = () => {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
};

const LayoutContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="movie/[slug]" options={{ headerShown: true, title: 'Movie Detail', headerStyle: { backgroundColor: '#121212' }, headerTintColor: 'white' }} />
      <Stack.Screen name="show/[slug]" options={{ headerShown: true, title: 'TV Show Detail', headerStyle: { backgroundColor: '#121212' }, headerTintColor: 'white' }} />
      <Stack.Screen name="video/[slug]" options={{ headerShown: false, orientation: 'landscape' }} />
      <Stack.Screen name="reels" options={{ headerShown: true, title: 'Reels', headerStyle: { backgroundColor: 'black' }, headerTintColor: 'white' }} />
      <Stack.Screen name="live" options={{ headerShown: true, title: 'Live TV', headerStyle: { backgroundColor: '#121212' }, headerTintColor: 'white' }} />
      <Stack.Screen name="blog" options={{ headerShown: true, title: 'Blog', headerStyle: { backgroundColor: '#121212' }, headerTintColor: 'white' }} />
      <Stack.Screen name="blog/[slug]" options={{ headerShown: true, title: 'Blog Post', headerStyle: { backgroundColor: '#121212' }, headerTintColor: 'white' }} />
      <Stack.Screen name="search" options={{ headerShown: true, title: 'Search', headerStyle: { backgroundColor: '#121212' }, headerTintColor: 'white' }} />
    </Stack>
  );
};

export default RootLayout;
