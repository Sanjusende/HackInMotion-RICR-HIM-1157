import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/theme';

export default function ReportsScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [generating, setGenerating] = useState(false);
  const [reportsList, setReportsList] = useState<any[]>([
    { title: 'Wheat Soil Analysis.pdf', date: 'Aug 10, 2026', size: '1.2 MB' },
    { title: 'Kharif Irrigation Summary.pdf', date: 'Aug 04, 2026', size: '850 KB' },
    { title: 'Mandi Price Projections.pdf', date: 'Jul 28, 2026', size: '2.4 MB' }
  ]);

  const triggerGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const newReport = {
        title: `Farm Report_${new Date().toISOString().substring(0, 10)}.pdf`,
        date: 'Today',
        size: '1.4 MB'
      };
      setReportsList([newReport, ...reportsList]);
      alert('PDF Report generated successfully! Available for offline storage.');
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Exported Reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={triggerGenerate}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Compile Monthly Farm Report (PDF)</Text>
            </>
          )}
        </TouchableOpacity>

        {/* History List */}
        <Text style={[styles.listTitle, { color: colors.text }]}>PREVIOUS EXPORTS</Text>
        {reportsList.map((item, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardMain}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '10' }]}>
                <Ionicons name="document-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.metaBox}>
                <Text style={[styles.reportTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.reportDesc, { color: colors.mutedText }]}>{item.date} • {item.size}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.subAction} onPress={() => alert('Simulating PDF Download...')}>
                <Ionicons name="download-outline" size={16} color={colors.primary} />
                <Text style={[styles.subActionText, { color: colors.primary }]}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subAction} onPress={() => alert('Simulating Document Share...')}>
                <Ionicons name="share-social-outline" size={16} color={colors.text} />
                <Text style={[styles.subActionText, { color: colors.text }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  actionBtn: { flexDirection: 'row', height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  listTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 8 },
  card: { borderRadius: 24, borderWidth: 1, padding: 16, gap: 12 },
  cardMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  metaBox: { flex: 1, gap: 2 },
  reportTitle: { fontSize: 13, fontWeight: '800' },
  reportDesc: { fontSize: 10, fontWeight: '600' },
  divider: { height: 1 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  subAction: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  subActionText: { fontSize: 12, fontWeight: '800' },
});
