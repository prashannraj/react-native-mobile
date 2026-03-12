import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://fcpbportal.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export const movieService = {
  getMovies: () => api.get('/movies'),
  getMovieDetail: (slug) => api.get(`/movies/${slug}`),
  getMoviesByCategory: (category) => api.get(`/movies/category/${category}`),
  search: (query) => api.get(`/search?q=${query}`),
};

export const showService = {
  getShows: () => api.get('/shows'),
  getShowDetail: (slug) => api.get(`/shows/${slug}`),
  getSeason: (slug, season) => api.get(`/shows/${slug}/season/${season}`),
};

export const reelService = {
  getReels: () => api.get('/reels'),
  getReelDetail: (slug) => api.get(`/reels/${slug}`),
};

export const liveService = {
  getLiveChannels: () => api.get('/live'),
  getLiveChannelDetail: (slug) => api.get(`/live/${slug}`),
};

export const blogService = {
  getPosts: () => api.get('/blog'),
  getPostDetail: (slug) => api.get(`/blog/${slug}`),
};

export const videoService = {
  getVideo: (slug) => api.get(`/videos/${slug}`),
};

export const subscriptionService = {
  getSubscriptions: () => api.get('/subscriptions'),
  applyCoupon: (code) => api.post('/subscriptions/coupon', { code }),
  getCurrentSubscription: () => api.get('/my-subscription'),
};

export const watchProgressService = {
  updateProgress: (videoId, position) => api.post('/watch-progress', { video_id: videoId, position }),
};

export default api;
