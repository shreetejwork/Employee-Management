import { createContext, useContext, useState, useCallback } from 'react';
import { leaveService } from '../services/leaveService';

const LeaveContext = createContext(null);

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLeaves = useCallback(async () => {
    setLoading(true);
    try {
      return await leaveService.getLeaves(leaves);
    } finally {
      setLoading(false);
    }
  }, [leaves]);

  const addLeave = useCallback(async (leaveData, employee) => {
    setLoading(true);
    try {
      const newLeave = await leaveService.addLeave(leaves, leaveData, employee);
      setLeaves((prev) => [...prev, newLeave]);
      return newLeave;
    } finally {
      setLoading(false);
    }
  }, [leaves]);

  const approveLeave = useCallback(async (id) => {
    setLoading(true);
    try {
      const updated = await leaveService.approveLeave(leaves, id);
      setLeaves(updated);
    } finally {
      setLoading(false);
    }
  }, [leaves]);

  const rejectLeave = useCallback(async (id) => {
    setLoading(true);
    try {
      const updated = await leaveService.rejectLeave(leaves, id);
      setLeaves(updated);
    } finally {
      setLoading(false);
    }
  }, [leaves]);

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
