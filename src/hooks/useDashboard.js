import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useEmployeeContext } from '../context/EmployeeContext';
import { useSalaryContext } from '../context/SalaryContext';
import { useLeaveContext } from '../context/LeaveContext';

export const useDashboard = () => {
  const { employees } = useEmployeeContext();
  const { salarySlips } = useSalaryContext();
  const { leaves } = useLeaveContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await dashboardService.getDashboardData(employees, salarySlips, leaves);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [employees, salarySlips, leaves]);

  return { data, loading };
};
