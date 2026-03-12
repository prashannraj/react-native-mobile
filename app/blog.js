import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { blogService } from '@/src/services/api';
import { useRouter } from 'expo-router';

const BlogScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogService.getPosts();
        const cleanUrl = (url) => {
          if (!url) return null;
          return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
        };

        const cleanPosts = (response?.data?.data?.data || []).map(post => ({
          ...post,
          thumbnail: cleanUrl(post.thumbnail),
        }));
        setPosts(cleanPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/blog/${item.slug}`)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>{item.excerpt}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Latest Blog Posts</Text>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
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
  card: { flexDirection: 'row', backgroundColor: '#1e1e1e', borderRadius: 8, marginBottom: 15, overflow: 'hidden' },
  thumbnail: { width: 120, height: 100 },
  info: { flex: 1, padding: 10 },
  title: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  excerpt: { color: '#ccc', fontSize: 12, marginTop: 5 },
  date: { color: '#888', fontSize: 10, marginTop: 5 }
});

export default BlogScreen;
