import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, useColorScheme, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/theme';

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(scheme === 'dark');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'English' ? 'Hindi (हिन्दी)' : 'English');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Preference Settings */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Preferences</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={20} color={colors.text} />
              <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} thumbColor={colors.primary} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              <Text style={[styles.rowText, { color: colors.text }]}>Push Alerts</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} thumbColor={colors.primary} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
            <View style={styles.rowLeft}>
              <Ionicons name="language-outline" size={20} color={colors.text} />
              <Text style={[styles.rowText, { color: colors.text }]}>App Language</Text>
            </View>
            <Text style={[styles.rowVal, { color: colors.primary }]}>{language}</Text>
          </TouchableOpacity>
        </View>

        {/* Security & Support */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Support Channels</Text>

          <TouchableOpacity style={styles.row} onPress={() => alert('Simulating privacy policy sheet...')}>
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text} />
              <Text style={[styles.rowText, { color: colors.text }]}>Privacy & Terms</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.row} onPress={() => alert('Support helpline numbers: +91 1800 123 4567')}>
            <View style={styles.rowLeft}>
              <Ionicons name="help-buoy-outline" size={20} color={colors.text} />
              <Text style={[styles.rowText, { color: colors.text }]}>Help & Helpline</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.row} onPress={() => alert('KrishiMitra Android/iOS App build v1.2.0-release')}>
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle-outline" size={20} color={colors.text} />
              <Text style={[styles.rowText, { color: colors.text }]}>About App</Text>
            </View>
            <Text style={[styles.rowVal, { color: colors.mutedText }]}>v1.2.0</Text>
          </TouchableOpacity>
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
  cardTitle: { fontSize: 13, fontWeight: '900', marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 40 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowText: { fontSize: 13, fontWeight: '700' },
  rowVal: { fontSize: 12, fontWeight: '800' },
  divider: { height: 1 },
});
