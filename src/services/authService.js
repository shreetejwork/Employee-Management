import { delay } from '../utils/formatters';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

const getStoredPassword = () =>
  loadFromStorage(STORAGE_KEYS.ADMIN_PASSWORD, DEFAULT_CREDENTIALS.password);

export const authService = {
  async login(username, password) {
    await delay(500);
    const storedPassword = getStoredPassword();
    if (username === DEFAULT_CREDENTIALS.username && password === storedPassword) {
      return {
        success: true,
        user: { id: 1, username: 'admin', role: 'admin', name: 'Administrator' },
      };
    }
    return { success: false, message: 'Invalid username or password' };
  },

  async logout() {
    await delay(200);
    return { success: true };
  },

  async changePassword(oldPassword, newPassword) {
    await delay(300);
    const storedPassword = getStoredPassword();
    if (oldPassword !== storedPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    saveToStorage(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
    return { success: true };
  },
};
