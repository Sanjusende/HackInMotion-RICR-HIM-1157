import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const FEATURE_CARDS = [
  { id: 'weather', name: 'Weather', icon: 'partly-sunny', color: '#0288D1', path: '/(tabs)/weather' },
  { id: 'irrigation', name: 'Irrigation', icon: 'water', color: '#4CAF50', path: '/(tabs)/irrigation' },
  { id: 'crop-rec', name: 'Crop Recommendation', icon: 'leaf', color: '#2E7D32', path: '/(tabs)/crop-recommendation' },
  { id: 'crop-health', name: 'Crop Health', icon: 'heart', color: '#D32F2F', path: '/(tabs)/crop-health' },
  { id: 'disease', name: 'Disease Detection', icon: 'bug', color: '#E65100', path: '/(tabs)/disease-detection' },
  { id: 'fertilizer', name: 'Fertilizer', icon: 'flask', color: '#81C784', path: '/(tabs)/fertilizer' },
  { id: 'market', name: 'Market Prices', icon: 'trending-up', color: '#F9A825', path: '/(tabs)/explore' },
  { id: 'analytics', name: 'Analytics', icon: 'bar-chart', color: '#00796B', path: '/(tabs)/analytics' },
  { id: 'voice', name: 'Voice Assistant', icon: 'mic', color: '#3F51B5', path: '/(tabs)/voice-assistant' },
  { id: 'profile', name: 'Profile', icon: 'person', color: '#0097A7', path: '/(tabs)/profile' },
  { id: 'settings', name: 'Settings', icon: 'settings', color: '#5F6F65', path: '/(tabs)/settings' },
  { id: 'reports', name: 'Reports', icon: 'document-text', color: '#7B1FA2', path: '/(tabs)/reports' },
];

export default function DashboardScreenStep1() {
  const { logout, user } = useAuth();
  const scheme = useColorScheme();
  const router = useRouter();
  
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.border }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {user?.name?.substring(0, 1).toUpperCase() || 'F'}
            </Text>
          </View>
          <View>
            <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>{todayStr.toUpperCase()}</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Welcome, {user?.name || 'Farmer'} 👋</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.background }]} onPress={() => alert('No new notifications.')}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.background }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.primary }]}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>🌱 KrishiMitra Portal</Text>
            <Text style={styles.welcomeDesc}>
              Smart Farm Decision Support System. Your digital partner for tilling, scheduling, and disease guard.
            </Text>
          </View>
        </View>

        {/* Feature Grid Header */}
        <Text style={[styles.gridTitle, { color: colors.text }]}>QUICK FARM SERVICES</Text>

        {/* 12 Quick Feature Grid */}
        <View style={styles.gridContainer}>
          {FEATURE_CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.gridCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(card.path as any)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: card.color + '15' }]}>
                <Ionicons name={card.icon as any} size={22} color={card.color} />
              </View>
              <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={2}>
                {card.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  welcomeCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  welcomeTextContainer: {
    gap: 8,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  welcomeDesc: {
    color: '#E8F5E9',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  gridTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: (width - 44) / 3,
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 14,
  },
});
