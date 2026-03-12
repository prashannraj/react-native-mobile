import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { blogService } from '@/src/services/api';
import RenderHtml from 'react-native-render-html';

const BlogDetailScreen = () => {
  const { slug } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await blogService.getPostDetail(slug);
        const data = response?.data?.data?.blog || response?.data?.data;
        const cleanUrl = (url) => {
          if (!url) return null;
          return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
        };

        if (data) {
          setPost({
            ...data,
            thumbnail: cleanUrl(data.thumbnail),
          });
        }
      } catch (error) {
        console.error('Error fetching blog post detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  if (!post) return null;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: post.thumbnail }} style={styles.thumbnail} />
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.date}>{new Date(post.created_at).toLocaleDateString()}</Text>
        <RenderHtml
          contentWidth={width - 40}
          source={{ html: post.content }}
          baseStyle={{ color: '#ccc', fontSize: 16, lineHeight: 24 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  thumbnail: { width: '100%', height: 250 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  date: { color: '#888', fontSize: 14, marginBottom: 20 }
});

export default BlogDetailScreen;
