import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { movieService } from '@/src/services/api';
import { Play, Share2, Info } from 'lucide-react-native';

const MovieDetailScreen = () => {
  const { slug } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await movieService.getMovieDetail(slug);
        const data = response?.data?.data?.movie;
        const cleanUrl = (url) => {
          if (!url) return null;
          return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
        };

        if (data) {
          setMovie({
            ...data,
            poster: cleanUrl(data.poster),
            backdrop: cleanUrl(data.backdrop),
            video_url: cleanUrl(data.video_url),
          });
        }
      } catch (error) {
        console.error('Error fetching movie detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.backdrop || movie.poster }} style={styles.backdrop} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        
        <View style={styles.meta}>
          <Text style={styles.metaText}>{movie.release_year}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{movie.duration} mins</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{movie.genre}</Text>
        </View>

        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => router.push(`/video/${movie.slug}?videoUrl=${encodeURIComponent(movie.video_url)}`)}
        >
          <Play fill="black" color="black" size={24} />
          <Text style={styles.playButtonText}>Watch Now</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionItem}>
            <Share2 color="white" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Info color="white" />
            <Text style={styles.actionText}>Info</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{movie.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  errorText: { color: 'white', fontSize: 18 },
  backdrop: { width: '100%', height: 250 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  metaText: { color: '#aaa', fontSize: 14 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#555', marginHorizontal: 10 },
  playButton: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 20 
  },
  playButtonText: { color: 'black', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  actionRow: { flexDirection: 'row', marginBottom: 25 },
  actionItem: { alignItems: 'center', marginRight: 40 },
  actionText: { color: 'white', fontSize: 12, marginTop: 5 },
  description: { color: '#ccc', fontSize: 16, lineHeight: 24 }
});

export default MovieDetailScreen;
