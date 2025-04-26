import axios from '../config/axios';

const API_URL = 'http://localhost:5000/api';

let currentUser = null;

const authService = {
  // Đăng ký
  async register(userData) {
    try {
      const response = await axios.post('/api/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        currentUser = response.data.user;
        window.dispatchEvent(new Event('authChange'));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đăng nhập
  async login(credentials) {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        currentUser = response.data.user;
        window.dispatchEvent(new Event('authChange'));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    window.dispatchEvent(new Event('authChange'));
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    const response = await axios.get('/api/auth/me');
    return response.data;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  // Update profile
  async updateProfile(userData) {
    const response = await axios.put('/api/auth/profile', userData);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      currentUser = response.data.user;
      window.dispatchEvent(new Event('authChange'));
    }
    return response.data;
  },

  // Get stored user data
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService; 