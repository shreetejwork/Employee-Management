import pool from '../config/db.js';

export const LeaveModel = {
  async getAll({ search, status, leaveType }) {
    let query = `
      SELECT lr.*, emp.fullName as employeeName, emp.employeeId, emp.department
      FROM leave_requests lr
      JOIN employees emp ON lr.employee_id = emp.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (emp.fullName LIKE ? OR emp.employeeId LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
    }
    if (status) {
      query += ' AND lr.status = ?';
      params.push(status);
    }
    if (leaveType) {
      query += ' AND lr.leaveType = ?';
      params.push(leaveType);
    }

    query += ' ORDER BY lr.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows.map(r => ({
      ...r,
      days: Number(r.days),
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  },

  async getBalancesByEmployeeId(employeeId) {
    const [rows] = await pool.query(
      'SELECT leave_type, allowed, used, remaining FROM leave_balances WHERE employee_id = ?',
      [employeeId]
    );
    return rows.map(r => ({
      leaveType: r.leave_type,
      allowed: Number(r.allowed),
      used: Number(r.used),
      remaining: Number(r.remaining)
    }));
  },

  async getNextLeaveId() {
    const [rows] = await pool.query('SELECT leaveId FROM leave_requests');
    let maxNum = 0;
    rows.forEach((leave) => {
      const match = leave.leaveId?.match(/LV(\d+)/);
      if (match) {
        maxNum = Math.max(maxNum, parseInt(match[1], 10));
      }
    });
    const nextNum = maxNum + 1;
    return `LV${String(nextNum).padStart(4, '0')}`;
  },

  async create(leaveData) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const { employee_id, leaveType, startDate, endDate, days, reason, status = 'Approved' } = leaveData;
      
      // Fetch current balance
      const [balances] = await connection.query(
        'SELECT * FROM leave_balances WHERE employee_id = ? AND leave_type = ?',
        [employee_id, leaveType]
      );

      const balance = balances[0];
      if (!balance) {
        throw new Error(`Leave balance record not found for type: ${leaveType}`);
      }

      if (Number(balance.remaining) < Number(days)) {
        throw new Error(`Insufficient leave balance for type: ${leaveType}. Remaining: ${balance.remaining}, Requested: ${days}`);
      }

      const leaveId = await this.getNextLeaveId();
      const insertQuery = `
        INSERT INTO leave_requests (id, leaveId, employee_id, leaveType, startDate, endDate, days, status, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

      await connection.query(insertQuery, [
        id,
        leaveId,
        employee_id,
        leaveType,
        startDate,
        endDate,
        days,
        status,
        reason
      ]);

      // If approved directly, deduct balance
      if (status === 'Approved') {
        const newUsed = Number(balance.used) + Number(days);
        const newRemaining = Number(balance.remaining) - Number(days);
        await connection.query(
          'UPDATE leave_balances SET used = ?, remaining = ? WHERE employee_id = ? AND leave_type = ?',
          [newUsed, newRemaining, employee_id, leaveType]
        );
      }

      await connection.commit();
      return { id, leaveId, employee_id, leaveType, startDate, endDate, days, status, reason };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async approve(id) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get leave request
      const [requests] = await connection.query('SELECT * FROM leave_requests WHERE id = ?', [id]);
      const leave = requests[0];
      if (!leave) {
        throw new Error('Leave request not found');
      }

      if (leave.status === 'Approved') {
        await connection.commit();
        return true; // Already approved
      }

      // Check balance
      const [balances] = await connection.query(
        'SELECT * FROM leave_balances WHERE employee_id = ? AND leave_type = ?',
        [leave.employee_id, leave.leaveType]
      );
      const balance = balances[0];
      if (!balance) {
        throw new Error(`Leave balance not found for ${leave.leaveType}`);
      }

      if (Number(balance.remaining) < Number(leave.days)) {
        throw new Error(`Insufficient leave balance. Remaining: ${balance.remaining}, Requested: ${leave.days}`);
      }

      // Update status
      await connection.query('UPDATE leave_requests SET status = "Approved" WHERE id = ?', [id]);

      // Deduct balance
      const newUsed = Number(balance.used) + Number(leave.days);
      const newRemaining = Number(balance.remaining) - Number(leave.days);
      await connection.query(
        'UPDATE leave_balances SET used = ?, remaining = ? WHERE employee_id = ? AND leave_type = ?',
        [newUsed, newRemaining, leave.employee_id, leave.leaveType]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async reject(id) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get leave request
      const [requests] = await connection.query('SELECT * FROM leave_requests WHERE id = ?', [id]);
      const leave = requests[0];
      if (!leave) {
        throw new Error('Leave request not found');
      }

      // Update status
      await connection.query('UPDATE leave_requests SET status = "Rejected" WHERE id = ?', [id]);

      // If it was previously approved, return the balance
      if (leave.status === 'Approved') {
        const [balances] = await connection.query(
          'SELECT * FROM leave_balances WHERE employee_id = ? AND leave_type = ?',
          [leave.employee_id, leave.leaveType]
        );
        const balance = balances[0];
        if (balance) {
          const newUsed = Math.max(0, Number(balance.used) - Number(leave.days));
          const newRemaining = Number(balance.remaining) + Number(leave.days);
          await connection.query(
            'UPDATE leave_balances SET used = ?, remaining = ? WHERE employee_id = ? AND leave_type = ?',
            [newUsed, newRemaining, leave.employee_id, leave.leaveType]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};
