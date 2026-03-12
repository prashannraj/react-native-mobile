import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { movieService, showService } from '@/src/services/api';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, showsRes] = await Promise.all([
          movieService.getMovies(),
          showService.getShows()
        ]);

        // Clean up the poster URLs
        const cleanUrl = (url) => {
          if (!url) return null;
          // Remove backticks, trim, replace multiple spaces with single space, then encode
          return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
        };

        const cleanMovies = (moviesRes?.data?.data?.data || []).map(movie => ({
          ...movie,
          poster: cleanUrl(movie.poster),
          video_url: cleanUrl(movie.video_url),
        }));

        const cleanShows = (showsRes?.data?.data?.data || []).map(show => ({
          ...show,
          poster: cleanUrl(show.poster),
        }));

        setMovies(cleanMovies);
        setShows(cleanShows);

      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  const renderItem = ({ item, type }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/${type}/${item.slug}`)}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Recommended Movies</Text>
      <FlatList
        horizontal
        data={movies}
        renderItem={({ item }) => renderItem({ item, type: 'movie' })}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.header}>Trending Shows</Text>
      <FlatList
        horizontal
        data={shows}
        renderItem={({ item }) => renderItem({ item, type: 'show' })}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  header: { fontSize: 20, fontWeight: 'bold', color: 'white', marginVertical: 15 },
  card: { width: 120, marginRight: 15 },
  poster: { width: 120, height: 180, borderRadius: 8 },
  title: { color: 'white', marginTop: 5, fontSize: 14 }
});

export default HomeScreen;
