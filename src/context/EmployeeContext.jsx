import { createContext, useContext, useState, useCallback } from 'react';
import { employeeService } from '../services/employeeService';

const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees(filters);
      setEmployees(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNextEmployeeId = useCallback(async () => {
    return employeeService.getNextEmployeeId();
  }, []);

  const addEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const newEmployee = await employeeService.addEmployee(employeeData);
      await fetchEmployees();
      return newEmployee;
    } catch (err) {
      setError(err.message || 'Failed to add employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEmployees]);

  const updateEmployee = useCallback(async (id, employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await employeeService.updateEmployee(id, employeeData);
      if (updated) {
        setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
      }
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await employeeService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmployee = useCallback(async (id) => {
    return employeeService.getEmployee(id);
  }, []);

  const filterEmployees = useCallback((filters) => {
    return employeeService.filterEmployees(employees, filters);
  }, [employees]);

  const sortEmployees = useCallback((sortField, sortOrder) => {
    return employeeService.sortEmployees(employees, sortField, sortOrder);
  }, [employees]);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        fetchEmployees,
        getNextEmployeeId,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        filterEmployees,
        sortEmployees,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) throw new Error('useEmployeeContext must be used within EmployeeProvider');
  return context;
};
