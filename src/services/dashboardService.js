import { api } from '../utils/api';

export const dashboardService = {
  async getDashboardData() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
};
