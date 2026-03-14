import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AuthContext] Checking for stored token...');
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          console.log('[AuthContext] Token found. Fetching user...');
          setToken(storedToken);
          const response = await authService.getUser();
          console.log('[AuthContext] GetUser response:', response.data);
          
          const userData = response.data.data || response.data;
          setUser(userData);
          console.log('[AuthContext] User fetched successfully.');
        } else {
          console.log('[AuthContext] No token found.');
        }
      } catch (error) {
        console.error('[AuthContext] Error during initial auth check:', error.response?.data || error.message);
      } finally {
        console.log('[AuthContext] Auth check finished. Hiding splash screen.');
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('[AuthContext] Attempting login for:', email);
      const response = await authService.login(email, password);
      console.log('[AuthContext] Login response:', response.data);
      
      const responseData = response.data.data || response.data;
      const { token, user } = responseData;
      
      if (!token || !user) {
        console.error('[AuthContext] Missing token or user in response:', responseData);
        return { success: false, message: 'Invalid response from server' };
      }

      await SecureStore.setItemAsync('userToken', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', JSON.stringify(error.response?.data, null, 2) || error.message);
      return { success: false, message: error.response?.data?.message || error.message || 'Login failed' };
    }
  };

  const socialLogin = async (provider, data) => {
     try {
       console.log(`[AuthContext] Attempting social login for: ${provider}`);
       
       let responseData;
       if (provider === 'direct') {
         // Data already contains token and user from deep link
         responseData = data;
       } else {
         const response = await authService.socialLogin(provider, data);
         console.log('[AuthContext] Social login response:', response.data);
         responseData = response.data.data || response.data;
       }
       
       const { token, user } = responseData;
       
       if (!token || !user) {
         console.error('[AuthContext] Missing token or user in response:', responseData);
         return { success: false, message: 'Invalid response from server' };
       }
 
       await SecureStore.setItemAsync('userToken', token);
       setToken(token);
       setUser(user);
       return { success: true };
     } catch (error) {
       console.error('Social login failed:', JSON.stringify(error.response?.data, null, 2) || error.message);
       return { success: false, message: error.response?.data?.message || error.message || 'Social login failed' };
     }
   };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('userToken');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
