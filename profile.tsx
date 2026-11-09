import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
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

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, updateUserProfile, logout, isAdmin } = useAuth();

  const [nameInput, setNameInput] = useState<string>(userProfile?.name || '');
  const [emailInput, setEmailInput] = useState<string>(userProfile?.email || '');
  const [avatarInput, setAvatarInput] = useState<string>(userProfile?.avatarUri || '');
  const [phoneInput, setPhoneInput] = useState<string>(userProfile?.phone || '');
  const [addressInput, setAddressInput] = useState<string>(userProfile?.address || '');

  useEffect(() => {
    if (userProfile) {
      setNameInput(userProfile.name || '');
      setEmailInput(userProfile.email || '');
      setAvatarInput(userProfile.avatarUri || '');
      setPhoneInput(userProfile.phone || '');
      setAddressInput(userProfile.address || '');
    }
  }, [userProfile]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/home');
    }
  };

  const handleSaveProfile = () => {
    const trimmedName = nameInput.trim();
    const trimmedEmail = emailInput.trim();
    const trimmedAvatar = avatarInput.trim();

    if (!trimmedName) {
      if (Platform.OS === 'web') alert('Please enter your full name.');
      else Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    if (!trimmedEmail) {
      if (Platform.OS === 'web') alert('Please enter your email address.');
      else Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }

    // 🔑 บันทึกค่ารูปภาพและข้อมูลโปรไฟล์ลงใน Context สู่ localStorage ถาวร
    updateUserProfile({
      name: trimmedName,
      email: trimmedEmail,
      avatarUri: trimmedAvatar,
      phone: phoneInput.trim(),
      address: addressInput.trim(),
    });

    if (Platform.OS === 'web') alert('Your profile has been updated successfully.');
    else Alert.alert('Success', 'Your profile has been updated successfully.');
  };

  const handleSignOut = () => {
    const doLogout = () => {
      logout();
      router.replace('/');
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (confirmed) {
        doLogout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: doLogout,
          },
        ]
      );
    }
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#4C1D95" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: avatarInput.trim() || defaultAvatar,
              }}
              style={styles.avatarImage}
            />
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {isAdmin ? 'ADMIN' : 'CUSTOMER'}
              </Text>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formCard}>
          <Text style={styles.formSectionTitle}>Account Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneInput}
              onChangeText={setPhoneInput}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shipping Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={addressInput}
              onChangeText={setAddressInput}
              placeholder="Enter delivery address"
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Avatar Image URL</Text>
            <TextInput
              style={styles.input}
              value={avatarInput}
              onChangeText={setAvatarInput}
              placeholder="https://example.com/photo.jpg"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4C1D95',
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  roleBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  formCard: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    marginBottom: 16,
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4C1D95',
    marginBottom: 16,
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
    color: '#3B0764',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#7C3AED',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  signOutBtn: {
    width: '100%',
    maxWidth: 600,
    height: 48,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  signOutText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
});