import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/modules/authService.js';
import { userService as userApi } from '../services/modules/userService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log('[AuthProvider] Mounted - Bắt đầu kiểm tra auth');
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AuthProvider] useEffect: Kiểm tra auth khi mount');
      const token = localStorage.getItem('accessToken');
      console.log('[AuthProvider] Token trong localStorage:', !!token ? 'Có' : 'Không có');
      if (token) {
        try {
          console.log('[AuthProvider] Token hợp lệ, kiểm tra user');
          const response = await userApi.getCurrentUser();
          console.log('[AuthProvider] User response:', response);
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.log('[AuthProvider] Lỗi khi kiểm tra user:', error);
          localStorage.removeItem('accessToken');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
      console.log('[AuthProvider] useEffect: Hoàn thành kiểm tra auth');
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    console.log('[AuthProvider] login: Bắt đầu đăng nhập');
    try {
      const response = await authService.login(email, password);
      console.log('[AuthProvider] login: Response:', response);
      localStorage.setItem('accessToken', response.accessToken);

      // Fetch user data
      console.log('[AuthProvider] Gọi getCurrentUser sau login...');
      const userResponse = await userApi.getCurrentUser();
      console.log('[AuthProvider] User data sau login:', userResponse.user?.email);
      setUser(userResponse.user);
      setIsAuthenticated(true);
      console.log('[AuthProvider] State cập nhật: isAuthenticated = true');
      return response;
    } catch (error) {
      console.error('[AuthProvider] login thất bại:', error.message || error);
      throw error;
    }
  };

  const register = async (data) => {
    console.log('[AuthProvider] register called với email:', data.email);
    try {
      await authService.register(data);
      // After registration, automatically login
      return await login(data.email, data.password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    console.log('[AuthProvider] logout called');
    try {
      await authService.logout();
      console.log('[AuthProvider] Logout thành công');
    } catch (error) {
      console.error('[AuthProvider] Logout thất bại:', error);
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      console.log('[AuthProvider] Logout hoàn tất, isAuthenticated = false');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
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
