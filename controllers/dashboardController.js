import pool from '../config/db.js';
import { CompanyModel } from '../models/company.js';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const dashboardController = {
  async getStats(req, res) {
    try {
      const [[{ totalEmployees }]] = await pool.query('SELECT COUNT(*) as totalEmployees FROM employees');
      const [[{ activeEmployees }]] = await pool.query(
        'SELECT COUNT(*) as activeEmployees FROM employees WHERE status = "Active"'
      );
      const [[{ inactiveEmployees }]] = await pool.query(
        'SELECT COUNT(*) as inactiveEmployees FROM employees WHERE status != "Active"'
      );
      const [[{ salarySlipsGenerated }]] = await pool.query(
        'SELECT COUNT(*) as salarySlipsGenerated FROM salary_slips'
      );
      const [[{ pendingLeaves }]] = await pool.query(
        'SELECT COUNT(*) as pendingLeaves FROM leave_requests WHERE status = "Pending"'
      );
      const [[{ approvedLeaves }]] = await pool.query(
        'SELECT COUNT(*) as approvedLeaves FROM leave_requests WHERE status = "Approved"'
      );
      const [[{ employeesJoinedThisMonth }]] = await pool.query(`
        SELECT COUNT(*) as employeesJoinedThisMonth FROM employees
        WHERE MONTH(joiningDate) = MONTH(CURRENT_DATE())
          AND YEAR(joiningDate) = YEAR(CURRENT_DATE())
      `);

      const [recentEmployeesRaw] = await pool.query(
        'SELECT * FROM employees ORDER BY created_at DESC LIMIT 5'
      );

      const [recentSalarySlips] = await pool.query(`
        SELECT ss.*, emp.fullName as employeeName, emp.department, emp.employeeId
        FROM salary_slips ss
        JOIN employees emp ON ss.employee_id = emp.id
        ORDER BY ss.generatedAt DESC LIMIT 5
      `);

      const companyInfo = await CompanyModel.getInfo();

      const recentEmployees = recentEmployeesRaw.map((emp) => ({
        ...emp,
        createdAt: emp.created_at,
        updatedAt: emp.updated_at,
        basicPay: Number(emp.basicPay),
        da: Number(emp.da),
        hra: Number(emp.hra),
      }));

      return res.status(200).json({
        success: true,
        data: {
          totalEmployees: Number(totalEmployees),
          activeEmployees: Number(activeEmployees),
          inactiveEmployees: Number(inactiveEmployees),
          salarySlipsGenerated: Number(salarySlipsGenerated),
          employeesJoinedThisMonth: Number(employeesJoinedThisMonth),
          pendingLeaves: Number(pendingLeaves),
          approvedLeaves: Number(approvedLeaves),
          recentEmployees,
          recentSalarySlips: recentSalarySlips.map((ss) => ({
            ...ss,
            salaryMonthName: MONTHS[ss.salaryMonth],
            netSalary: Number(ss.netSalary),
            generatedAt: ss.generatedAt,
          })),
          companyInfo,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return res.status(500).json({ success: false, message: 'Failed to load dashboard metrics' });
    }
  },
};
