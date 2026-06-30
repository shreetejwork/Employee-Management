import { api } from '../utils/api';

export const authService = {
  async login(username, password) {
    try {
      const res = await api.post('/auth/login', { username, password });
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Invalid username or password' };
    }
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  async changePassword(oldPassword, newPassword) {
    try {
      const res = await api.post('/auth/change-password', { oldPassword, newPassword });
      return res;
    } catch (error) {
      return { success: false, message: error.message || 'Failed to change password' };
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
