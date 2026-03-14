import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { User, Lock, Trash2, ChevronLeft, Crown, Save } from 'lucide-react-native';
import { authService } from '@/src/services/api';

const EditProfileScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Profile Info State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete State
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and Email are required');
      return;
    }
    setUpdatingProfile(true);
    try {
      const response = await authService.updateProfile({ name, email });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    setUpdatingPassword(true);
    try {
      await authService.updatePassword({ 
        current_password: currentPassword, 
        password: newPassword, 
        password_confirmation: confirmPassword 
      });
      Alert.alert('Success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is permanent.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (!deletePassword) {
              Alert.alert('Error', 'Please enter your password to confirm');
              return;
            }
            setDeletingAccount(true);
            try {
              await authService.deleteAccount(deletePassword);
              await logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete account');
            } finally {
              setDeletingAccount(false);
            }
          }
        }
      ]
    );
  };

  const getAvatarUrl = () => {
    if (!user?.avatar) return 'https://via.placeholder.com/120';
    if (user.avatar.startsWith('http')) return user.avatar;
    return `https://fcpbportal.com/storage/${user.avatar}`;
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Header / Sidebar style */}
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/dashboard')}>
          <ChevronLeft color="white" size={24} />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: getAvatarUrl() }} style={styles.avatar} />
            {user.is_premium && (
              <View style={styles.crownBadge}>
                <Crown size={12} color="#000" fill="#ffc107" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.dashboardButton} onPress={() => router.replace('/(tabs)/dashboard')}>
              <Text style={styles.buttonText}>Back to Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Account Settings</Text>
        <Text style={styles.subtitle}>Update your profile information and security settings.</Text>

        {/* Profile Information Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#e91e63" style={{ marginRight: 10 }} />
            <Text style={styles.sectionTitle}>Profile Information</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#666"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Your Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleUpdateProfile}
              disabled={updatingProfile}
            >
              {updatingProfile ? <ActivityIndicator color="white" /> : (
                <>
                  <Save size={18} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>Update Profile</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Update Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#e91e63" style={{ marginRight: 10 }} />
            <Text style={styles.sectionTitle}>Update Password</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Current Password"
              placeholderTextColor="#666"
            />
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="New Password"
              placeholderTextColor="#666"
            />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm New Password"
              placeholderTextColor="#666"
            />
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleUpdatePassword}
              disabled={updatingPassword}
            >
              {updatingPassword ? <ActivityIndicator color="white" /> : (
                <Text style={styles.saveButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Delete Account Section */}
        <View style={[styles.sectionCard, styles.deleteCard]}>
          <View style={styles.sectionHeader}>
            <Trash2 size={20} color="#ff4444" style={{ marginRight: 10 }} />
            <Text style={styles.sectionTitle}>Delete Account</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.deleteText}>Once your account is deleted, all of its resources and data will be permanently deleted.</Text>
            <TextInput
              style={[styles.input, { marginTop: 15 }]}
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
              placeholder="Enter password to confirm"
              placeholderTextColor="#666"
            />
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? <ActivityIndicator color="white" /> : (
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  headerSection: { backgroundColor: '#1a1a1a', padding: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { color: 'white', marginLeft: 5, fontSize: 16 },
  profileInfo: { alignItems: 'center' },
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#e91e63' },
  crownBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#ffc107', padding: 4, borderRadius: 10, borderWidth: 1, borderColor: 'white' },
  userName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  userEmail: { color: '#888', fontSize: 14, marginBottom: 15 },
  
  actionButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  dashboardButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e91e63', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 },
  logoutButton: { backgroundColor: '#333', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  
  content: { padding: 20 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 25 },
  
  sectionCard: { backgroundColor: '#1a1a1a', borderRadius: 15, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#e91e63', overflow: 'hidden' },
  deleteCard: { borderLeftColor: '#ff4444' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  sectionBody: { padding: 20 },
  
  label: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  input: { backgroundColor: '#222', color: 'white', padding: 12, borderRadius: 8, marginBottom: 15 },
  saveButton: { backgroundColor: '#e91e63', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 8, marginTop: 10 },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  
  deleteText: { color: '#aaa', fontSize: 14, lineHeight: 20 },
  deleteButton: { backgroundColor: '#ff4444', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 8, marginTop: 15 },
  deleteButtonText: { color: 'white', fontWeight: 'bold' }
});

export default EditProfileScreen;
