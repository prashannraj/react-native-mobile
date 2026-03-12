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
          setUser(response.data.data);
          console.log('[AuthContext] User fetched successfully.');
        }
      } catch (error) {
        console.error('[AuthContext] Error during initial auth check:', error);
      } finally {
        console.log('[AuthContext] Auth check finished. Hiding splash screen.');
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data.data;
      await SecureStore.setItemAsync('userToken', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', JSON.stringify(error.response?.data, null, 2));
      return { success: false, message: error.response?.data?.message || 'Login failed' };
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
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
