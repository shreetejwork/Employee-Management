import { LeaveModel } from '../models/leave.js';

export const leaveController = {
  async getAll(req, res) {
    try {
      const { search, status, leaveType } = req.query;
      const leaves = await LeaveModel.getAll({ search, status, leaveType });
      return res.status(200).json({ success: true, data: leaves });
    } catch (error) {
      console.error('Error fetching leaves:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch leaves' });
    }
  },

  async getBalances(req, res) {
    const { employeeId } = req.params;
    try {
      const balances = await LeaveModel.getBalancesByEmployeeId(employeeId);
      return res.status(200).json({ success: true, data: balances });
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch leave balances' });
    }
  },

  async create(req, res) {
    const leaveData = req.body;
    
    if (!leaveData.employee_id || !leaveData.leaveType || !leaveData.startDate || !leaveData.endDate) {
      return res.status(400).json({ success: false, message: 'Missing required leave fields' });
    }

    try {
      const newLeave = await LeaveModel.create(leaveData);
      return res.status(201).json({ success: true, data: newLeave });
    } catch (error) {
      console.error('Error creating leave request:', error);
      return res.status(400).json({ success: false, message: error.message || 'Failed to create leave request' });
    }
  },

  async approve(req, res) {
    const { id } = req.params;
    try {
      await LeaveModel.approve(id);
      return res.status(200).json({ success: true, message: 'Leave approved successfully' });
    } catch (error) {
      console.error('Error approving leave:', error);
      return res.status(400).json({ success: false, message: error.message || 'Failed to approve leave' });
    }
  },

  async reject(req, res) {
    const { id } = req.params;
    try {
      await LeaveModel.reject(id);
      return res.status(200).json({ success: true, message: 'Leave request rejected' });
    } catch (error) {
      console.error('Error rejecting leave:', error);
      return res.status(400).json({ success: false, message: error.message || 'Failed to reject leave' });
    }
  }
};
