import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Platform,
} from 'react-native';
import { analyzeCropHealth, getCropHealthHistory } from '@/services/cropHealthService';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DISEASE_CLINICAL_DETAILS: Record<string, any> = {
  'Yellow Rust': {
    severity: 'Medium (35% infestation area detected)',
    remedy: 'Apply Propiconazole 25% EC foliar spray at 2ml/L water immediately. Avoid morning overhead irrigation to prevent spreading spores.',
    recovery: '7 - 10 Days after application',
    prevention: 'Cultivate rust-resistant seed varieties next season. Avoid nitrogen over-fertilization.'
  },
  'Late Blight': {
    severity: 'High (Immediate isolation required)',
    remedy: 'Spray Mancozeb (0.2%) or Metalaxyl-Mancozeb combination. Ensure proper drainage in affected rows.',
    recovery: '10 - 14 Days after treatment',
    prevention: 'Use certified disease-free seed tubers. Space plants adequately for light penetration.'
  },
  'Leaf Spot / Blight': {
    severity: 'Mild (Early Stage)',
    remedy: 'Apply Carbendazim at 1g/L water. Remove heavily spotted leaves from the field and destroy them.',
    recovery: '5 - 7 Days',
    prevention: 'Perform seed treatment with Thiram before sowing. Maintain clean weeding around borders.'
  },
  'Healthy / No disease detected': {
    severity: 'None (Optimal Health)',
    remedy: 'Maintain current organic mulching and standard balanced irrigation.',
    recovery: 'Immediate',
    prevention: 'Continue weekly scouting. Spray diluted neem oil (1%) once every fortnight as preventive shield.'
  }
};

export default function CropHealthScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHist, setIsLoadingHist] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await getCropHealthHistory();
      if (res?.success) {
        setHistory(res.data || []);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoadingHist(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDiagnose = async () => {
    if (!description && !selectedSample) {
      alert('Please enter symptom details or select a sample leaf.');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const payloadDescription = description || `Sample Leaf diagnostic: ${selectedSample}`;
      const res = await analyzeCropHealth(payloadDescription);
      if (res?.success) {
        setResult(res.data);
        fetchHistory();
      }
    } catch (e: any) {
      alert(e.message || 'Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const selectSampleSymptom = (type: string) => {
    setSelectedSample(type);
    if (type === 'Rust') {
      setDescription('Yellow powdery patches appearing on leaves of wheat crop');
    } else if (type === 'Blight') {
      setDescription('Water-soaked dark lesions spreading rapidly on margins of potato leaves');
    } else {
      setDescription('Leaves look dark green, uniform, and healthy');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Crop Disease Guard</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Diagnostic Form */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Describe Symptoms</Text>
          <TextInput
            style={[styles.textarea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
            multiline
            numberOfLines={4}
            placeholder="Describe leaf yellowing, spotting, or insect bites..."
            placeholderTextColor={colors.mutedText}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={[styles.label, { color: colors.mutedText, marginTop: 8 }]}>OR CHOOSE A DEMO LEAF SAMPLE</Text>
          <View style={styles.sampleRow}>
            {['Rust', 'Blight', 'Healthy'].map(sample => (
              <TouchableOpacity
                key={sample}
                style={[
                  styles.sampleBtn,
                  {
                    backgroundColor: selectedSample === sample ? colors.primary : colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => selectSampleSymptom(sample)}
              >
                <Text
                  style={[
                    styles.sampleText,
                    { color: selectedSample === sample ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {sample}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleDiagnose}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Submit for AI Diagnosis</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Diagnosis Report Card */}
        {result && (() => {
          const details = DISEASE_CLINICAL_DETAILS[result.possibleIssue] || {
            severity: 'Early Warning Stage',
            remedy: 'Spray general broad-spectrum organic fungicide or neem extract (5%). Limit sprinkler irrigation.',
            recovery: '7 - 10 Days',
            prevention: 'Maintain proper plant spacing and crop scouting schedule.'
          };
          return (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>AI Diagnostic Report</Text>
              </View>

              <View style={styles.reportSection}>
                <Text style={[styles.reportLabel, { color: colors.mutedText }]}>POSSIBLE ISSUE</Text>
                <Text style={[styles.reportValue, { color: colors.text }]}>{result.possibleIssue}</Text>
                <Text style={[styles.reportConf, { color: colors.primary }]}>Confidence: {result.confidence}</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.reportRow}>
                <View style={styles.reportCol}>
                  <Text style={[styles.reportLabel, { color: colors.mutedText }]}>SEVERITY INDEX</Text>
                  <Text style={[styles.reportTextVal, { color: colors.text }]}>{details.severity}</Text>
                </View>
                <View style={styles.reportCol}>
                  <Text style={[styles.reportLabel, { color: colors.mutedText }]}>RECOVERY ESTIMATE</Text>
                  <Text style={[styles.reportTextVal, { color: colors.text }]}>{details.recovery}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.reportSection}>
                <Text style={[styles.reportLabel, { color: colors.mutedText }]}>IMMEDIATE REMEDIES</Text>
                <View style={[styles.remedyBox, { backgroundColor: colors.background }]}>
                  <Text style={[styles.remedyText, { color: colors.text }]}>{details.remedy}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.reportSection}>
                <Text style={[styles.reportLabel, { color: colors.mutedText }]}>FUTURE PREVENTION</Text>
                <Text style={[styles.reportTextVal, { color: colors.text }]}>{details.prevention}</Text>
              </View>
            </View>
          );
        })()}
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    fontWeight: '600',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sampleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sampleBtn: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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
  reportSection: {
    gap: 4,
  },
  reportLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reportValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  reportConf: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  reportCol: {
    flex: 1,
    gap: 4,
  },
  reportTextVal: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  remedyBox: {
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  remedyText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
});
