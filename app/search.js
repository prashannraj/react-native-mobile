import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { movieService } from '@/src/services/api';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, X } from 'lucide-react-native';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await movieService.search(text);
      const cleanUrl = (url) => {
        if (!url) return null;
        return encodeURI(url.replace(/`/g, '').trim().replace(/\s+/g, ' '));
      };

      const cleanResults = (response?.data?.data?.data || []).map(item => ({
        ...item,
        poster: cleanUrl(item.poster),
        video_url: cleanUrl(item.video_url),
      }));
      setResults(cleanResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/movie/${item.slug}`)}
    >
      <Image source={{ uri: item.poster }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.release_year} • {item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchIcon color="#888" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Search movies, shows..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <X color="#888" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e91e63" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            query.length > 1 && !loading ? (
              <Text style={styles.emptyText}>No results found for "{query}"</Text>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 10 },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#333', 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    marginVertical: 10 
  },
  input: { flex: 1, color: 'white', padding: 12, fontSize: 16 },
  card: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#222' },
  thumbnail: { width: 60, height: 80, borderRadius: 4 },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  title: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  meta: { color: '#888', fontSize: 12, marginTop: 5 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 40, fontSize: 16 }
});

export default SearchScreen;
