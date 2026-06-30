import pool from '../config/db.js';

export const dashboardController = {
  async getStats(req, res) {
    try {
      // 1. Total Employees Count
      const [[{ totalEmployees }]] = await pool.query('SELECT COUNT(*) as totalEmployees FROM employees');

      // 2. Salary Slips Count
      const [[{ salarySlipsGenerated }]] = await pool.query('SELECT COUNT(*) as salarySlipsGenerated FROM salary_slips');

      // 3. Pending Leaves Count
      const [[{ pendingLeaves }]] = await pool.query('SELECT COUNT(*) as pendingLeaves FROM leave_requests WHERE status = "Pending"');

      // 4. Approved Leaves Count
      const [[{ approvedLeaves }]] = await pool.query('SELECT COUNT(*) as approvedLeaves FROM leave_requests WHERE status = "Approved"');

      // 5. Recent Employees (last 5)
      const [recentEmployees] = await pool.query('SELECT * FROM employees ORDER BY createdAt DESC LIMIT 5');

      // 6. Recent Salary Slips (last 5)
      const [recentSalarySlips] = await pool.query(`
        SELECT ss.*, emp.fullName as employeeName, emp.department, emp.employeeId
        FROM salary_slips ss
        JOIN employees emp ON ss.employee_id = emp.id
        ORDER BY ss.generatedAt DESC LIMIT 5
      `);

      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];

      return res.status(200).json({
        success: true,
        data: {
          totalEmployees: Number(totalEmployees),
          salarySlipsGenerated: Number(salarySlipsGenerated),
          pendingLeaves: Number(pendingLeaves),
          approvedLeaves: Number(approvedLeaves),
          recentEmployees,
          recentSalarySlips: recentSalarySlips.map(ss => ({
            ...ss,
            salaryMonthName: months[ss.salaryMonth],
            netSalary: Number(ss.netSalary),
            generatedAt: ss.generatedAt
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return res.status(500).json({ success: false, message: 'Failed to load dashboard metrics' });
    }
  }
};
