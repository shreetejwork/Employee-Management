import pool from '../config/db.js';

export const EmployeeModel = {
  async getAll({ search, department, status, grade }) {
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (search) {
      query += ` AND (fullName LIKE ? OR employeeId LIKE ? OR email LIKE ? OR department LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    // Default sorting
    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    
    // Parse numeric fields for compatibility with frontend expect
    return rows.map(emp => this.parseFields(emp));
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    if (!rows[0]) return null;
    return this.parseFields(rows[0]);
  },

  async getByEmployeeIdString(employeeId) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE employeeId = ?', [employeeId]);
    if (!rows[0]) return null;
    return this.parseFields(rows[0]);
  },

  async getNextEmployeeId() {
    const [rows] = await pool.query('SELECT employeeId FROM employees');
    let maxNum = 0;
    rows.forEach((emp) => {
      const match = emp.employeeId?.match(/EMP(\d+)/);
      if (match) {
        maxNum = Math.max(maxNum, parseInt(match[1], 10));
      }
    });
    const nextNum = maxNum + 1;
    return `EMP${String(nextNum).padStart(4, '0')}`;
  },

  async create(employeeData) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const employeeId = employeeData.employeeId || await this.getNextEmployeeId();
      
      const insertQuery = `
        INSERT INTO employees (
          id, employeeId, fullName, fatherName, motherName, gender, dateOfBirth, bloodGroup,
          mobile, email, currentAddress, permanentAddress, city, state, country, pinCode,
          department, designation, grade, joiningDate, employmentType, status,
          basicPay, da, hra, fixedAllowance, medicalAllowance, conveyance, fba, otherAllowances,
          panNumber, aadharNumber, bankName, accountNumber, ifscCode,
          emergencyContactName, emergencyContactNumber, photo, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        employeeData.id,
        employeeId,
        employeeData.fullName,
        employeeData.fatherName,
        employeeData.motherName,
        employeeData.gender,
        employeeData.dateOfBirth,
        employeeData.bloodGroup,
        employeeData.mobile,
        employeeData.email,
        employeeData.currentAddress,
        employeeData.permanentAddress,
        employeeData.city,
        employeeData.state,
        employeeData.country,
        employeeData.pinCode,
        employeeData.department,
        employeeData.designation,
        employeeData.grade,
        employeeData.joiningDate,
        employeeData.employmentType,
        employeeData.status || 'Active',
        Number(employeeData.basicPay) || 0.00,
        Number(employeeData.da) || 0.00,
        Number(employeeData.hra) || 0.00,
        Number(employeeData.fixedAllowance || employeeData.otherAllowances) || 0.00,
        Number(employeeData.medicalAllowance) || 0.00,
        Number(employeeData.conveyance) || 0.00,
        Number(employeeData.fba) || 0.00,
        Number(employeeData.otherAllowances) || 0.00,
        employeeData.panNumber,
        employeeData.aadharNumber,
        employeeData.bankName,
        employeeData.accountNumber,
        employeeData.ifscCode,
        employeeData.emergencyContactName,
        employeeData.emergencyContactNumber,
        employeeData.photo || null,
        employeeData.remarks || null
      ];

      await connection.query(insertQuery, values);

      // Seed Default Leave Balances (Total 25 days across standard leave types)
      const leaveBalances = [
        { leave_type: 'Casual', allowed: 10.00, remaining: 10.00 },
        { leave_type: 'Paid', allowed: 10.00, remaining: 10.00 },
        { leave_type: 'Sick', allowed: 5.00, remaining: 5.00 },
        { leave_type: 'Emergency', allowed: 0.00, remaining: 0.00 },
        { leave_type: 'Unpaid', allowed: 999.00, remaining: 999.00 } // Unpaid has unlimited pool
      ];

      for (const bal of leaveBalances) {
        await connection.query(
          'INSERT INTO leave_balances (employee_id, leave_type, allowed, used, remaining) VALUES (?, ?, ?, ?, ?)',
          [employeeData.id, bal.leave_type, bal.allowed, 0.00, bal.remaining]
        );
      }

      await connection.commit();
      return { ...employeeData, employeeId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async update(id, employeeData) {
    const updateQuery = `
      UPDATE employees SET
        fullName = ?, fatherName = ?, motherName = ?, gender = ?, dateOfBirth = ?, bloodGroup = ?,
        mobile = ?, email = ?, currentAddress = ?, permanentAddress = ?, city = ?, state = ?, country = ?, pinCode = ?,
        department = ?, designation = ?, grade = ?, joiningDate = ?, employmentType = ?, status = ?,
        basicPay = ?, da = ?, hra = ?, fixedAllowance = ?, medicalAllowance = ?, conveyance = ?, fba = ?, otherAllowances = ?,
        panNumber = ?, aadharNumber = ?, bankName = ?, accountNumber = ?, ifscCode = ?,
        emergencyContactName = ?, emergencyContactNumber = ?, photo = ?, remarks = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const values = [
      employeeData.fullName,
      employeeData.fatherName,
      employeeData.motherName,
      employeeData.gender,
      employeeData.dateOfBirth,
      employeeData.bloodGroup,
      employeeData.mobile,
      employeeData.email,
      employeeData.currentAddress,
      employeeData.permanentAddress,
      employeeData.city,
      employeeData.state,
      employeeData.country,
      employeeData.pinCode,
      employeeData.department,
      employeeData.designation,
      employeeData.grade,
      employeeData.joiningDate,
      employeeData.employmentType,
      employeeData.status,
      Number(employeeData.basicPay) || 0.00,
      Number(employeeData.da) || 0.00,
      Number(employeeData.hra) || 0.00,
      Number(employeeData.fixedAllowance || employeeData.otherAllowances) || 0.00,
      Number(employeeData.medicalAllowance) || 0.00,
      Number(employeeData.conveyance) || 0.00,
      Number(employeeData.fba) || 0.00,
      Number(employeeData.otherAllowances) || 0.00,
      employeeData.panNumber,
      employeeData.aadharNumber,
      employeeData.bankName,
      employeeData.accountNumber,
      employeeData.ifscCode,
      employeeData.emergencyContactName,
      employeeData.emergencyContactNumber,
      employeeData.photo || null,
      employeeData.remarks || null,
      id
    ];

    const [result] = await pool.query(updateQuery, values);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  parseFields(emp) {
    return {
      ...emp,
      createdAt: emp.created_at,
      updatedAt: emp.updated_at,
      basicPay: Number(emp.basicPay),
      da: Number(emp.da),
      hra: Number(emp.hra),
      fixedAllowance: Number(emp.fixedAllowance),
      medicalAllowance: Number(emp.medicalAllowance),
      conveyance: Number(emp.conveyance),
      fba: Number(emp.fba),
      otherAllowances: Number(emp.otherAllowances),
    };
  }
};
