export const generateEmployeeId = (existingEmployees) => {
  let maxNum = 0;
  existingEmployees.forEach((emp) => {
    const match = emp.employeeId?.match(/EMP(\d+)/);
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1], 10));
    }
  });
  const nextNum = maxNum + 1;
  return `EMP${String(nextNum).padStart(4, '0')}`;
};

export const generateSalarySlipId = (existingSlips) => {
  let maxNum = 0;
  existingSlips.forEach((slip) => {
    const match = slip.slipId?.match(/SLP(\d+)/);
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1], 10));
    }
  });
  const nextNum = maxNum + 1;
  return `SLP${String(nextNum).padStart(4, '0')}`;
};

export const generateLeaveId = (existingLeaves) => {
  let maxNum = 0;
  existingLeaves.forEach((leave) => {
    const match = leave.leaveId?.match(/LV(\d+)/);
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1], 10));
    }
  });
  const nextNum = maxNum + 1;
  return `LV${String(nextNum).padStart(4, '0')}`;
};
