import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeaveDashboard from './LeaveDashboard';
import AddLeave from './AddLeave';
import LeaveRequests from './LeaveRequests';
import LeaveHistory from './LeaveHistory';

const tabs = [
  { path: '/leaves', label: 'Dashboard', end: true },
  { path: '/leaves/add', label: 'Add Leave' },
  { path: '/leaves/requests', label: 'Leave Requests' },
  { path: '/leaves/history', label: 'Leave History' },
];

const LeavesPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-text">Leave Management</h1>
      <p className="text-text-secondary text-sm mt-1">Manage employee leave requests and history</p>
    </div>

    <div className="flex gap-1 border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.end}
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
      <Route index element={<LeaveDashboard />} />
      <Route path="add" element={<AddLeave />} />
      <Route path="requests" element={<LeaveRequests />} />
      <Route path="history" element={<LeaveHistory />} />
    </Routes>
  </motion.div>
);

export default LeavesPage;
