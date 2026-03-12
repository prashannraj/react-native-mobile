import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { liveService } from '@/src/services/api';
import { useRouter } from 'expo-router';
import { Radio } from 'lucide-react-native';

const LiveScreen = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await liveService.getLiveChannels();
        const cleanUrl = (url) => {
          if (!url) return null;
          return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
        };

        const cleanChannels = (response?.data?.data?.data || []).map(channel => ({
          ...channel,
          poster: cleanUrl(channel.poster),
          video_url: cleanUrl(channel.video_url),
        }));
        setChannels(cleanChannels);
      } catch (error) {
        console.error('Error fetching live channels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  const renderChannel = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/video/${item.slug}?videoUrl=${encodeURIComponent(item.video_url)}`)}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.redDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live TV Channels</Text>
      <FlatList
        data={channels}
        renderItem={renderChannel}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
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
  card: { flex: 1/2, marginBottom: 20, paddingHorizontal: 5 },
  poster: { width: '100%', height: 100, borderRadius: 8 },
  info: { marginTop: 10 },
  title: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', marginRight: 5 },
  liveText: { color: 'red', fontSize: 10, fontWeight: 'bold' }
});

export default LiveScreen;
