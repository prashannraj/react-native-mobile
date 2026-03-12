import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { videoService, watchProgressService } from '@/src/services/api';
import { useVideoPlayer, VideoView } from 'expo-video';

const VideoPlayerScreen = () => {
  const { slug, videoUrl } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.play();
  });

  // Track progress every 10 seconds
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(async () => {
      if (player.status === 'playing') {
        try {
          // We need a video ID to save progress. Since we don't have one,
          // we can't save progress in this scenario.
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [player]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  if (!videoUrl) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Video URL not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  errorText: { color: 'white', fontSize: 18 },
  video: { width: '100%', height: '100%' }
});

export default VideoPlayerScreen;
