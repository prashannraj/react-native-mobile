import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { showService } from '@/src/services/api';
import { useRouter } from 'expo-router';

const ShowsScreen = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await showService.getShows();
        const cleanUrl = (url) => {
          if (!url) return null;
          return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
        };

        const cleanShows = (response?.data?.data?.data || []).map(show => ({
          ...show,
          poster: cleanUrl(show.poster),
        }));
        setShows(cleanShows);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  const renderShow = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/show/${item.slug}`)}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All TV Shows</Text>
      <FlatList
        data={shows}
        renderItem={renderShow}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginVertical: 20 },
  list: { paddingBottom: 20 },
  card: { flex: 1/3, marginBottom: 20, paddingHorizontal: 5 },
  poster: { width: '100%', height: 160, borderRadius: 8 },
  title: { color: 'white', marginTop: 5, fontSize: 12, textAlign: 'center' }
});

export default ShowsScreen;
