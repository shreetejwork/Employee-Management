import { createContext, useContext, useState, useCallback } from 'react';
import { leaveService } from '../services/leaveService';

const LeaveContext = createContext(null);

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const data = await leaveService.getLeaves();
      setLeaves(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const addLeave = useCallback(async (leaveData, employee) => {
    setLoading(true);
    try {
      const newLeave = await leaveService.addLeave(leaveData, employee);
      setLeaves((prev) => [newLeave, ...prev]);
      return newLeave;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveLeave = useCallback(async (id) => {
    setLoading(true);
    try {
      await leaveService.approveLeave(id);
      // Reload leaves list from DB to get updated statuses and balances
      const data = await leaveService.getLeaves();
      setLeaves(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectLeave = useCallback(async (id) => {
    setLoading(true);
    try {
      await leaveService.rejectLeave(id);
      // Reload leaves list from DB to get updated statuses and balances
      const data = await leaveService.getLeaves();
      setLeaves(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterLeaves = useCallback((filters) => {
    return leaveService.filterLeaves(leaves, filters);
  }, [leaves]);

  return (
    <LeaveContext.Provider
      value={{ leaves, loading, getLeaves, addLeave, approveLeave, rejectLeave, filterLeaves }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeaveContext = () => {
  const context = useContext(LeaveContext);
  if (!context) throw new Error('useLeaveContext must be used within LeaveProvider');
  return context;
};
