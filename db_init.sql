-- CREATE DATABASE IF NOT EXISTS employee_management;
-- USE employee_management;

-- 1. Users Table (Admin Login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  name VARCHAR(100) DEFAULT 'Administrator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(20) NOT NULL UNIQUE,
  fullName VARCHAR(100) NOT NULL,
  fatherName VARCHAR(100) NOT NULL,
  motherName VARCHAR(100) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  dateOfBirth DATE NOT NULL,
  bloodGroup VARCHAR(10),
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  currentAddress TEXT NOT NULL,
  permanentAddress TEXT NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  pinCode VARCHAR(10) NOT NULL,
  department VARCHAR(50) NOT NULL,
  designation VARCHAR(50) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  joiningDate DATE NOT NULL,
  employmentType VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  basicPay DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  da DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  hra DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  fixedAllowance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  medicalAllowance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  conveyance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  fba DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  otherAllowances DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  panNumber VARCHAR(20) NOT NULL,
  aadharNumber VARCHAR(20) NOT NULL,
  bankName VARCHAR(100) NOT NULL,
  accountNumber VARCHAR(50) NOT NULL,
  ifscCode VARCHAR(20) NOT NULL,
  emergencyContactName VARCHAR(100) NOT NULL,
  emergencyContactNumber VARCHAR(20) NOT NULL,
  photo LONGTEXT,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_emp_id (employeeId),
  INDEX idx_emp_status (status),
  INDEX idx_emp_dept (department)
);

-- 3. Leave Balances Table
CREATE TABLE IF NOT EXISTS leave_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(36) NOT NULL,
  leave_type VARCHAR(50) NOT NULL,
  allowed DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  used DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  remaining DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY uq_emp_type (employee_id, leave_type)
);

-- 4. Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
  id VARCHAR(36) PRIMARY KEY,
  leaveId VARCHAR(20) NOT NULL UNIQUE,
  employee_id VARCHAR(36) NOT NULL,
  leaveType VARCHAR(50) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  days DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_leave_status (status)
);

-- 5. Salary Slips Table
CREATE TABLE IF NOT EXISTS salary_slips (
  id VARCHAR(36) PRIMARY KEY,
  slipId VARCHAR(20) NOT NULL UNIQUE,
  employee_id VARCHAR(36) NOT NULL,
  salaryMonth INT NOT NULL,
  salaryYear INT NOT NULL,
  presentDays DECIMAL(5,2) NOT NULL,
  casualLeave DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  earnedLeave DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  sickLeave DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  cOffTaken DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  unpaidLeave DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  balanceCL DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  balanceSL DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  balanceEL DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  balanceCOff DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  overtimeHours DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  overtime DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  bonus DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  incentive DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  pf DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  weight DECIMAL(12,2) NOT NULL DEFAULT 0.00, -- Optional back compat, unused
  esi DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  loan DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  professionalTax DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  incomeTax DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  otherDeductions DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  adjAmount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  
  -- Calculated Fields
  workingDays INT NOT NULL,
  sundays INT NOT NULL,
  totalDays INT NOT NULL,
  cumulativePresentDays DECIMAL(5,2) NOT NULL,
  basicPlusDA DECIMAL(12,2) NOT NULL,
  adjustedHra DECIMAL(12,2) NOT NULL,
  fixedAllowance DECIMAL(12,2) NOT NULL,
  medicalAllowance DECIMAL(12,2) NOT NULL,
  fba DECIMAL(12,2) NOT NULL,
  miscEarnings DECIMAL(12,2) NOT NULL,
  conveyance DECIMAL(12,2) NOT NULL,
  grossEarnings DECIMAL(12,2) NOT NULL,
  totalDeductions DECIMAL(12,2) NOT NULL,
  netSalary DECIMAL(12,2) NOT NULL,
  finalPay DECIMAL(12,2) NOT NULL,
  leaveDeduction DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  
  generatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY uq_emp_month_year (employee_id, salaryMonth, salaryYear)
);

-- 6. Company Information Table
CREATE TABLE IF NOT EXISTS company_information (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  shortName VARCHAR(100) NOT NULL,
  tagline VARCHAR(255),
  website VARCHAR(255),
  email VARCHAR(255),
  phones VARCHAR(255),
  registeredOffice TEXT,
  manufacturingUnit TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
