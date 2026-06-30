import { api } from '../utils/api';
import { calculateLeaveDays } from '../utils/formatters';

export const leaveService = {
  async getLeaves() {
    const res = await api.get('/leaves');
    return res.data || [];
  },

  async getBalances(employeeId) {
    const res = await api.get(`/leaves/balances/${employeeId}`);
    return res.data || [];
  },

  async addLeave(leaveData, employee) {
    const days = calculateLeaveDays(leaveData.startDate, leaveData.endDate);
    const payload = {
      employee_id: employee.id,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days,
      reason: leaveData.reason,
      status: 'Approved', // Defaults to approved when entered by admin
    };
    const res = await api.post('/leaves', payload);
    return res.data;
  },

  async approveLeave(id) {
    await api.put(`/leaves/${id}/approve`);
  },

  async rejectLeave(id) {
    await api.put(`/leaves/${id}/reject`);
  },

  filterLeaves(leaves, { search, status, leaveType }) {
    return leaves.filter((leave) => {
      const matchesSearch =
        !search ||
        leave.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        leave.employeeId?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || leave.status === status;
      const matchesType = !leaveType || leave.leaveType === leaveType;
      return matchesSearch && matchesStatus && matchesType;
    });
  },
};
