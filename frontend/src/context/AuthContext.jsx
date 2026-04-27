import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/modules/authService.js';
import { userService as userApi } from '../services/modules/userService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('[AuthProvider] Token trong localStorage:', !!token ? 'Có' : 'Không có');
      if (token) {
        try {
          const response = await userApi.getCurrentUser();
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.log('[AuthProvider] Lỗi khi kiểm tra user:', error);
          localStorage.removeItem('accessToken');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('accessToken', response.accessToken);

      // Fetch user data
      const userResponse = await userApi.getCurrentUser();
      setUser(userResponse.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('[AuthProvider] login thất bại:', error.message || error);
      throw error;
    }
  };

  const registerUser = async (data) => {
    try {

      await authService.register(data);
      // After registration, automatically login
      return await login(data.email, data.password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    loginUser,
    registerUser,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
