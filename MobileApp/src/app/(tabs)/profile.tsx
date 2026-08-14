import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getProfile } from '@/services/authService';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { logout, user, token } = useAuth();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmProfile = async () => {
      if (token) {
        try {
          const res = await getProfile(token);
          if (res?.success && res.data) {
            setFarm(res.data.farm || res.data);
          }
        } catch (e) {
          console.warn('Error loading farm profile:', e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFarmProfile();
  }, [token]);

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.userHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.border }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {user?.name?.substring(0, 1).toUpperCase() || 'F'}
              </Text>
            </View>
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Farmer Name'}</Text>
              <Text style={[styles.userRole, { color: colors.primary }]}>{user?.role || 'FARMER'}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color={colors.mutedText} />
              <Text style={[styles.infoText, { color: colors.text }]}>{user?.email}</Text>
            </View>
            {user?.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color={colors.mutedText} />
                <Text style={[styles.infoText, { color: colors.text }]}>{user?.phone}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={16} color={colors.mutedText} />
              <Text style={[styles.infoText, { color: colors.text }]}>Language: {user?.language || 'English'}</Text>
            </View>
          </View>
        </View>

        {/* Farm Setup Card */}
        {farm && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Farm telemetry</Text>
            
            <View style={styles.farmGrid}>
              <View style={[styles.farmGridItem, { backgroundColor: colors.background }]}>
                <Text style={[styles.gridLabel, { color: colors.mutedText }]}>CROP TYPE</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>{farm.currentCrop || 'Not set'}</Text>
              </View>
              <View style={[styles.farmGridItem, { backgroundColor: colors.background }]}>
                <Text style={[styles.gridLabel, { color: colors.mutedText }]}>SOIL PROFILE</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>{farm.soilType || 'Not set'}</Text>
              </View>
              <View style={[styles.farmGridItem, { backgroundColor: colors.background }]}>
                <Text style={[styles.gridLabel, { color: colors.mutedText }]}>SEASON</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>{farm.season || 'Not set'}</Text>
              </View>
              <View style={[styles.farmGridItem, { backgroundColor: colors.background }]}>
                <Text style={[styles.gridLabel, { color: colors.mutedText }]}>LAND SIZE</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>
                  {farm.landSize?.value || 0} {farm.landSize?.unit || 'Acres'}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.coordRow}>
              <Ionicons name="map-outline" size={16} color={colors.primary} />
              <View>
                <Text style={[styles.coordTitle, { color: colors.text }]}>Location Coordinates</Text>
                <Text style={[styles.coordVal, { color: colors.mutedText }]}>
                  Lat: {farm.location?.latitude?.toFixed(4) || 'N/A'}, Lon: {farm.location?.longitude?.toFixed(4) || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Actions */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.danger + '10', borderColor: colors.danger + '40' }]}
          onPress={logout}
        >
          <Ionicons name="log-out" size={18} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out Session</Text>
        </TouchableOpacity>
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
    gap: 14,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
  },
  userRole: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  infoList: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  farmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  farmGridItem: {
    width: (width - 64) / 2,
    padding: 12,
    borderRadius: 14,
    gap: 4,
  },
  gridLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coordTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  coordVal: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginTop: 12,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
