import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import EmployeeProfile from './EmployeeProfile';
import EditEmployee from './EditEmployee';
import { ROUTES } from '../../constants/routes';

const EmployeesPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Routes>
        <Route index element={
          <>
            <div>
              <h1 className="text-2xl font-bold text-text">Employees</h1>
              <p className="text-text-secondary text-sm mt-1">Manage employee records and registrations</p>
            </div>
            <EmployeeList />
          </>
        } />
        <Route path="add" element={
          <>
            <div>
              <h1 className="text-2xl font-bold text-text">Add Employee</h1>
              <p className="text-text-secondary text-sm mt-1">Register a new employee</p>
            </div>
            <EmployeeForm onCancel={() => navigate(ROUTES.EMPLOYEES)} />
          </>
        } />
        <Route path="edit/:id" element={<EditEmployee />} />
        <Route path="view/:id" element={<EmployeeProfile />} />
      </Routes>
    </motion.div>
  );
};

export default EmployeesPage;
