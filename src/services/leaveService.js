import { delay } from '../utils/formatters';
import { generateLeaveId } from '../utils/idGenerator';
import { calculateLeaveDays } from '../utils/formatters';

export const leaveService = {
  async getLeaves(leaves) {
    await delay(300);
    return [...leaves];
  },

  async addLeave(leaves, leaveData, employee) {
    await delay(400);
    const days = calculateLeaveDays(leaveData.startDate, leaveData.endDate);
    const newLeave = {
      id: crypto.randomUUID(),
      leaveId: generateLeaveId(leaves),
      employeeId: employee.employeeId,
      employeeName: employee.fullName,
      department: employee.department,
      ...leaveData,
      days,
      status: 'Approved',
      createdAt: new Date().toISOString(),
    };
    return newLeave;
  },

  async approveLeave(leaves, id) {
    await delay(300);
    return leaves.map((l) =>
      l.id === id ? { ...l, status: 'Approved', updatedAt: new Date().toISOString() } : l
    );
  },

  async rejectLeave(leaves, id) {
    await delay(300);
    return leaves.map((l) =>
      l.id === id ? { ...l, status: 'Rejected', updatedAt: new Date().toISOString() } : l
    );
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
