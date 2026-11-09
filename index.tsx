import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  // Mode state: false = Login, true = Register
  const [isRegistering, setIsRegistering] = useState(false);

  // Input States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [errorMessage, setErrorMessage] = useState('');

  // Register Input States
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle Login with Credential Validation
  const handleLogin = () => {
    setErrorMessage('');
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    // Check empty fields
    if (!trimmedIdentifier || !trimmedPassword) {
      setErrorMessage('Please enter both username/email and password.');
      return;
    }

    // Strict Credential Verification
    if (role === 'admin') {
      if (
        trimmedIdentifier === 'adminlita@gems.com' &&
        trimmedPassword === '6730251166'
      ) {
        login('admin');
        router.replace('/home');
      } else {
        setErrorMessage(
          'Invalid Admin credentials. Please check your username and password.'
        );
      }
    } else {
      if (
        trimmedIdentifier === 'special001' &&
        trimmedPassword === 'guess001'
      ) {
        login('user');
        router.replace('/home');
      } else {
        setErrorMessage(
          'Invalid Customer credentials. Please check your username and password.'
        );
      }
    }
  };

  // Handle Dummy Register Logic
  const handleRegister = () => {
    setErrorMessage('');
    const trimmedName = fullName.trim();
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedName || !trimmedIdentifier || !trimmedPassword || !trimmedConfirm) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const msg =
      'Registration successful! You can now sign in with your credentials.';
    if (Platform.OS === 'web') {
      alert(msg);
    } else {
      Alert.alert('Success', msg);
    }

    // Switch back to Login mode
    setIsRegistering(false);
    setPassword('');
    setConfirmPassword('');
  };

  const toggleAuthMode = () => {
    setErrorMessage('');
    setIsRegistering(!isRegistering);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Header Title */}
          <Text style={styles.title}>
            {isRegistering ? 'Create Account 🚀' : '𝘾𝙖𝙩𝙚𝙧𝙖𝙖 𝙂𝙚𝙢𝙨𝙩𝙤𝙣𝙚 .𝙘𝙤'}
          </Text>
          <Text style={styles.subtitle}>
            {isRegistering
              ? 'Sign up to start shopping'
              : '𝘌𝘢𝘳𝘵𝘩’𝘴 𝘦𝘯𝘦𝘳𝘨𝘺, 𝘢𝘭𝘪𝘨𝘯𝘦𝘥 𝘸𝘪𝘵𝘩 𝘺𝘰𝘶𝘳 𝘪𝘯𝘵𝘦𝘯𝘵𝘪𝘰𝘯𝘴.'}
          </Text>

          {/* Error Message Display */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Role Selector (Customer vs Admin) */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'user' && styles.roleBtnActive]}
              onPress={() => {
                setRole('user');
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.roleText,
                  role === 'user' && styles.roleTextActive,
                ]}
              >
                🗣 Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'admin' && styles.roleBtnActive]}
              onPress={() => {
                setRole('admin');
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.roleText,
                  role === 'admin' && styles.roleTextActive,
                ]}
              >
                🜲 Admin
              </Text>
            </TouchableOpacity>
          </View>

          {/* Full Name Field (Register Only) */}
          {isRegistering && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {/* Username / Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {isRegistering ? 'Email Address' : 'Username or Email'}
            </Text>
            <TextInput
              style={styles.input}
              value={identifier}
              onChangeText={setIdentifier}
              placeholder={
                isRegistering
                  ? 'Enter your email address'
                  : role === 'admin'
                  ? 'adminlita@gems.com'
                  : 'special001'
              }
              autoCapitalize="none"
              keyboardType={isRegistering ? 'email-address' : 'default'}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Field (Register Only) */}
          {isRegistering && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter your password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={isRegistering ? handleRegister : handleLogin}
          >
            <Text style={styles.submitBtnText}>
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Toggle Login/Register Mode */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isRegistering
                ? 'Already have an account? '
                : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.toggleLinkText}>
                {isRegistering ? 'Sign In' : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5FF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#9933CC',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAF5FF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: '#9933CC',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  roleTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#9933CC',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#9933CC',
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  submitBtn: {
    backgroundColor: '#9933CC',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  toggleText: {
    fontSize: 13,
    color: '#6B7280',
  },
  toggleLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9933CC',
  },
});