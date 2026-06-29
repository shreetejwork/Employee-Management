import { delay } from '../utils/formatters';
import { generateSalarySlipId } from '../utils/idGenerator';
import {
  calculateSalary,
  countSundaysInMonth,
  getCumulativePresentDays,
  getDaysInMonth,
  getWorkingDays,
} from '../utils/salaryCalculations';

const buildSlipContext = (slipData, employee, salarySlips = [], excludeSlipId = null) => {
  const monthIndex = slipData.salaryMonth ?? 0;
  const year = Number(slipData.salaryYear) || new Date().getFullYear();
  const month = monthIndex + 1;
  const totalDays = getDaysInMonth(month, year);
  const sundays = countSundaysInMonth(month, year);
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
  async getSalaryHistory(salarySlips) {
    await delay(300);
    return [...salarySlips].sort(
      (a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)
    );
  },

  async generateSalarySlip(salarySlips, slipData, employee) {
    await delay(500);
    const { totalDays, sundays, workingDays, cumulativePresentDays, calculations } = buildSlipContext(
      slipData,
      employee,
      salarySlips
    );

    const newSlip = {
      id: crypto.randomUUID(),
      slipId: generateSalarySlipId(salarySlips),
      employeeId: employee.employeeId,
      employeeName: employee.fullName,
      department: employee.department,
      designation: employee.designation,
      grade: employee.grade,
      ...slipData,
      totalDays,
      sundays,
      workingDays,
      cumulativePresentDays,
      ...calculations,
      generatedAt: new Date().toISOString(),
    };

    return newSlip;
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
};
