import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { subscriptionService } from '@/src/services/api';
import { CreditCard, Check, Crown, ChevronLeft, ArrowLeft, Star, Phone } from 'lucide-react-native';

const SubscriptionsScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await subscriptionService.getSubscriptions();
        setPlans(response.data.data || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = (plan) => {
    Alert.alert(
      'Subscribe',
      `Would you like to ${user?.is_premium ? 'renew' : 'upgrade to'} the ${plan.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => Alert.alert('Payment', 'Redirecting to payment gateway...') }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  // Find Premium plan for the specialized UI
  const premiumPlan = plans.find(p => p.slug === 'premium') || { price: '499', name: 'Premium Plan' };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/dashboard')}>
          <ArrowLeft color="white" size={20} />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Choose Your Premium Plan</Text>
        <Text style={styles.subtitle}>
          Upgrade to Premium to unlock exclusive content, newly released movies, and high-quality streaming.
        </Text>
      </View>

      <View style={styles.plansRow}>
        {/* Basic Plan Info */}
        <View style={[styles.planCard, styles.basicCard]}>
          <View style={styles.planHeader}>
            <Check color="#4caf50" size={24} style={{ marginRight: 10 }} />
            <Text style={styles.planName}>Basic Plan</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.freePrice}>FREE</Text>
            <Text style={styles.priceSuffix}> / Auto-Activated</Text>
          </View>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Check size={16} color="#4caf50" style={{ marginRight: 10 }} />
              <Text style={styles.featureText}>Normal Films & Short Films</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={16} color="#4caf50" style={{ marginRight: 10 }} />
              <Text style={styles.featureText}>Documentaries & TV Shows</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={16} color="#4caf50" style={{ marginRight: 10 }} />
              <Text style={styles.featureText}>Reels & Blogs</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={16} color="#4caf50" style={{ marginRight: 10 }} />
              <Text style={styles.featureText}>Standard Quality Streaming</Text>
            </View>
          </View>

          <View style={styles.activeLabel}>
            <Text style={styles.activeLabelText}>Currently Active for You</Text>
          </View>
        </View>

        {/* Premium Plan Info */}
        <View style={[styles.planCard, styles.premiumCard]}>
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>

          <View style={styles.planHeader}>
            <Crown color="#ffc107" size={24} style={{ marginRight: 10 }} />
            <Text style={styles.planName}>Premium Plan</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.premiumPrice}>Rs. {premiumPlan.price}</Text>
            <Text style={styles.priceSuffix}> / month</Text>
          </View>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Star size={16} color="#ff4444" style={{ marginRight: 10 }} />
              <Text style={[styles.featureText, { fontWeight: 'bold', color: 'white' }]}>Everything in Basic</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={16} color="#ff4444" style={{ marginRight: 10 }} />
              <Text style={styles.featureText}>Premium Movies & TV Shows</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={16} color="#ff4444" style={{ marginRight: 10 }} />
              <Text style={styles.featureText}>Newly Released Blockbusters</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={16} color="#ff4444" style={{ marginRight: 10 }} />
              <Text style={styles.featureText}>4K Ultra HD Streaming</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={16} color="#ff4444" style={{ marginRight: 10 }} />
              <Text style={styles.featureText}>Watch on Multiple Devices</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.subscribeButton} onPress={() => handleSubscribe(premiumPlan)}>
            <Text style={styles.subscribeButtonText}>
              {user?.is_premium ? 'Renew Premium' : 'Upgrade to Premium'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Phone size={16} color="#888" style={{ marginRight: 8 }} />
        <Text style={styles.footerText}>
          Questions? Contact or call at 980000000 our support team for assistance.
        </Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  centered: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  
  headerContainer: { padding: 25, paddingTop: 50, alignItems: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 30, backgroundColor: '#1a1a1a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  backButtonText: { color: 'white', marginLeft: 8, fontSize: 14 },
  
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 15 },
  subtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  
  plansRow: { padding: 20 },
  planCard: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 25, marginBottom: 30, position: 'relative', overflow: 'hidden' },
  basicCard: { borderLeftWidth: 4, borderLeftColor: '#4caf50' },
  premiumCard: { borderLeftWidth: 4, borderLeftColor: '#ff4444' },
  
  recommendedBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#ff4444', paddingHorizontal: 12, paddingVertical: 6, borderBottomLeftRadius: 10 },
  recommendedText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  planName: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 25 },
  freePrice: { fontSize: 32, fontWeight: '900', color: '#4caf50' },
  premiumPrice: { fontSize: 32, fontWeight: '900', color: '#ff4444' },
  priceSuffix: { fontSize: 14, color: '#666' },
  
  featureList: { marginBottom: 30 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  featureText: { fontSize: 14, color: '#aaa' },
  
  activeLabel: { backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingVertical: 10, borderRadius: 25, alignItems: 'center' },
  activeLabelText: { color: '#4caf50', fontWeight: 'bold', fontSize: 14 },
  
  subscribeButton: { backgroundColor: '#ff4444', paddingVertical: 15, borderRadius: 30, alignItems: 'center', shadowColor: '#ff4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  subscribeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  footer: { flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'center' },
  footerText: { color: '#666', fontSize: 12, textAlign: 'center', flex: 1 },
});

export default SubscriptionsScreen;
