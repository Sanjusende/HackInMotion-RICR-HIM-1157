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
import { useAuth } from '@/context/AuthContext';
import { getMyFarm, saveFarmProfile, updateFarmProfile } from '@/services/farmService';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();
  const { logout, user, setProfileComplete } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [farm, setFarm] = useState<any>(null);
  const [sizeAcres, setSizeAcres] = useState('');
  const [soilType, setSoilType] = useState('Black Soil');
  const [locationName, setLocationName] = useState('');
  const [currentCrop, setCurrentCrop] = useState('Wheat');
  const [growthStage, setGrowthStage] = useState('Vegetative');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await getMyFarm();
        if (res?.success && res.data) {
          setFarm(res.data);
          setSizeAcres(res.data.sizeAcres?.toString() || '');
          setSoilType(res.data.soilType || 'Black Soil');
          setLocationName(res.data.location?.name || '');
          setCurrentCrop(res.data.currentCrop || 'Wheat');
          setGrowthStage(res.data.growthStage || 'Vegetative');
          setProfileComplete(true);
        } else {
          setProfileComplete(false);
        }
      } catch (e) {
        setProfileComplete(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!sizeAcres || !locationName) {
      alert('Please fill out all farm configuration fields.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        sizeAcres: parseFloat(sizeAcres),
        soilType,
        location: {
          name: locationName,
          coordinates: [75.8577, 22.7196] // Default Indore coordinates
        },
        currentCrop,
        growthStage,
      };

      let res;
      if (farm?._id) {
        res = await updateFarmProfile(farm._id, payload);
      } else {
        res = await saveFarmProfile(payload);
      }

      if (res?.success) {
        setFarm(res.data);
        setProfileComplete(true);
        alert('Farm configuration profile updated successfully!');
      }
    } catch (e: any) {
      alert(e.message || 'Failed to update configurations.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn(e);
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Farmer Profile</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <>
            {/* User Meta Card */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.avatarRow}>
                <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>
                    {user?.name?.substring(0, 1).toUpperCase() || 'F'}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Farmer'}</Text>
                  <Text style={[styles.userEmail, { color: colors.mutedText }]}>{user?.email}</Text>
                </View>
              </View>
            </View>

            {/* Farm Config Details */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Farm Settings</Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedText }]}>FARM ACRES SIZE</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  keyboardType="numeric"
                  placeholder="e.g. 10.5"
                  placeholderTextColor={colors.mutedText}
                  value={sizeAcres}
                  onChangeText={setSizeAcres}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedText }]}>GEOLOCATION PLACE</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="e.g. Indore district"
                  placeholderTextColor={colors.mutedText}
                  value={locationName}
                  onChangeText={setLocationName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedText }]}>SOIL TYPE</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="e.g. Black Soil"
                  placeholderTextColor={colors.mutedText}
                  value={soilType}
                  onChangeText={setSoilType}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedText }]}>CURRENT ACTIVE CROP</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="e.g. Wheat"
                  placeholderTextColor={colors.mutedText}
                  value={currentCrop}
                  onChangeText={setCurrentCrop}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedText }]}>GROWTH DEVELOPMENT STAGE</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="e.g. Vegetative"
                  placeholderTextColor={colors.mutedText}
                  value={growthStage}
                  onChangeText={setGrowthStage}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Save Specifications</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.danger }]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={colors.danger} />
              <Text style={[styles.logoutText, { color: colors.danger }]}>Log Out Session</Text>
            </TouchableOpacity>
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
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
  },
  userName: {
    fontSize: 15,
    fontWeight: '900',
  },
  userEmail: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  input: {
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
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
    fontSize: 12,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
