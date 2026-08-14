import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword } from '@/services/authService';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  
  const colors = scheme === 'dark' ? Theme.darkColors : Theme.colors;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(true);
    
    try {
      await login(email.trim().toLowerCase(), password);
      // AuthProvider handles redirection automatically on state update
    } catch (error: any) {
      setErrorMessage(error.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address to reset password.');
      return;
    }
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(true);

    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      if (res?.success) {
        setInfoMessage(res.message || 'Password reset link generated successfully.');
      } else {
        setErrorMessage(res?.message || 'Password reset request failed.');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Password reset request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Logo / Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.border }]}>
              <Ionicons name="leaf" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.appName, { color: colors.text }]}>🌱 KrishiMitra</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>
              Smart Farm Decision Support System
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {errorMessage && (
              <View style={[styles.alertContainer, { backgroundColor: colors.danger + '15', borderColor: colors.danger }]}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={[styles.alertText, { color: colors.danger }]}>{errorMessage}</Text>
              </View>
            )}

            {infoMessage && (
              <View style={[styles.alertContainer, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.alertText, { color: colors.success }]}>{infoMessage}</Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={18} color={colors.mutedText} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.mutedText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>PASSWORD</Text>
                <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                  <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.mutedText} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.mutedText}
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Signup navigation */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.mutedText }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)} disabled={isLoading}>
                <Text style={[styles.footerLink, { color: colors.primary }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  inputContainer: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    height: '100%',
  },
  button: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '800',
  },
});
