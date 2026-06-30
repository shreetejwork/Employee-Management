import { createContext, useContext, useState, useCallback } from 'react';
import { employeeService } from '../services/employeeService';

const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(async (filters) => {
    setLoading(true);
    try {
      const data = await employeeService.getEmployees(filters);
      setEmployees(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNextEmployeeId = useCallback(async () => {
    return employeeService.getNextEmployeeId();
  }, []);

  const addEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    try {
      const newEmployee = await employeeService.addEmployee(employeeData);
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (id, employeeData) => {
    setLoading(true);
    try {
      const updated = await employeeService.updateEmployee(id, employeeData);
      if (updated) {
        setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
      }
      return updated;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    setLoading(true);
    try {
      await employeeService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
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
