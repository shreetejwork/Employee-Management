import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import GenerateSalarySlip from './GenerateSalarySlip';
import SalaryHistory from './SalaryHistory';

const tabs = [
  { path: '/salary/generate', label: 'Generate Salary Slip', end: false },
  { path: '/salary/history', label: 'Salary History', end: false },
];

const SalaryPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-text">Salary Slips</h1>
      <p className="text-text-secondary text-sm mt-1">Generate and manage employee salary slips</p>
    </div>

    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
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
      <Route path="generate" element={<GenerateSalarySlip />} />
      <Route path="history" element={<SalaryHistory />} />
      <Route index element={<GenerateSalarySlip />} />
    </Routes>
  </motion.div>
);

export default SalaryPage;
