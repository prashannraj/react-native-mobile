import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { LogOut, User, CreditCard, PlayCircle, BookOpen, Radio } from 'lucide-react-native';

const MoreScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const menuItems = [
    { title: 'My Profile', icon: <User color="white" />, onPress: () => router.push('/(tabs)/dashboard') },
    { title: 'Subscriptions', icon: <CreditCard color="white" />, onPress: () => router.push('/subscriptions') },
    { title: 'Reels', icon: <PlayCircle color="white" />, onPress: () => router.push('/reels') },
    { title: 'Live TV', icon: <Radio color="white" />, onPress: () => router.push('/live') },
    { title: 'Blog', icon: <BookOpen color="white" />, onPress: () => router.push('/blog') },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <User color="white" size={40} />
        </View>
        <Text style={styles.userName}>{user ? user.name : 'Guest User'}</Text>
        <Text style={styles.userEmail}>{user ? user.email : 'Login to access more features'}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            {item.icon}
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        {user ? (
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <LogOut color="#ff4444" />
            <Text style={[styles.menuText, { color: '#ff4444' }]}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.menuItem, styles.loginItem]} onPress={() => router.push('/login')}>
            <LogOut color="#44ff44" />
            <Text style={[styles.menuText, { color: '#44ff44' }]}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Film and Mass Communication Promotion Board. All rights reserved.</Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 40, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333' },
  profileIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  userName: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  userEmail: { fontSize: 14, color: '#aaa', marginTop: 5 },
  menuContainer: { padding: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  menuText: { fontSize: 16, color: 'white', marginLeft: 15 },
  logoutItem: { borderBottomWidth: 0, marginTop: 20 },
  loginItem: { borderBottomWidth: 0, marginTop: 20 },
  footer: { padding: 30, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#222', marginTop: 20 },
  footerText: { color: '#666', fontSize: 12, textAlign: 'center' }
});

export default MoreScreen;
