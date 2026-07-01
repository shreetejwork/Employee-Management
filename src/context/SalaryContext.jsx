import { createContext, useContext, useState, useCallback } from 'react';
import { salaryService } from '../services/salaryService';

const SalaryContext = createContext(null);

export const SalaryProvider = ({ children }) => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalarySlips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salaryService.getSalaryHistory();
      setSalarySlips(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch salary slips');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSalaryHistory = useCallback(async () => {
    return fetchSalarySlips();
  }, [fetchSalarySlips]);

  const generateSalarySlip = useCallback(async (slipData, employee) => {
    setLoading(true);
    setError(null);
    try {
      const newSlip = await salaryService.generateSalarySlip(slipData, employee, salarySlips);
      setSalarySlips((prev) => [newSlip, ...prev]);
      return newSlip;
    } catch (err) {
      setError(err.message || 'Failed to generate salary slip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [salarySlips]);

  const calculatePreview = useCallback((slipData, employee) => {
    return salaryService.calculatePreview(slipData, employee, salarySlips);
  }, [salarySlips]);

  return (
    <SalaryContext.Provider
      value={{
        salarySlips,
        loading,
        error,
        fetchSalarySlips,
        getSalaryHistory,
        generateSalarySlip,
        calculatePreview,
      }}
    >
      {children}
    </SalaryContext.Provider>
  );
};

export const useSalaryContext = () => {
  const context = useContext(SalaryContext);
  if (!context) throw new Error('useSalaryContext must be used within SalaryProvider');
  return context;
};
