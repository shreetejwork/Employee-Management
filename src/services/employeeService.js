import { delay } from '../utils/formatters';
import { generateEmployeeId } from '../utils/idGenerator';

export const employeeService = {
  async getEmployees(employees) {
    await delay(300);
    return [...employees];
  },

  async getEmployee(employees, id) {
    await delay(200);
    return employees.find((e) => e.id === id) || null;
  },

  async getNextEmployeeId(employees) {
    await delay(100);
    return generateEmployeeId(employees);
  },

  async addEmployee(employees, employeeData) {
    await delay(400);
    const newEmployee = {
      ...employeeData,
      id: crypto.randomUUID(),
      employeeId: employeeData.employeeId || generateEmployeeId(employees),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newEmployee;
  },

  async updateEmployee(employees, id, employeeData) {
    await delay(400);
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) return null;
    return {
      ...employees[index],
      ...employeeData,
      id,
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteEmployee(employees, id) {
    await delay(300);
    return employees.filter((e) => e.id !== id);
  },

  filterEmployees(employees, { search, department, status, grade }) {
    return employees.filter((emp) => {
      const matchesSearch =
        !search ||
        emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase()) ||
        emp.department?.toLowerCase().includes(search.toLowerCase());

      const matchesDept = !department || emp.department === department;
      const matchesStatus = !status || emp.status === status;
      const matchesGrade = !grade || emp.grade === grade;

      return matchesSearch && matchesDept && matchesStatus && matchesGrade;
    });
  },

  sortEmployees(employees, sortField, sortOrder) {
    return [...employees].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'basicPay') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === 'joiningDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  },
};
