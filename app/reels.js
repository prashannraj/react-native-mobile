import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { reelService } from '@/src/services/api';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Heart, MessageCircle, Share2, Play } from 'lucide-react-native';

const { height, width } = Dimensions.get('window');

const ReelItem = ({ reel }) => {
  const player = useVideoPlayer(reel.url, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.reelContainer}>
      <VideoView
        style={styles.video}
        player={player}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.sideIcon}>
            <Heart color="white" size={30} />
            <Text style={styles.sideText}>{reel.likes_count || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideIcon}>
            <MessageCircle color="white" size={30} />
            <Text style={styles.sideText}>{reel.comments_count || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideIcon}>
            <Share2 color="white" size={30} />
            <Text style={styles.sideText}>Share</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.reelTitle}>{reel.title}</Text>
          <Text style={styles.reelDescription} numberOfLines={2}>{reel.description}</Text>
        </View>
      </View>
    </View>
  );
};

const ReelsScreen = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await reelService.getReels();
        const cleanUrl = (url) => {
          if (!url) return null;
          return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
        };

        const cleanReels = (response?.data?.data?.data || []).map(reel => ({
          ...reel,
          url: cleanUrl(reel.url),
          thumbnail: cleanUrl(reel.thumbnail),
        }));
        setReels(cleanReels);
      } catch (error) {
        console.error('Error fetching reels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        renderItem={({ item }) => <ReelItem reel={item} />}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  reelContainer: { width, height: height - 80 }, // Subtract tab bar height
  video: { width, height: height - 80 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', padding: 20 },
  sidebar: { position: 'absolute', right: 20, bottom: 100, alignItems: 'center' },
  sideIcon: { marginBottom: 20, alignItems: 'center' },
  sideText: { color: 'white', fontSize: 12, marginTop: 5 },
  footer: { width: '80%', marginBottom: 20 },
  reelTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  reelDescription: { color: '#ccc', fontSize: 14, marginTop: 5 }
});

export default ReelsScreen;
