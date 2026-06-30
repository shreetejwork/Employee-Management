import { api } from '../utils/api';

export const employeeService = {
  async getEmployees(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.grade) params.append('grade', filters.grade);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await api.get(`/employees${queryStr}`);
    return res.data || [];
  },

  async getEmployee(id) {
    const res = await api.get(`/employees/${id}`);
    return res.data || null;
  },

  async getNextEmployeeId() {
    const res = await api.get('/employees/next-id');
    return res.data;
  },

  async addEmployee(employeeData) {
    const res = await api.post('/employees', employeeData);
    return res.data;
  },

  async updateEmployee(id, employeeData) {
    const res = await api.put(`/employees/${id}`, employeeData);
    return res.data;
  },

  async deleteEmployee(id) {
    const res = await api.delete(`/employees/${id}`);
    return res.success;
  },

  // Client-side helper methods for filtering/sorting
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
