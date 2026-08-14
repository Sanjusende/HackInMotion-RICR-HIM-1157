import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, useColorScheme, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/theme';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Farm Analytics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Farm Score */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.mutedText }]}>OVERALL HEALTH SCORE</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreVal, { color: colors.primary }]}>92%</Text>
            <View style={styles.scoreMeta}>
              <Text style={[styles.scoreTitle, { color: colors.text }]}>Excellent Condition</Text>
              <Text style={[styles.scoreDesc, { color: colors.mutedText }]}>Top 5% of regional wheat fields this Kharif season</Text>
            </View>
          </View>
        </View>

        {/* Telemetry Charts simulation */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Water Consumption (Liters / Week)</Text>
          <View style={styles.chartWrapper}>
            {[12000, 15000, 8000, 14250, 11000].map((val, idx) => {
              const maxVal = 15000;
              const barHeight = Math.round((val / maxVal) * 100);
              return (
                <View key={idx} style={styles.chartCol}>
                  <Text style={[styles.chartValText, { color: colors.text }]}>{(val/1000).toFixed(1)}k</Text>
                  <View style={[styles.chartBar, { height: barHeight, backgroundColor: colors.primary }]} />
                  <Text style={[styles.chartDate, { color: colors.mutedText }]}>Wk {idx+1}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Projected Income Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Estimated Rabi Yield Income</Text>
          <View style={styles.incomeBox}>
            <View>
              <Text style={[styles.incomeVal, { color: colors.text }]}>₹1,42,500</Text>
              <Text style={[styles.incomeLabel, { color: colors.mutedText }]}>PROJECTIONS BASED ON MANDI RATES</Text>
            </View>
            <Ionicons name="trending-up-outline" size={28} color={colors.primary} />
          </View>
        </View>

        {/* Yield distribution */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Acreage Distribution</Text>
          <View style={styles.distributionList}>
            {[
              { crop: 'Wheat', pct: '60%', size: '12 Acres', color: '#16A34A' },
              { crop: 'Soybean', pct: '30%', size: '6 Acres', color: '#22C55E' },
              { crop: 'Maize', pct: '10%', size: '2 Acres', color: '#84CC16' }
            ].map((item, idx) => (
              <View key={idx} style={styles.distRow}>
                <View style={styles.distRowLeft}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={[styles.distCrop, { color: colors.text }]}>{item.crop}</Text>
                </View>
                <Text style={[styles.distPct, { color: colors.text }]}>{item.pct} ({item.size})</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  scrollContainer: { padding: 16, gap: 16 },
  card: { borderRadius: 24, borderWidth: 1, padding: 16, gap: 12 },
  cardLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  cardTitle: { fontSize: 13, fontWeight: '900' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  scoreVal: { fontSize: 32, fontWeight: '900' },
  scoreMeta: { flex: 1, gap: 2 },
  scoreTitle: { fontSize: 13, fontWeight: '800' },
  scoreDesc: { fontSize: 10, fontWeight: '600', lineHeight: 14 },
  chartWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, paddingTop: 10 },
  chartCol: { alignItems: 'center', gap: 6, flex: 1 },
  chartValText: { fontSize: 8, fontWeight: '800' },
  chartBar: { width: 14, borderRadius: 4 },
  chartDate: { fontSize: 8, fontWeight: '700' },
  incomeBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.01)' },
  incomeVal: { fontSize: 20, fontWeight: '900' },
  incomeLabel: { fontSize: 7, fontWeight: '800', letterSpacing: 0.5, marginTop: 4 },
  distributionList: { gap: 10 },
  distRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  distCrop: { fontSize: 12, fontWeight: '700' },
  distPct: { fontSize: 12, fontWeight: '800' },
});
