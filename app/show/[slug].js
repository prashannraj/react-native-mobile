import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { showService } from '@/src/services/api';
import { Play, ChevronRight } from 'lucide-react-native';

const ShowDetailScreen = () => {
  const { slug } = useLocalSearchParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchShowDetail = async () => {
      try {
        const response = await showService.getShowDetail(slug);
        const data = response?.data?.data;
        const cleanUrl = (url) => {
          if (!url) return null;
          return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
        };

        if (data) {
          setShow({
            ...data,
            poster: cleanUrl(data.poster),
            backdrop: cleanUrl(data.backdrop),
          });
        }
      } catch (error) {
        console.error('Error fetching show detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShowDetail();
  }, [slug]);

  useEffect(() => {
    if (show) {
      const fetchSeason = async () => {
        try {
          const response = await showService.getSeason(slug, activeSeason);
          const cleanUrl = (url) => {
            if (!url) return null;
            return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
          };

          const cleanEpisodes = (response?.data?.data || []).map(ep => ({
            ...ep,
            thumbnail: cleanUrl(ep.thumbnail),
            video_url: cleanUrl(ep.video_url),
          }));
          setEpisodes(cleanEpisodes);
        } catch (error) {
          console.error('Error fetching season:', error);
        }
      };
      fetchSeason();
    }
  }, [show, activeSeason, slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  if (!show) return null;

  const renderEpisode = ({ item }) => (
    <TouchableOpacity 
      style={styles.episodeCard} 
      onPress={() => router.push(`/video/${item.slug}?videoUrl=${encodeURIComponent(item.video_url)}`)}
    >
      <Image source={{ uri: item.thumbnail || show.poster }} style={styles.episodeThumbnail} />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle}>{item.title}</Text>
        <Text style={styles.episodeDuration}>{item.duration} mins</Text>
      </View>
      <Play color="white" size={20} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: show.backdrop || show.poster }} style={styles.backdrop} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{show.title}</Text>
        <Text style={styles.description}>{show.description}</Text>

        <View style={styles.seasonHeader}>
          <Text style={styles.seasonTitle}>Seasons</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(show.total_seasons || 1).keys()].map(i => (
              <TouchableOpacity 
                key={i} 
                style={[styles.seasonButton, activeSeason === i + 1 && styles.activeSeasonButton]}
                onPress={() => setActiveSeason(i + 1)}
              >
                <Text style={[styles.seasonButtonText, activeSeason === i + 1 && styles.activeSeasonButtonText]}>Season {i + 1}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={episodes}
          renderItem={renderEpisode}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  backdrop: { width: '100%', height: 250 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  description: { color: '#ccc', fontSize: 16, marginTop: 15, marginBottom: 25 },
  seasonHeader: { marginBottom: 20 },
  seasonTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  seasonButton: { paddingHorizontal: 20, paddingVertical: 10, marginRight: 10, borderRadius: 20, backgroundColor: '#333' },
  activeSeasonButton: { backgroundColor: '#e91e63' },
  seasonButtonText: { color: '#aaa', fontWeight: 'bold' },
  activeSeasonButtonText: { color: 'white' },
  episodeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 10, borderRadius: 8, marginBottom: 10 },
  episodeThumbnail: { width: 80, height: 60, borderRadius: 4 },
  episodeInfo: { flex: 1, marginLeft: 15 },
  episodeTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  episodeDuration: { color: '#888', fontSize: 12, marginTop: 2 }
});

export default ShowDetailScreen;
