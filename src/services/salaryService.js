import { api } from '../utils/api';
import { MONTHS } from '../constants/formOptions';
import {
  calculateSalary,
  countSundaysInMonth,
  getCumulativePresentDays,
  getDaysInMonth,
  getWorkingDays,
} from '../utils/salaryCalculations';

const buildSlipContext = (slipData, employee, salarySlips = [], excludeSlipId = null) => {
  const monthIndex = Number(slipData.salaryMonth ?? 0);
  const year = Number(slipData.salaryYear) || new Date().getFullYear();
  const month = monthIndex + 1;
  const totalDays = slipData.totalDays ?? getDaysInMonth(month, year);
  const sundays = slipData.sundays ?? countSundaysInMonth(month, year);
  const workingDays = slipData.workingDays ?? getWorkingDays(month, year);
  const miscEarnings = (Number(slipData.bonus) || 0) + (Number(slipData.incentive) || 0);
  const cumulativePresentDays = getCumulativePresentDays(
    salarySlips,
    employee.employeeId,
    year,
    slipData.presentDays,
    excludeSlipId
  );

  const calculations = calculateSalary({
    basicPay: employee.basicPay,
    da: employee.da,
    hra: employee.hra,
    fixedAllowance: employee.fixedAllowance ?? employee.otherAllowances,
    medicalAllowance: employee.medicalAllowance,
    fba: employee.fba,
    conveyance: employee.conveyance,
    presentDays: slipData.presentDays,
    workingDays,
    overtime: slipData.overtime,
    miscEarnings,
    pf: slipData.pf,
    esi: slipData.esi,
    loan: slipData.loan,
    professionalTax: slipData.professionalTax,
    incomeTax: slipData.incomeTax,
    otherDeductions: slipData.otherDeductions,
    adjAmount: slipData.adjAmount,
  });

  return {
    monthIndex,
    year,
    totalDays,
    sundays,
    workingDays,
    miscEarnings,
    cumulativePresentDays,
    calculations,
  };
};

export const salaryService = {
  async getSalaryHistory() {
    const res = await api.get('/salaries/history');
    return (res.data || []).map((slip) => ({
      ...slip,
      salaryMonthName: slip.salaryMonthName || MONTHS[slip.salaryMonth],
    }));
  },

  async prefill(employeeId, month, year) {
    const res = await api.get(
      `/salaries/prefill?employeeId=${encodeURIComponent(employeeId)}&month=${month}&year=${year}`
    );
    return res.data;
  },

  async generateSalarySlip(slipData, employee, salarySlips = []) {
    const monthIndex = Number(slipData.salaryMonth ?? 0);
    const { totalDays, sundays, workingDays, miscEarnings, cumulativePresentDays, calculations } =
      buildSlipContext(slipData, employee, salarySlips);

    const payload = {
      employee_id: employee.id,
      salaryMonth: monthIndex,
      salaryYear: Number(slipData.salaryYear),
      presentDays: Number(slipData.presentDays) || 0,
      casualLeave: Number(slipData.casualLeave) || 0,
      earnedLeave: Number(slipData.earnedLeave) || 0,
      sickLeave: Number(slipData.sickLeave) || 0,
      cOffTaken: Number(slipData.cOffTaken) || 0,
      unpaidLeave: Number(slipData.unpaidLeave) || 0,
      balanceCL: Number(slipData.balanceCL) || 0,
      balanceSL: Number(slipData.balanceSL) || 0,
      balanceEL: Number(slipData.balanceEL) || 0,
      balanceCOff: Number(slipData.balanceCOff) || 0,
      overtimeHours: Number(slipData.overtimeHours) || 0,
      overtime: Number(slipData.overtime) || 0,
      bonus: Number(slipData.bonus) || 0,
      incentive: Number(slipData.incentive) || 0,
      pf: Number(slipData.pf) || 0,
      esi: Number(slipData.esi) || 0,
      loan: Number(slipData.loan) || 0,
      professionalTax: Number(slipData.professionalTax) || 0,
      incomeTax: Number(slipData.incomeTax) || 0,
      otherDeductions: Number(slipData.otherDeductions) || 0,
      adjAmount: Number(slipData.adjAmount) || 0,
      workingDays,
      sundays,
      totalDays,
      cumulativePresentDays,
      miscEarnings,
      ...calculations,
    };

    const res = await api.post('/salaries/generate', payload);
    return {
      ...res.data,
      salaryMonthName: MONTHS[monthIndex],
      employeeName: res.data.employeeName || employee.fullName,
      employeeId: res.data.employeeId || employee.employeeId,
      department: res.data.department || employee.department,
      designation: res.data.designation || employee.designation,
      grade: res.data.grade || employee.grade,
    };
  },

  calculatePreview(slipData, employee, salarySlips = []) {
    const { totalDays, sundays, workingDays, cumulativePresentDays, calculations } = buildSlipContext(
      slipData,
      employee,
      salarySlips
    );

    return {
      totalDays,
      sundays,
      workingDays,
      cumulativePresentDays,
      ...calculations,
    };
  },

  async sendSalarySlipEmail({ employeeEmail, employeeName, monthName, year, pdfBase64, companyName }) {
    const res = await api.post('/salaries/send-email', {
      employeeEmail,
      employeeName,
      monthName,
      year,
      pdfBase64,
      companyName,
    });
    return res;
  },
};
