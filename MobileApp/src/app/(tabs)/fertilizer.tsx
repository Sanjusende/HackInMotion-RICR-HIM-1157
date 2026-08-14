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

const FERTILIZER_PLANS: Record<string, any[]> = {
  Wheat: [
    { stage: 'Initial / Germination', nutrient: 'NPK (12:32:16) & Zinc Sulphate', timing: 'At sowing / basal application', method: 'Soil broadcast / drill placement', guidance: 'Basal dose provides phosphorus for root development.' },
    { stage: 'Vegetative', nutrient: 'Urea (Nitrogen top-dressing)', timing: '20-25 days after sowing (first irrigation)', method: 'Top-dressing in moist soil', guidance: 'Promotes tillering and leaf growth.' },
    { stage: 'Flowering', nutrient: 'Urea & Micronutrient Spray', timing: 'At earhead emergence stage', method: 'Foliar spray / soil top-dressing', guidance: 'Supports grain head formation and prevents earhead tip drying.' }
  ],
  Default: [
    { stage: 'Initial / Germination', nutrient: 'Basal NPK & Organic Compost', timing: 'At planting / land preparation', method: 'Soil incorporation', guidance: 'Establishes initial root strength.' },
    { stage: 'Vegetative', nutrient: 'Nitrogen Rich Fertilizer (Urea / DAP)', timing: 'Active vegetative growth phase', method: 'Moist soil top-dressing', guidance: 'Enhances canopy expansion.' },
    { stage: 'Flowering', nutrient: 'Potassium / Micronutrient Blend', timing: 'Pre-flowering / fruit initiation', method: 'Soil application or foliar spray', guidance: 'Improves grain/fruit quality.' }
  ]
};

export default function FertilizerScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [farm, setFarm] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchFarmAndPlans = async () => {
      try {
        const res = await getMyFarm();
        if (res?.success && res.data) {
          setFarm(res.data);
          const crop = res.data.currentCrop || 'Wheat';
          setPlans(FERTILIZER_PLANS[crop] || FERTILIZER_PLANS.Default);
        } else {
          setPlans(FERTILIZER_PLANS.Default);
        }
      } catch (e) {
        setPlans(FERTILIZER_PLANS.Default);
      }
    };
    fetchFarmAndPlans();
  }, []);

  const currentCrop = farm?.currentCrop || 'Wheat';
  const currentStage = farm?.growthStage || 'Vegetative';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Resource Planner</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Agronomic Warning Disclaimer */}
        <View style={[styles.warningCard, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}>
          <Ionicons name="alert-circle" size={20} color={colors.warning} />
          <Text style={[styles.warningText, { color: colors.warning }]}>
            <Text style={{ fontWeight: 'bold' }}>Quality Advisory: </Text>Guidance lists optimal timing and method. Exact dosages require Soil Health Card lab results.
          </Text>
        </View>

        {/* Selected Crop Meta */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.metaLabel, { color: colors.mutedText }]}>CURRENT ACTIVE SCHEDULE</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>{currentCrop} ({currentStage})</Text>
        </View>

        {/* Schedule List */}
        {plans.map((plan, idx) => {
          const isCurrent = plan.stage.toLowerCase() === currentStage.toLowerCase();
          return (
            <View
              key={idx}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isCurrent ? colors.primary : colors.border,
                  borderWidth: isCurrent ? 2 : 1,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.stageBadge, { color: colors.primary }]}>
                  STAGE: {plan.stage.toUpperCase()}
                </Text>
                {isCurrent && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]}>
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.nutrientTitle, { color: colors.text }]}>{plan.nutrient}</Text>

              <View style={[styles.detailBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>TIMING WINDOW</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{plan.timing}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>APPLICATION METHOD</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{plan.method}</Text>
                </View>
              </View>

              <Text style={[styles.guidanceText, { color: colors.mutedText }]}>
                💡 {plan.guidance}
              </Text>
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
  warningCard: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  warningText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  nutrientTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  detailBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  guidanceText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
