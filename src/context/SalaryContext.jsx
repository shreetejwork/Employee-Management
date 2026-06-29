import { createContext, useContext, useState, useCallback } from 'react';
import { salaryService } from '../services/salaryService';

const SalaryContext = createContext(null);

export const SalaryProvider = ({ children }) => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSalaryHistory = useCallback(async () => {
    setLoading(true);
    try {
      return await salaryService.getSalaryHistory(salarySlips);
    } finally {
      setLoading(false);
    }
  }, [salarySlips]);

  const generateSalarySlip = useCallback(async (slipData, employee) => {
    setLoading(true);
    try {
      const newSlip = await salaryService.generateSalarySlip(salarySlips, slipData, employee);
      setSalarySlips((prev) => [...prev, newSlip]);
      return newSlip;
    } finally {
      setLoading(false);
    }
  }, [salarySlips]);

  const calculatePreview = useCallback((slipData, employee) => {
    return salaryService.calculatePreview(slipData, employee, salarySlips);
  }, [salarySlips]);

  return (
    <SalaryContext.Provider
      value={{ salarySlips, loading, getSalaryHistory, generateSalarySlip, calculatePreview }}
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
