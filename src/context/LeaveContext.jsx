import { createContext, useContext, useState, useCallback } from 'react';
import { leaveService } from '../services/leaveService';

const LeaveContext = createContext(null);

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.getLeaves();
      setLeaves(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch leave records');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addLeave = useCallback(async (leaveData, employee) => {
    setLoading(true);
    setError(null);
    try {
      const newLeave = await leaveService.addLeave(leaveData, employee);
      const data = await leaveService.getLeaves();
      setLeaves(data);
      return newLeave;
    } catch (err) {
      setError(err.message || 'Failed to add leave');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveLeave = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await leaveService.approveLeave(id);
      const data = await leaveService.getLeaves();
      setLeaves(data);
    } catch (err) {
      setError(err.message || 'Failed to approve leave');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectLeave = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await leaveService.rejectLeave(id);
      const data = await leaveService.getLeaves();
      setLeaves(data);
    } catch (err) {
      setError(err.message || 'Failed to reject leave');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const filterLeaves = useCallback((filters) => {
    return leaveService.filterLeaves(leaves, filters);
  }, [leaves]);

  return (
    <LeaveContext.Provider
      value={{ leaves, loading, error, getLeaves, addLeave, approveLeave, rejectLeave, filterLeaves }}
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
