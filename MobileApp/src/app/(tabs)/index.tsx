import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
  Dimensions,
  Platform,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getDashboardSummary } from '@/services/dashboardService';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { logout, user, isProfileComplete } = useAuth();
  const scheme = useColorScheme();
  const router = useRouter();
  
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await getDashboardSummary();
      if (res?.success) {
        setDashboardData(res.data);
      } else {
        setError(res?.message || 'Failed to load dashboard summary.');
      }
    } catch (e: any) {
      setError(e.message || 'Unable to connect to server. Please check internet connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchDashboard(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedText }]}>Syncing farm telemetry...</Text>
      </View>
    );
  }

  // Profile Incomplete State Display
  if (!isProfileComplete && !isLoading) {
    return (
      <View style={[styles.setupContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.setupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.setupIconContainer, { backgroundColor: colors.border }]}>
            <Ionicons name="construct-outline" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.setupTitle, { color: colors.text }]}>Farm Profile Setup</Text>
          <Text style={[styles.setupDesc, { color: colors.mutedText }]}>
            Please configure your farm location, soil type, and target crop on the web portal to unlock real-time recommendations and mandi price telemetry.
          </Text>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: colors.border }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={[styles.logoutBtnText, { color: colors.danger }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const { todaysAction, weatherAlert, cropHealth, market, farm } = dashboardData || {};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Dynamic Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>GOOD MORNING</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{user?.name || 'Farmer'} 👋</Text>
        </View>
        <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {error && (
          <View style={[styles.errorCard, { backgroundColor: colors.danger + '15', borderColor: colors.danger }]}>
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.danger }]} onPress={() => fetchDashboard()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Welcome & Farm Summary Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="leaf" size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Active Farm Summary</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.mutedText }]}>CROP</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{farm?.currentCrop || 'Wheat'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.mutedText }]}>STAGE</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{farm?.growthStage || 'Vegetative'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.mutedText }]}>LAND SIZE</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {farm?.landSize?.value || 5} {farm?.landSize?.unit || 'Acres'}
              </Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>
              {farm?.location?.display || 'Indore, Madhya Pradesh'}
            </Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Quick Farm Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/crop-health' as any)}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '10' }]}>
                <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Disease Guard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/weather' as any)}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '10' }]}>
                <Ionicons name="partly-sunny" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Weather Advisory</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/explore' as any)}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '10' }]}>
                <Ionicons name="trending-up" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Mandi Pricing</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/profile' as any)}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '10' }]}>
                <Ionicons name="person" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Recommendation XAI Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>AI Operations Guide</Text>
          </View>
          <View style={[styles.recAdviceBox, { backgroundColor: colors.background }]}>
            <Text style={[styles.recAdviceText, { color: colors.text }]}>
              {todaysAction?.reasoning?.actionableAdvice || 'No irrigation required today. Save pumping costs.'}
            </Text>
          </View>
          <View style={styles.recGrid}>
            <View style={[styles.recGridItem, { backgroundColor: colors.background }]}>
              <Ionicons name="water-outline" size={18} color={colors.primary} />
              <Text style={[styles.recGridLabel, { color: colors.mutedText }]}>Water Saved</Text>
              <Text style={[styles.recGridVal, { color: colors.primary }]}>
                {todaysAction?.reasoning?.waterSavedLiters || '14,250'} L
              </Text>
            </View>
            <View style={[styles.recGridItem, { backgroundColor: colors.background }]}>
              <Ionicons name="cash-outline" size={18} color={colors.primary} />
              <Text style={[styles.recGridLabel, { color: colors.mutedText }]}>Savings</Text>
              <Text style={[styles.recGridVal, { color: colors.primary }]}>
                ₹{todaysAction?.reasoning?.pumpingCostSaving || '850'}
              </Text>
            </View>
            <View style={[styles.recGridItem, { backgroundColor: colors.background }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
              <Text style={[styles.recGridLabel, { color: colors.mutedText }]}>Confidence</Text>
              <Text style={[styles.recGridVal, { color: colors.primary }]}>
                {todaysAction?.reasoning?.confidence || 96}%
              </Text>
            </View>
          </View>
        </View>

        {/* Weather & Mandi price widgets */}
        <View style={styles.widgetRow}>
          {/* Weather Widget */}
          <View style={[styles.halfCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="sunny" size={16} color={colors.warning} />
              <Text style={[styles.halfCardTitle, { color: colors.text }]}>Weather</Text>
            </View>
            <Text style={[styles.widgetVal, { color: colors.text }]}>28°C</Text>
            <Text style={[styles.widgetSub, { color: colors.mutedText }]}>Clear Sky</Text>
          </View>

          {/* Mandi Widget */}
          <View style={[styles.halfCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-up" size={16} color={colors.success} />
              <Text style={[styles.halfCardTitle, { color: colors.text }]}>Wheat Mandi</Text>
            </View>
            <Text style={[styles.widgetVal, { color: colors.text }]}>₹{market?.currentPrice || 2450}</Text>
            <Text style={[styles.widgetSub, { color: colors.success }]}>
              ↑ +{market?.changePercent || 4.2}% Rising
            </Text>
          </View>
        </View>

        {/* Notifications & Warnings */}
        {weatherAlert?.active && (
          <View style={[styles.alertCard, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning-sharp" size={18} color={colors.warning} />
              <Text style={[styles.alertTitle, { color: colors.warning }]}>{weatherAlert.title}</Text>
            </View>
            <Text style={[styles.alertDesc, { color: colors.text }]}>{weatherAlert.message}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  setupCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  setupIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  setupDesc: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  errorCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  divider: {
    height: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  recAdviceBox: {
    padding: 12,
    borderRadius: 16,
  },
  recAdviceText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  recGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  recGridItem: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },
  recGridLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recGridVal: {
    fontSize: 12,
    fontWeight: '900',
  },
  widgetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  halfCardTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  widgetVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  widgetSub: {
    fontSize: 10,
    fontWeight: '700',
  },
  alertCard: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  alertDesc: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
});
