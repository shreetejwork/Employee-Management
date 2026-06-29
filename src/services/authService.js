import { delay } from '../utils/formatters';

const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export const authService = {
  async login(username, password) {
    await delay(500);
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
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
};
