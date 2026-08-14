import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/theme';

export default function DiseaseDetectionScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<any>(null);

  const triggerScan = () => {
    setScanning(true);
    setReport(null);
    setTimeout(() => {
      setScanning(false);
      setReport({
        disease: 'Late Blight (Phytophthora infestans)',
        confidence: '94%',
        remedy: 'Apply Metalaxyl-M or Mancozeb fungicide. Space rows to reduce local moisture trap pockets.',
        timeline: '10 - 14 days recovery window'
      });
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Disease Detector</Text>
      </View>

      <View style={styles.content}>
        {/* Simulated Camera Viewfinder */}
        <View style={[styles.viewfinder, { borderColor: colors.primary, backgroundColor: colors.surface }]}>
          {scanning ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : report ? (
            <View style={styles.reportOverlay}>
              <Ionicons name="checkmark-circle" size={32} color={colors.primary} />
              <Text style={[styles.reportTitle, { color: colors.text }]}>{report.disease}</Text>
              <Text style={[styles.reportText, { color: colors.mutedText }]}>Confidence: {report.confidence}</Text>
              <Text style={[styles.reportText, { color: colors.text, marginTop: 4 }]}>💡 {report.remedy}</Text>
              <Text style={[styles.reportText, { color: colors.primary, fontWeight: '800', marginTop: 4 }]}>Timeline: {report.timeline}</Text>
            </View>
          ) : (
            <View style={styles.viewfinderCenter}>
              <Ionicons name="camera-outline" size={44} color={colors.mutedText} />
              <Text style={[styles.viewfinderText, { color: colors.mutedText }]}>Focus camera on crop leaf</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.scanBtn, { backgroundColor: colors.primary }]}
          onPress={triggerScan}
          disabled={scanning}
        >
          <Text style={styles.scanBtnText}>{scanning ? 'Scanning...' : 'Capture & Analyze Leaf'}</Text>
        </TouchableOpacity>
      </View>
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
  content: { flex: 1, padding: 20, gap: 20, justifyContent: 'center' },
  viewfinder: {
    height: 320,
    borderRadius: 24,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  viewfinderCenter: {
    alignItems: 'center',
    gap: 10,
  },
  viewfinderText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reportOverlay: {
    alignItems: 'center',
    gap: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  reportText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  scanBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
