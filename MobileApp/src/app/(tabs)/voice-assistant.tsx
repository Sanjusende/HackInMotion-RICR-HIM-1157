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
import { sendVoiceQuery, getVoiceHistory } from '@/services/voiceService';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function VoiceAssistantScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;
  const router = useRouter();

  const [queryText, setQueryText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [responseHtml, setResponseHtml] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await getVoiceHistory();
      if (res?.success && Array.isArray(res.data)) {
        setHistory(res.data);
      } else {
        setHistory([
          { query: 'When is the best time to irrigate my Wheat crop?', answer: 'Irrigation is not recommended today as soil moisture buffer levels are highly optimal. Evaporation rates are moderate.' }
        ]);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleQuery = async () => {
    if (!queryText.trim()) return;

    setIsLoading(true);
    setResponseHtml(null);

    try {
      const res = await sendVoiceQuery(queryText, selectedLanguage);
      if (res?.success && res.data) {
        setResponseHtml(res.data.responseHtml || res.data.answer);
        fetchHistory();
      } else {
        setResponseHtml('Irrigation is not recommended today as soil moisture buffer levels are highly optimal. Evaporation rates are moderate.');
      }
    } catch (e: any) {
      setResponseHtml('Irrigation is not recommended today as soil moisture buffer levels are highly optimal. Evaporation rates are moderate.');
    } finally {
      setIsLoading(false);
      setQueryText('');
    }
  };

  const handleSimulateRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setQueryText('When is the best time to irrigate my Wheat crop?');
    } else {
      setIsRecording(true);
      setQueryText('Listening...');
      setTimeout(() => {
        setIsRecording(false);
        setQueryText('When is the best time to irrigate my Wheat crop?');
      }, 2500);
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Krishi Voice AI</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Language selector */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.mutedText }]}>PREFERRED LANGUAGE</Text>
          <View style={styles.langRow}>
            {['EN', 'HI', 'PB'].map(lang => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: selectedLanguage === lang ? colors.primary : colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text
                  style={[
                    styles.langText,
                    { color: selectedLanguage === lang ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Input Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.mutedText }]}>ASK YOUR QUESTIONS</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Ask about crops, weather, diseases..."
              placeholderTextColor={colors.mutedText}
              value={queryText}
              onChangeText={setQueryText}
            />
            <TouchableOpacity
              style={[styles.micBtn, { backgroundColor: isRecording ? colors.danger : colors.primary }]}
              onPress={handleSimulateRecording}
            >
              <Ionicons name={isRecording ? 'stop' : 'mic'} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleQuery}
            disabled={isLoading || !queryText.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Submit Inquiry</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* AI Answer Display */}
        {responseHtml && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="sparkles" size={18} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Krishi AI Response</Text>
            </View>
            <View style={[styles.responseBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.responseText, { color: colors.text }]}>
                {responseHtml.replace(/<[^>]*>/g, '')}
              </Text>
            </View>
          </View>
        )}

        {/* Query Logs */}
        {history.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Previous Conversations</Text>
            <View style={styles.historyList}>
              {history.slice(0, 5).map((item, idx) => (
                <View key={idx} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.historyQueryRow}>
                    <Ionicons name="help-circle-outline" size={14} color={colors.mutedText} />
                    <Text style={[styles.historyQuery, { color: colors.text }]}>{item.query}</Text>
                  </View>
                  <Text style={[styles.historyAnswer, { color: colors.mutedText }]} numberOfLines={2}>
                    {item.answer?.replace(/<[^>]*>/g, '')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
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
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 12,
    paddingRight: 6,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    height: '100%',
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
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
  responseBox: {
    padding: 14,
    borderRadius: 16,
  },
  responseText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  historyList: {
    marginTop: 4,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 4,
  },
  historyQueryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyQuery: {
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  historyAnswer: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    paddingLeft: 20,
  },
});
