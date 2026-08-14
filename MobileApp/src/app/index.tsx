import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function IndexGate() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6FFF5' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return isAuthenticated ? <Redirect href={"/(tabs)" as any} /> : <Redirect href={"/(auth)/login" as any} />;
}
