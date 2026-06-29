import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EmployeeReport, SalaryReport, LeaveReport } from './ReportPlaceholders';

const tabs = [
  { path: '/reports/employees', label: 'Employee Report' },
  { path: '/reports/salary', label: 'Salary Report' },
  { path: '/reports/leaves', label: 'Leave Report' },
];

const ReportsPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-text">Reports</h1>
      <p className="text-text-secondary text-sm mt-1">Analytics and reporting dashboard</p>
    </div>

    <div className="flex gap-1 border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>

    <Routes>
      <Route path="employees" element={<EmployeeReport />} />
      <Route path="salary" element={<SalaryReport />} />
      <Route path="leaves" element={<LeaveReport />} />
      <Route index element={<EmployeeReport />} />
    </Routes>
  </motion.div>
);

export default ReportsPage;
