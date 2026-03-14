import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { User, Star, CreditCard, Film, Bookmark, History, Settings, LogOut, ChevronRight, Crown } from 'lucide-react-native';
import { subscriptionService } from '@/src/services/api';

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [subscription, setSubscription] = useState(null);

  // Mock data for missing API endpoints as requested by the template structure
  const [rentals, setRentals] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [viewHistories, setViewHistories] = useState([]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const subResponse = await subscriptionService.getCurrentSubscription();
      console.log('[Dashboard] Subscription response:', subResponse.data);
      setSubscription(subResponse.data.data || subResponse.data);
      
      if (user?.rentals) setRentals(user.rentals);
      if (user?.watchlist) setWatchlist(user.watchlist);
      if (user?.view_histories) setViewHistories(user.view_histories);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Please login to view your dashboard</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isPremium = user.is_premium || subscription?.is_premium;
  const currentPlan = subscription?.plan_name || (isPremium ? 'Premium' : 'Basic');

  const getAvatarUrl = () => {
    if (!user.avatar) return 'https://via.placeholder.com/120';
    if (user.avatar.startsWith('http')) return user.avatar;
    return `https://fcpbportal.com/storage/${user.avatar}`;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e91e63" />}
    >
      {/* Profile Header */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: getAvatarUrl() }} 
            style={styles.avatar} 
          />
          {isPremium && (
            <View style={styles.crownBadge}>
              <Crown size={12} color="#000" fill="#ffc107" />
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <View style={styles.badgeContainer}>
          {isPremium ? (
            <View style={[styles.badge, styles.premiumBadge]}>
              <Star size={14} color="#000" fill="#000" style={{ marginRight: 5 }} />
              <Text style={styles.premiumBadgeText}>Premium Member</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.basicBadge]}>
              <Text style={styles.basicBadgeText}>Basic User</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile-edit')}>
            <User size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LogOut size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome back, {user.name.split(' ')[0]}!</Text>
        <Text style={styles.subText}>Manage your subscription, rentals, and watchlist.</Text>

        {/* Active Subscription Card */}
        <View style={[styles.card, styles.subscriptionCard]}>
          <View style={styles.cardHeader}>
            <CreditCard size={20} color="#e91e63" style={{ marginRight: 10 }} />
            <Text style={styles.cardTitle}>Active Subscription</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.subscriptionInfo}>
              <View>
                <Text style={styles.infoLabel}>Current Plan</Text>
                <Text style={[styles.planName, isPremium ? styles.premiumText : styles.basicText]}>
                  {currentPlan} {!isPremium && <Text style={styles.autoActivated}>Auto-Activated</Text>}
                </Text>
                {!isPremium && (
                  <Text style={styles.planFeatures}>Features: Films, short films, documentary, reels, tv show, blogs</Text>
                )}
              </View>
              {isPremium && subscription?.ends_at && (
                <View>
                  <Text style={styles.infoLabel}>Renewal Date</Text>
                  <Text style={styles.infoValue}>{new Date(subscription.ends_at).toLocaleDateString()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={[styles.manageButton, !isPremium && styles.upgradeButton]}
              onPress={() => router.push('/subscriptions')}
            >
              <Text style={styles.manageButtonText}>{isPremium ? 'Manage Plan' : 'Upgrade to Premium'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Rentals */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Film size={20} color="#e91e63" style={{ marginRight: 10 }} />
            <Text style={styles.cardTitle}>Recent Rentals</Text>
          </View>
          <View style={styles.cardBody}>
            {rentals.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {rentals.map((rental, index) => (
                  <View key={index} style={styles.rentalItem}>
                    <Image source={{ uri: rental.video?.poster_url }} style={styles.rentalPoster} />
                    <View style={styles.rentedBadge}>
                      <Text style={styles.rentedBadgeText}>Rented</Text>
                    </View>
                    <Text style={styles.rentalTitle} numberOfLines={1}>{rental.video?.title}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <Film size={40} color="#444" style={{ marginBottom: 10 }} />
                <Text style={styles.emptyText}>No recently rented movies.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Watchlist & History */}
        <View style={styles.row}>
          {/* Watchlist */}
          <View style={[styles.card, styles.halfCard]}>
            <View style={styles.cardHeader}>
              <Bookmark size={18} color="#e91e63" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitleSmall}>Watchlist</Text>
            </View>
            <View style={styles.cardBody}>
              {watchlist.length > 0 ? (
                watchlist.slice(0, 3).map((item, index) => (
                  <TouchableOpacity key={index} style={styles.listItem}>
                    <Image source={{ uri: item.video?.poster_url }} style={styles.listPoster} />
                    <View style={styles.listInfo}>
                      <Text style={styles.listTitle} numberOfLines={1}>{item.video?.title}</Text>
                      <Text style={styles.listSubtitle}>{item.video?.type}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyTextSmall}>Your watchlist is empty.</Text>
              )}
            </View>
          </View>

          {/* Recently Watched */}
          <View style={[styles.card, styles.halfCard]}>
            <View style={styles.cardHeader}>
              <History size={18} color="#e91e63" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitleSmall}>History</Text>
            </View>
            <View style={styles.cardBody}>
              {viewHistories.length > 0 ? (
                viewHistories.slice(0, 3).map((item, index) => (
                  <TouchableOpacity key={index} style={styles.listItem}>
                    <Image source={{ uri: item.video?.poster_url }} style={styles.listPoster} />
                    <View style={styles.listInfo}>
                      <Text style={styles.listTitle} numberOfLines={1}>{item.video?.title}</Text>
                      <Text style={styles.listSubtitle}>Watched</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyTextSmall}>No watch history yet.</Text>
              )}
            </View>
          </View>
        </View>
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
  centered: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { color: 'white', fontSize: 16, marginBottom: 20 },
  loginButton: { backgroundColor: '#e91e63', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  loginButtonText: { color: 'white', fontWeight: 'bold' },
  
  profileSection: { alignItems: 'center', padding: 30, backgroundColor: '#1a1a1a', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#e91e63' },
  crownBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#ffc107', padding: 6, borderRadius: 15, borderWidth: 2, borderColor: 'white' },
  userName: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  userEmail: { fontSize: 14, color: '#888', marginBottom: 15 },
  
  badgeContainer: { marginBottom: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  premiumBadge: { backgroundColor: '#ffc107' },
  premiumBadgeText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  basicBadge: { backgroundColor: '#333' },
  basicBadgeText: { color: '#888', fontWeight: 'bold', fontSize: 12 },
  
  actionButtons: { flexDirection: 'row', gap: 10 },
  editButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e91e63', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  
  content: { padding: 20 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subText: { fontSize: 14, color: '#888', marginBottom: 25 },
  
  card: { backgroundColor: '#1a1a1a', borderRadius: 15, marginBottom: 20, overflow: 'hidden' },
  subscriptionCard: { borderLeftWidth: 4, borderLeftColor: '#e91e63' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  cardTitleSmall: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  cardBody: { padding: 15 },
  
  subscriptionInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 5 },
  planName: { fontSize: 20, fontWeight: 'bold' },
  premiumText: { color: '#ffc107' },
  basicText: { color: '#4caf50' },
  autoActivated: { fontSize: 10, backgroundColor: '#4caf50', color: 'white', paddingHorizontal: 5, borderRadius: 5 },
  planFeatures: { fontSize: 12, color: '#666', marginTop: 5 },
  infoValue: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  
  manageButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ffc107', paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  upgradeButton: { backgroundColor: '#e91e63', borderColor: '#e91e63' },
  manageButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  
  rentalItem: { width: 100, marginRight: 15 },
  rentalPoster: { width: 100, height: 150, borderRadius: 10 },
  rentedBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#e91e63', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  rentedBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  rentalTitle: { color: 'white', fontSize: 12, marginTop: 5, fontWeight: '500' },
  
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { color: '#666', fontSize: 14 },
  emptyTextSmall: { color: '#666', fontSize: 12, textAlign: 'center' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfCard: { width: '48%' },
  
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  listPoster: { width: 40, height: 60, borderRadius: 5 },
  listInfo: { marginLeft: 10, flex: 1 },
  listTitle: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  listSubtitle: { color: '#666', fontSize: 10 },
  footer: { padding: 30, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#222', marginTop: 20 },
  footerText: { color: '#666', fontSize: 12, textAlign: 'center' }
});

export default DashboardScreen;
