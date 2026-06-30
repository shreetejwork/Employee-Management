import { EmployeeModel } from '../models/employee.js';

export const employeeController = {
  async getAll(req, res) {
    try {
      const { search, department, status, grade } = req.query;
      const employees = await EmployeeModel.getAll({ search, department, status, grade });
      return res.status(200).json({ success: true, data: employees });
    } catch (error) {
      console.error('Error fetching employees:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch employees' });
    }
  },

  async getById(req, res) {
    const { id } = req.params;
    try {
      const employee = await EmployeeModel.getById(id);
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      return res.status(200).json({ success: true, data: employee });
    } catch (error) {
      console.error('Error fetching employee:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch employee details' });
    }
  },

  async getNextId(req, res) {
    try {
      const nextId = await EmployeeModel.getNextEmployeeId();
      return res.status(200).json({ success: true, data: nextId });
    } catch (error) {
      console.error('Error generating employee ID:', error);
      return res.status(500).json({ success: false, message: 'Failed to generate employee ID' });
    }
  },

  async create(req, res) {
    const employeeData = req.body;
    
    // Quick validation
    if (!employeeData.fullName || !employeeData.email || !employeeData.mobile) {
      return res.status(400).json({ success: false, message: 'Name, email, and mobile number are required' });
    }

    try {
      const id = employeeData.id || crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      const newEmployee = await EmployeeModel.create({ ...employeeData, id });
      return res.status(201).json({ success: true, data: newEmployee });
    } catch (error) {
      console.error('Error creating employee:', error);
      return res.status(500).json({ success: false, message: 'Failed to register employee' });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const employeeData = req.body;

    try {
      const updated = await EmployeeModel.update(id, employeeData);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      const updatedEmployee = await EmployeeModel.getById(id);
      return res.status(200).json({ success: true, data: updatedEmployee });
    } catch (error) {
      console.error('Error updating employee:', error);
      return res.status(500).json({ success: false, message: 'Failed to update employee' });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleted = await EmployeeModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      return res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete employee' });
    }
  }
};
