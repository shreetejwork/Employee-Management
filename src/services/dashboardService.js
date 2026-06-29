import { delay } from '../utils/formatters';

export const dashboardService = {
  async getDashboardData(employees, salarySlips, leaves) {
    await delay(400);
    const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
    const approvedLeaves = leaves.filter((l) => l.status === 'Approved').length;
    const recentEmployees = [...employees]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    const recentSalarySlips = [...salarySlips]
      .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
      .slice(0, 5);

    return {
      totalEmployees: employees.length,
      salarySlipsGenerated: salarySlips.length,
      pendingLeaves,
      approvedLeaves,
      recentEmployees,
      recentSalarySlips,
    };
  },
};
