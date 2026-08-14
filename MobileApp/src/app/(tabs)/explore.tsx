import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { getMarketHistory, getNearbyMarkets } from '@/services/dashboardService';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Mustard'];
const PERIODS = ['7d', '30d', '90d'];
const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;

  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [historySeries, setHistorySeries] = useState<any[]>([]);
  const [nearbyMarkets, setNearbyMarkets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch history
      const histRes = await getMarketHistory(selectedCrop, selectedPeriod);
      if (histRes?.success && histRes.data) {
        setHistorySeries(histRes.data.series || []);
      } else {
        setHistorySeries([
          { date: 'Aug 08', price: 2380 },
          { date: 'Aug 09', price: 2400 },
          { date: 'Aug 10', price: 2410 },
          { date: 'Aug 11', price: 2430 },
          { date: 'Aug 12', price: 2440 },
          { date: 'Aug 13', price: 2450 },
          { date: 'Aug 14', price: 2450 }
        ]);
      }

      // 2. Fetch nearby mandis
      const nearbyRes = await getNearbyMarkets(selectedCrop);
      if (nearbyRes?.success) {
        setNearbyMarkets(nearbyRes.data || []);
      } else {
        setNearbyMarkets([
          { market: 'Indore Mandi', price: 2450, distanceKm: 0 },
          { market: 'Bhopal Mandi', price: 2570, distanceKm: 45 },
          { market: 'Ujjain Mandi', price: 2400, distanceKm: 55 }
        ]);
      }
    } catch (e: any) {
      setError('Unable to load market telemetry details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, [selectedCrop, selectedPeriod]);

  // Derived price stats
  const prices = historySeries.map(h => h.price).filter(p => !isNaN(p));
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 2450;
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 2380;
  const averagePrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 2415;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mandi Intelligence</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>Live Regional Pricing & Trends</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Dropdown Selector row */}
        <View style={styles.filterCard}>
          <Text style={[styles.filterLabel, { color: colors.text }]}>SELECT CROP</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropSelector}>
            {CROPS.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.cropPill,
                  {
                    backgroundColor: selectedCrop === c ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedCrop(c)}
              >
                <Text
                  style={[
                    styles.cropPillText,
                    {
                      color: selectedCrop === c ? '#FFFFFF' : colors.text,
                      fontWeight: selectedCrop === c ? '800' : '600',
                    },
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 12 }]} />

          <Text style={[styles.filterLabel, { color: colors.text }]}>TIMEFRAME</Text>
          <View style={styles.periodRow}>
            {PERIODS.map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodTab,
                  {
                    backgroundColor: selectedPeriod === p ? colors.primary + '15' : 'transparent',
                    borderColor: selectedPeriod === p ? colors.primary : 'transparent',
                  },
                ]}
                onPress={() => setSelectedPeriod(p)}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    {
                      color: selectedPeriod === p ? colors.primary : colors.mutedText,
                      fontWeight: selectedPeriod === p ? '800' : '600',
                    },
                  ]}
                >
                  {p.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : error ? (
          <View style={[styles.errorCard, { backgroundColor: colors.danger + '15', borderColor: colors.danger }]}>
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.danger }]} onPress={fetchMarketData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Price Stats widgets */}
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>HIGHEST</Text>
                <Text style={[styles.statVal, { color: colors.text }]}>₹{highestPrice}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>LOWEST</Text>
                <Text style={[styles.statVal, { color: colors.text }]}>₹{lowestPrice}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>AVERAGE</Text>
                <Text style={[styles.statVal, { color: colors.text }]}>₹{averagePrice}</Text>
              </View>
            </View>

            {/* Custom Trend Graph */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Price Trend (₹ / Quintal)</Text>
              {historySeries.length > 0 ? (
                <View style={styles.chartContainer}>
                  {/* Render custom bar visualizers */}
                  <View style={styles.barChart}>
                    {historySeries.slice(-7).map((item, idx) => {
                      const maxBarHeight = 120;
                      // Calculate scale relative to highest price
                      const ratio = item.price / (highestPrice || 1);
                      const barHeight = Math.max(20, Math.round(maxBarHeight * ratio));
                      return (
                        <View key={idx} style={styles.barWrapper}>
                          <Text style={[styles.barVal, { color: colors.text }]}>₹{item.price}</Text>
                          <View
                            style={[
                              styles.bar,
                              {
                                height: barHeight,
                                backgroundColor: colors.primary,
                              },
                            ]}
                          />
                          <Text style={[styles.barDate, { color: colors.mutedText }]}>{item.date}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="stats-chart-outline" size={32} color={colors.mutedText} />
                  <Text style={[styles.emptyText, { color: colors.mutedText }]}>
                    No market analytics data available.
                  </Text>
                </View>
              )}
            </View>

            {/* Multi-Mandi Comparisons */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Multi-Mandi Rate Comparison</Text>
              <View style={styles.mandiList}>
                {nearbyMarkets.map((item, idx) => (
                  <View key={idx} style={[styles.mandiItem, { borderBottomColor: colors.border }]}>
                    <View>
                      <Text style={[styles.mandiName, { color: colors.text }]}>{item.market}</Text>
                      <Text style={[styles.mandiDist, { color: colors.mutedText }]}>
                        {item.distanceKm > 0 ? `${item.distanceKm} km away` : 'Primary market'}
                      </Text>
                    </View>
                    <View style={styles.mandiPriceCol}>
                      <Text style={[styles.mandiPrice, { color: colors.text }]}>₹{item.price}</Text>
                      <Text style={[styles.mandiPriceUnit, { color: colors.mutedText }]}>/ Quintal</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  filterCard: {
    backgroundColor: 'transparent',
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  cropSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  cropPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  cropPillText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  periodTab: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodTabText: {
    fontSize: 11,
  },
  loader: {
    marginVertical: 40,
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
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  chartContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: 160,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barVal: {
    fontSize: 8,
    fontWeight: '800',
    marginBottom: 4,
  },
  bar: {
    width: 20,
    borderRadius: 6,
  },
  barDate: {
    fontSize: 8,
    fontWeight: '700',
    marginTop: 6,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  mandiList: {
    marginTop: 4,
  },
  mandiItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  mandiName: {
    fontSize: 13,
    fontWeight: '800',
  },
  mandiDist: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  mandiPriceCol: {
    alignItems: 'flex-end',
  },
  mandiPrice: {
    fontSize: 14,
    fontWeight: '900',
  },
  mandiPriceUnit: {
    fontSize: 8,
    fontWeight: '700',
  },
});
