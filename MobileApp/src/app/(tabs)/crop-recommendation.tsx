import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { getMyFarm } from '@/services/farmService';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SOILS = ['Black Soil', 'Red Soil', 'Clay Loam', 'Alluvial Soil'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

const RECOMMENDATION_RULES = [
  {
    soil: 'Black Soil',
    season: 'Kharif',
    crops: [
      { name: 'Soybean', score: '95% Match', reasoning: 'Black soil has high clay content and moisture retention, perfect for soybean root nodulation during Kharif rains.' },
      { name: 'Maize', score: '88% Match', reasoning: 'Deep black soil provides excellent nutrient uptake for hybrid maize cob development.' },
      { name: 'Cotton', score: '85% Match', reasoning: 'Black cotton soil of Malwa/Deccan region provides suitable aeration for deep tap roots.' }
    ]
  },
  {
    soil: 'Black Soil',
    season: 'Rabi',
    crops: [
      { name: 'Wheat', score: '98% Match', reasoning: 'Cool Rabi winter temperature combined with black soil moisture storage yields high protein wheat grain.' },
      { name: 'Gram / Chickpea', score: '90% Match', reasoning: 'Low irrigation requirement; thrives on residual moisture in black soil.' }
    ]
  },
  {
    soil: 'Clay Loam',
    season: 'Kharif',
    crops: [
      { name: 'Rice', score: '90% Match', reasoning: 'Suitable for monsoon water availability and clay loam soil.' },
      { name: 'Maize', score: '85% Match', reasoning: 'High yield potential with moderate fertilizer response.' }
    ]
  }
];

const CROP_SUITABILITY_DETAILS: Record<string, any> = {
  'Soybean': {
    npk: 'N: 20, P: 60, K: 40 (Low Nitrogen)',
    yield: '8 - 10 Quintals / Acre',
    profit: '₹22,000 - ₹28,000 / Acre',
    water: 'Medium (Rainfall-dependent)',
    risk: 'Low (Ideal clay moisture response)',
    demand: 'High (Indore oil mills hub)'
  },
  'Maize': {
    npk: 'N: 120, P: 60, K: 40',
    yield: '20 - 24 Quintals / Acre',
    profit: '₹18,000 - ₹24,000 / Acre',
    water: 'Medium',
    risk: 'Medium (Prone to flooding)',
    demand: 'Moderate (Feed industry benchmark)'
  },
  'Cotton': {
    npk: 'N: 80, P: 40, K: 40',
    yield: '10 - 12 Quintals / Acre',
    profit: '₹35,000 - ₹45,000 / Acre',
    water: 'Medium-High',
    risk: 'High (Bollworm vulnerability)',
    demand: 'Very High (Textile hub preference)'
  },
  'Wheat': {
    npk: 'N: 120, P: 60, K: 40',
    yield: '18 - 22 Quintals / Acre',
    profit: '₹28,500 - ₹35,000 / Acre',
    water: 'Medium (4 irrigations)',
    risk: 'Low (Ideal cool Rabi winter)',
    demand: 'High (Indore Sharbati premium)'
  },
  'Gram / Chickpea': {
    npk: 'N: 20, P: 50, K: 20',
    yield: '6 - 8 Quintals / Acre',
    profit: '₹24,000 - ₹30,005 / Acre',
    water: 'Low (Minimal irrigation)',
    risk: 'Low (Drought-tolerant roots)',
    demand: 'High (Pulses industry demand)'
  },
  'Rice': {
    npk: 'N: 120, P: 60, K: 60',
    yield: '22 - 26 Quintals / Acre',
    profit: '₹25,000 - ₹32,000 / Acre',
    water: 'High (Flooded conditions)',
    risk: 'Medium (Requires water supply)',
    demand: 'High (Local food supply chains)'
  }
};

export default function CropRecommendationScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [selectedSoil, setSelectedSoil] = useState('Black Soil');
  const [selectedSeason, setSelectedSeason] = useState('Kharif');
  const [recommendedCrops, setRecommendedCrops] = useState<any[]>([]);

  useEffect(() => {
    const loadFarmDefaults = async () => {
      try {
        const res = await getMyFarm();
        if (res?.success && res.data) {
          if (res.data.soilType) setSelectedSoil(res.data.soilType);
          if (res.data.season) setSelectedSeason(res.data.season);
        }
      } catch (e) {}
    };
    loadFarmDefaults();
  }, []);

  useEffect(() => {
    const match = RECOMMENDATION_RULES.find(
      r => r.soil === selectedSoil && r.season === selectedSeason
    ) || RECOMMENDATION_RULES[0];
    
    setRecommendedCrops(match.crops);
  }, [selectedSoil, selectedSeason]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Crop Recommendation</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.filterLabel, { color: colors.text }]}>SOIL TYPE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {SOILS.map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.pill,
                  {
                    backgroundColor: selectedSoil === s ? colors.primary : colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedSoil(s)}
              >
                <Text style={[styles.pillText, { color: selectedSoil === s ? '#FFFFFF' : colors.text }]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 8 }]} />

          <Text style={[styles.filterLabel, { color: colors.text }]}>SEASON</Text>
          <View style={styles.seasonRow}>
            {SEASONS.map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.pill,
                  {
                    flex: 1,
                    backgroundColor: selectedSeason === s ? colors.primary : colors.background,
                    borderColor: colors.border,
                    alignItems: 'center',
                  },
                ]}
                onPress={() => setSelectedSeason(s)}
              >
                <Text style={[styles.pillText, { color: selectedSeason === s ? '#FFFFFF' : colors.text }]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results List */}
        <Text style={[styles.resultsHeader, { color: colors.text }]}>RECOMMENDED CROPS</Text>
        
        {recommendedCrops.map((crop, idx) => {
          const detail = CROP_SUITABILITY_DETAILS[crop.name] || {
            npk: 'N: 60, P: 40, K: 30',
            yield: '10 - 15 Quintals / Acre',
            profit: '₹15,000 - ₹20,000 / Acre',
            water: 'Medium',
            risk: 'Low',
            demand: 'Moderate'
          };
          return (
            <View key={idx} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="leaf-outline" size={20} color={colors.primary} />
                <View style={styles.titleCol}>
                  <Text style={[styles.cropName, { color: colors.text }]}>{crop.name}</Text>
                  <Text style={[styles.cropScore, { color: colors.primary }]}>{crop.score}</Text>
                </View>
              </View>

              <Text style={[styles.cropReasoning, { color: colors.mutedText }]}>{crop.reasoning}</Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.suitabilityGrid}>
                <View style={styles.gridItem}>
                  <Text style={[styles.gridLabel, { color: colors.mutedText }]}>NPK RATIO</Text>
                  <Text style={[styles.gridValue, { color: colors.text }]}>{detail.npk}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={[styles.gridLabel, { color: colors.mutedText }]}>EST. YIELD</Text>
                  <Text style={[styles.gridValue, { color: colors.text }]}>{detail.yield}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={[styles.gridLabel, { color: colors.mutedText }]}>PROFIT MARGIN</Text>
                  <Text style={[styles.gridValue, { color: colors.text }]}>{detail.profit}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={[styles.gridLabel, { color: colors.mutedText }]}>WATER DEMAND</Text>
                  <Text style={[styles.gridValue, { color: colors.text }]}>{detail.water}</Text>
                </View>
              </View>
            </View>
          );
        })}
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
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  seasonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  resultsHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleCol: {
    flex: 1,
  },
  cropName: {
    fontSize: 15,
    fontWeight: '900',
  },
  cropScore: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  cropReasoning: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  suitabilityGrid: {
    gap: 10,
  },
  gridItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: '800',
  },
});
