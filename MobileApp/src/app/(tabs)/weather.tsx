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
        setForecast([
          { day: 'Today', date: 'Aug 14', condition: 'Sunny', tempMax: 32, tempMin: 22, humidity: 62, wind: 11, rainProb: 10 },
          { day: 'Tomorrow', date: 'Aug 15', condition: 'Partly Cloudy', tempMax: 30, tempMin: 21, humidity: 65, wind: 14, rainProb: 20 },
          { day: 'Sunday', date: 'Aug 16', condition: 'Light Rain', tempMax: 28, tempMin: 20, humidity: 78, wind: 18, rainProb: 80 },
          { day: 'Monday', date: 'Aug 17', condition: 'Thunderstorm', tempMax: 27, tempMin: 19, humidity: 85, wind: 22, rainProb: 95 },
          { day: 'Tuesday', date: 'Aug 18', condition: 'Showers', tempMax: 28, tempMin: 20, humidity: 80, wind: 16, rainProb: 75 },
          { day: 'Wednesday', date: 'Aug 19', condition: 'Cloudy', tempMax: 29, tempMin: 21, humidity: 70, wind: 12, rainProb: 30 },
          { day: 'Thursday', date: 'Aug 20', condition: 'Sunny', tempMax: 31, tempMin: 22, humidity: 60, wind: 10, rainProb: 15 }
        ]);
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

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
            {/* Hero Weather Card */}
            <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
              <View style={styles.heroMain}>
                <Ionicons name="sunny" size={54} color="#FFD54F" />
                <View>
                  <Text style={styles.heroTemp}>32°C</Text>
                  <Text style={styles.heroCondition}>Sunny & Clear skies</Text>
                </View>
              </View>
              <View style={styles.heroMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="water-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metaText}>62% Humid</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="flag-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metaText}>11 km/h Wind</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="rainy-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metaText}>10% Rain</Text>
                </View>
              </View>
            </View>

            {/* Smart Work Window Advice */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="sparkles" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>AI Weather Advisory</Text>
              </View>
              <Text style={[styles.adviceText, { color: colors.text }]}>
                Standard evapotranspiration forecast. Soil moisture absorption indexes remain highly receptive.
              </Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.adviceRow}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text style={[styles.adviceSub, { color: colors.text }]}>
                  <Text style={{ fontWeight: 'bold' }}>Optimal Spray Window: </Text>6:00 AM - 10:00 AM (safe wind velocities).
                </Text>
              </View>
              <View style={styles.adviceRow}>
                <Ionicons name="warning-outline" size={16} color={colors.warning} />
                <Text style={[styles.adviceSub, { color: colors.text }]}>
                  <Text style={{ fontWeight: 'bold' }}>Pest Vulnerability: </Text>High relative humidity on Sunday indicates fungal risks.
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
                        name={day.condition?.toLowerCase().includes('rain') || day.condition?.toLowerCase().includes('storm') ? 'rainy-outline' : 'sunny-outline'}
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
  heroCard: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroTemp: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroCondition: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8F5E9',
  },
  heroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
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
