import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { getWeatherForecast } from '@/services/dashboardService';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WeatherScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [forecast, setForecast] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getWeatherForecast();
      if (res?.success && Array.isArray(res.data)) {
        setForecast(res.data);
      } else {
        setForecast([]);
      }
    } catch (e: any) {
      setError('Unable to fetch forecast data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Weather Advisory</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : error ? (
          <View style={[styles.errorCard, { backgroundColor: colors.danger + '15', borderColor: colors.danger }]}>
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.danger }]} onPress={fetchForecast}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Smart Work Window Advice */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="sparkles" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>AI Weather Guide</Text>
              </View>
              <Text style={[styles.adviceText, { color: colors.text }]}>
                Clear atmosphere and sunny skies expected today. Root evaporation rate will be elevated.
              </Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.adviceRow}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text style={[styles.adviceSub, { color: colors.text }]}>
                  <strong>Best Work Window:</strong> 6:00 AM - 10:00 AM (optimal temperature and low wind).
                </Text>
              </View>
              <View style={styles.adviceRow}>
                <Ionicons name="water-outline" size={16} color={colors.primary} />
                <Text style={[styles.adviceSub, { color: colors.text }]}>
                  <strong>Evaporation impact:</strong> Standard soil moisture buffer recommended.
                </Text>
              </View>
            </View>

            {/* 7-Day Forecast */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 8 }]}>7-Day Forecast</Text>
              <View style={styles.forecastList}>
                {forecast.map((day, idx) => (
                  <View key={idx} style={[styles.forecastItem, { borderBottomColor: colors.border }]}>
                    <View style={styles.dayCol}>
                      <Text style={[styles.dayName, { color: colors.text }]}>{day.day}</Text>
                      <Text style={[styles.dayDate, { color: colors.mutedText }]}>{day.date}</Text>
                    </View>
                    <View style={styles.conditionCol}>
                      <Ionicons
                        name={day.condition?.toLowerCase().includes('rain') ? 'rainy-outline' : 'sunny-outline'}
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={[styles.conditionText, { color: colors.text }]}>{day.condition}</Text>
                    </View>
                    <View style={styles.tempCol}>
                      <Text style={[styles.tempText, { color: colors.text }]}>
                        {day.tempMax}° / {day.tempMin}°
                      </Text>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
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
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  adviceText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  divider: {
    height: 1,
  },
  adviceRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  adviceSub: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  forecastList: {
    marginTop: 4,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dayCol: {
    width: 80,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '800',
  },
  dayDate: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  conditionCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tempCol: {
    alignItems: 'flex-end',
    width: 85,
  },
  tempText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
