import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, socialLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const { url } = event;
      if (url && url.includes('auth-success')) {
        const queryParams = Linking.parse(url).queryParams;
        if (queryParams.token && queryParams.user) {
          handleSocialLoginSuccess(queryParams);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  const handleSocialLoginSuccess = async (data) => {
    // This is called when the deep link is received from the backend
    // The backend should redirect to: fcpbportal://auth-success?token=...&user=...
    setLoading(true);
    // In this flow, we already have the token and user from the URL
    // We can just manually set them or use a special socialLogin method that handles this
    // For now, let's assume we need to verify it or just complete the session
    // Since we're using AuthContext, we can update it there
    
    // We'll simulate the socialLogin call or directly update state if needed
    // But it's better to have the socialLogin method handle the storage
    const result = await socialLogin('direct', data); 
    setLoading(false);
    
    if (result.success) {
      router.replace('/(tabs)/dashboard');
    } else {
      Alert.alert('Social Login Failed', result.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    const authUrl = `https://fcpbportal.com/auth/${provider}/redirect?platform=mobile`;
    try {
      await WebBrowser.openAuthSessionAsync(authUrl, Linking.createURL('/auth-success'));
    } catch (error) {
      console.error(`${provider} login error:`, error);
      Alert.alert('Error', `Failed to start ${provider} login`);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        Alert.alert('Success', 'Logged in successfully');
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/icon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Welcome to FcpbPortal</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Text style={{ color: '#e91e63' }}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity 
          style={[styles.socialButton, styles.googleButton]} 
          onPress={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <Text style={styles.socialButtonText}>Login with Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.socialButton, styles.facebookButton]} 
          onPress={() => handleSocialLogin('facebook')}
          disabled={loading}
        >
          <Text style={styles.socialButtonText}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.guestLink}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 100, height: 100 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#333', color: 'white', padding: 15, borderRadius: 8, marginBottom: 15 },
  passwordContainer: { backgroundColor: '#333', borderRadius: 8, marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, color: 'white', padding: 15 },
  eyeIcon: { padding: 15 },
  button: { backgroundColor: '#e91e63', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  separatorText: { color: '#888', marginHorizontal: 10, fontWeight: 'bold' },
  
  socialContainer: { gap: 12 },
  socialButton: { padding: 15, borderRadius: 8, alignItems: 'center' },
  googleButton: { backgroundColor: 'white' },
  facebookButton: { backgroundColor: '#1877F2' },
  socialButtonText: { fontWeight: 'bold', fontSize: 16, color: '#121212' },
  facebookButton: { backgroundColor: '#1877F2' },
  socialButtonText: { fontWeight: 'bold', fontSize: 16, color: '#121212' },
  socialButtonText: { fontWeight: 'bold', fontSize: 16, color: '#121212' },
  guestLink: { color: '#888', marginTop: 30, textAlign: 'center' }
});

export default LoginScreen;
