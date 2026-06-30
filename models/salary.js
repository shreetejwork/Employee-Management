import pool from '../config/db.js';

export const SalaryModel = {
  async getHistory() {
    const query = `
      SELECT ss.*, emp.fullName as employeeName, emp.department, emp.employeeId, emp.designation, emp.grade
      FROM salary_slips ss
      JOIN employees emp ON ss.employee_id = emp.id
      ORDER BY ss.generatedAt DESC
    `;
    const [rows] = await pool.query(query);
    return rows.map(r => this.parseFields(r));
  },

  async getNextSlipId() {
    const [rows] = await pool.query('SELECT slipId FROM salary_slips');
    let maxNum = 0;
    rows.forEach((slip) => {
      const match = slip.slipId?.match(/SLP(\d+)/);
      if (match) {
        maxNum = Math.max(maxNum, parseInt(match[1], 10));
      }
    });
    const nextNum = maxNum + 1;
    return `SLP${String(nextNum).padStart(4, '0')}`;
  },

  async prefillData({ employeeId, month, year }) {
    // month is 0-indexed (0 = Jan, 11 = Dec)
    const monthIndex = parseInt(month, 10);
    const yr = parseInt(year, 10);

    // Get number of days in the month
    const totalDays = new Date(yr, monthIndex + 1, 0).getDate();
    
    // Count Sundays
    let sundays = 0;
    for (let d = 1; d <= totalDays; d++) {
      if (new Date(yr, monthIndex, d).getDay() === 0) {
        sundays++;
      }
    }

    const workingDays = totalDays - sundays;

    // Fetch approved leaves overlapping with this month
    const query = `
      SELECT startDate, endDate, leaveType, days
      FROM leave_requests
      WHERE employee_id = ? AND status = 'Approved'
        AND startDate <= ? AND endDate >= ?
    `;
    const monthStartStr = `${yr}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    const monthEndStr = `${yr}-${String(monthIndex + 1).padStart(2, '0')}-${String(totalDays).padStart(2, '0')}`;
    
    const [leaves] = await pool.query(query, [employeeId, monthEndStr, monthStartStr]);

    let casualLeave = 0;
    let earnedLeave = 0;
    let sickLeave = 0;
    let unpaidLeave = 0;
    let cOffTaken = 0;

    const monthStart = new Date(yr, monthIndex, 1);
    const monthEnd = new Date(yr, monthIndex + 1, 0);

    leaves.forEach(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);

      // Find overlap dates
      const overlapStart = new Date(Math.max(start.getTime(), monthStart.getTime()));
      const overlapEnd = new Date(Math.min(end.getTime(), monthEnd.getTime()));

      if (overlapStart.getTime() <= overlapEnd.getTime()) {
        const overlapDays = Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (leave.leaveType === 'Casual') {
          casualLeave += overlapDays;
        } else if (leave.leaveType === 'Paid') {
          earnedLeave += overlapDays;
        } else if (leave.leaveType === 'Sick') {
          sickLeave += overlapDays;
        } else if (leave.leaveType === 'Unpaid') {
          unpaidLeave += overlapDays;
        } else if (leave.leaveType === 'Emergency') {
          // Count Emergency leaves towards casual or sick as fallback, or separately. Let's add to casual/paid
          casualLeave += overlapDays;
        }
      }
    });

    // Fetch employee leave balances to pre-fill available balances in form
    const [balances] = await pool.query(
      'SELECT leave_type, remaining FROM leave_balances WHERE employee_id = ?',
      [employeeId]
    );

    let balanceCL = 0;
    let balanceSL = 0;
    let balanceEL = 0;
    let balanceCOff = 0;

    balances.forEach(b => {
      if (b.leave_type === 'Casual') balanceCL = Number(b.remaining);
      if (b.leave_type === 'Sick') balanceSL = Number(b.remaining);
      if (b.leave_type === 'Paid') balanceEL = Number(b.remaining);
    });

    // presentDays = workingDays - unpaidLeave.
    // Unpaid leave directly deducts from presentDays.
    const presentDays = Math.max(0, workingDays - unpaidLeave);

    return {
      workingDays,
      sundays,
      totalDays,
      presentDays,
      casualLeave,
      earnedLeave,
      sickLeave,
      unpaidLeave,
      cOffTaken,
      balanceCL,
      balanceSL,
      balanceEL,
      balanceCOff
    };
  },

  async create(slipData) {
    const slipId = await this.getNextSlipId();
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

    const insertQuery = `
      INSERT INTO salary_slips (
        id, slipId, employee_id, salaryMonth, salaryYear, presentDays,
        casualLeave, earnedLeave, sickLeave, cOffTaken, unpaidLeave,
        balanceCL, balanceSL, balanceEL, balanceCOff,
        overtimeHours, overtime, bonus, incentive, pf, esi, loan,
        professionalTax, incomeTax, otherDeductions, adjAmount,
        workingDays, sundays, totalDays, cumulativePresentDays,
        basicPlusDA, adjustedHra, fixedAllowance, medicalAllowance, fba,
        miscEarnings, conveyance, grossEarnings, totalDeductions, netSalary, finalPay, leaveDeduction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id,
      slipId,
      slipData.employee_id,
      parseInt(slipData.salaryMonth, 10),
      parseInt(slipData.salaryYear, 10),
      Number(slipData.presentDays) || 0.00,
      Number(slipData.casualLeave) || 0.00,
      Number(slipData.earnedLeave) || 0.00,
      Number(slipData.sickLeave) || 0.00,
      Number(slipData.cOffTaken) || 0.00,
      Number(slipData.unpaidLeave) || 0.00,
      Number(slipData.balanceCL) || 0.00,
      Number(slipData.balanceSL) || 0.00,
      Number(slipData.balanceEL) || 0.00,
      Number(slipData.balanceCOff) || 0.00,
      Number(slipData.overtimeHours) || 0.00,
      Number(slipData.overtime) || 0.00,
      Number(slipData.bonus) || 0.00,
      Number(slipData.incentive) || 0.00,
      Number(slipData.pf) || 0.00,
      Number(slipData.esi) || 0.00,
      Number(slipData.loan) || 0.00,
      Number(slipData.professionalTax) || 0.00,
      Number(slipData.incomeTax) || 0.00,
      Number(slipData.otherDeductions) || 0.00,
      Number(slipData.adjAmount) || 0.00,
      
      parseInt(slipData.workingDays, 10),
      parseInt(slipData.sundays, 10),
      parseInt(slipData.totalDays, 10),
      Number(slipData.cumulativePresentDays) || 0.00,
      
      Number(slipData.basicPlusDA) || 0.00,
      Number(slipData.adjustedHra) || 0.00,
      Number(slipData.fixedAllowance) || 0.00,
      Number(slipData.medicalAllowance) || 0.00,
      Number(slipData.fba) || 0.00,
      Number(slipData.miscEarnings) || 0.00,
      Number(slipData.conveyance) || 0.00,
      Number(slipData.grossEarnings) || 0.00,
      Number(slipData.totalDeductions) || 0.00,
      Number(slipData.netSalary) || 0.00,
      Number(slipData.finalPay) || 0.00,
      Number(slipData.leaveDeduction) || 0.00
    ];

    await pool.query(insertQuery, values);
    return { ...slipData, id, slipId };
  },

  parseFields(ss) {
    return {
      ...ss,
      presentDays: Number(ss.presentDays),
      casualLeave: Number(ss.casualLeave),
      earnedLeave: Number(ss.earnedLeave),
      sickLeave: Number(ss.sickLeave),
      cOffTaken: Number(ss.cOffTaken),
      unpaidLeave: Number(ss.unpaidLeave),
      balanceCL: Number(ss.balanceCL),
      balanceSL: Number(ss.balanceSL),
      balanceEL: Number(ss.balanceEL),
      balanceCOff: Number(ss.balanceCOff),
      overtimeHours: Number(ss.overtimeHours),
      overtime: Number(ss.overtime),
      bonus: Number(ss.bonus),
      incentive: Number(ss.incentive),
      pf: Number(ss.pf),
      esi: Number(ss.esi),
      loan: Number(ss.loan),
      professionalTax: Number(ss.professionalTax),
      incomeTax: Number(ss.incomeTax),
      otherDeductions: Number(ss.otherDeductions),
      adjAmount: Number(ss.adjAmount),
      cumulativePresentDays: Number(ss.cumulativePresentDays),
      basicPlusDA: Number(ss.basicPlusDA),
      adjustedHra: Number(ss.adjustedHra),
      fixedAllowance: Number(ss.fixedAllowance),
      medicalAllowance: Number(ss.medicalAllowance),
      fba: Number(ss.fba),
      miscEarnings: Number(ss.miscEarnings),
      conveyance: Number(ss.conveyance),
      grossEarnings: Number(ss.grossEarnings),
      totalDeductions: Number(ss.totalDeductions),
      netSalary: Number(ss.netSalary),
      finalPay: Number(ss.finalPay),
      leaveDeduction: Number(ss.leaveDeduction),
      generatedAt: ss.generatedAt
    };
  }
};
