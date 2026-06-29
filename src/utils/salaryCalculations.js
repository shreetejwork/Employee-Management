export const countSundaysInMonth = (month, year) => {
  const totalDays = getDaysInMonth(month, year);
  let sundays = 0;
  for (let day = 1; day <= totalDays; day += 1) {
    if (new Date(year, month - 1, day).getDay() === 0) sundays += 1;
  }
  return sundays;
};

export const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const getWorkingDays = (month, year) => {
  const totalDays = getDaysInMonth(month, year);
  const sundays = countSundaysInMonth(month, year);
  return totalDays - sundays;
};

export const getCumulativePresentDays = (salarySlips, employeeId, year, currentPresentDays, excludeSlipId = null) => {
  const previousTotal = (salarySlips || [])
    .filter(
      (slip) =>
        slip.employeeId === employeeId &&
        Number(slip.salaryYear) === Number(year) &&
        slip.id !== excludeSlipId
    )
    .reduce((sum, slip) => sum + (Number(slip.presentDays) || 0), 0);

  return previousTotal + (Number(currentPresentDays) || 0);
};

export const calculateSalary = (data) => {
  const basicPay = Number(data.basicPay) || 0;
  const da = Number(data.da) || 0;
  const hra = Number(data.hra) || 0;
  const fixedAllowance = Number(data.fixedAllowance) || 0;
  const medicalAllowance = Number(data.medicalAllowance) || 0;
  const fba = Number(data.fba) || 0;
  const conveyance = Number(data.conveyance) || 0;
  const miscEarnings = Number(data.miscEarnings) || 0;
  const overtime = Number(data.overtime) || 0;

  const presentDays = Number(data.presentDays) || 0;
  const workingDays = Number(data.workingDays) || 0;
  const attendanceRatio = workingDays > 0 ? presentDays / workingDays : 1;

  const basicPlusDA = (basicPay + da) * attendanceRatio;
  const adjustedHra = hra * attendanceRatio;
  const adjustedFixedAllowance = fixedAllowance * attendanceRatio;
  const adjustedMedical = medicalAllowance * attendanceRatio;
  const adjustedFba = fba * attendanceRatio;
  const adjustedConveyance = conveyance * attendanceRatio;

  const grossEarnings =
    basicPlusDA +
    adjustedHra +
    adjustedFixedAllowance +
    adjustedMedical +
    adjustedFba +
    miscEarnings +
    adjustedConveyance +
    overtime;

  const pf = Number(data.pf) || 0;
  const esi = Number(data.esi) || 0;
  const loan = Number(data.loan) || 0;
  const professionalTax = Number(data.professionalTax) || 0;
  const incomeTax = Number(data.incomeTax) || 0;
  const otherDeductions = Number(data.otherDeductions) || 0;

  const totalDeductions = pf + esi + loan + professionalTax + incomeTax + otherDeductions;
  const netSalary = grossEarnings - totalDeductions;
  const adjAmount = Number(data.adjAmount) || 0;
  const finalPay = netSalary + adjAmount;

  return {
    basicPlusDA: Math.round(basicPlusDA),
    adjustedHra: Math.round(adjustedHra),
    fixedAllowance: Math.round(adjustedFixedAllowance),
    medicalAllowance: Math.round(adjustedMedical),
    fba: Math.round(adjustedFba),
    miscEarnings: Math.round(miscEarnings),
    conveyance: Math.round(adjustedConveyance),
    overtime: Math.round(overtime),
    grossEarnings: Math.round(grossEarnings),
    pf: Math.round(pf),
    esi: Math.round(esi),
    loan: Math.round(loan),
    professionalTax: Math.round(professionalTax),
    incomeTax: Math.round(incomeTax),
    otherDeductions: Math.round(otherDeductions),
    totalDeductions: Math.round(totalDeductions),
    netSalary: Math.round(netSalary),
    adjAmount: Math.round(adjAmount),
    finalPay: Math.round(finalPay),
  };
};
