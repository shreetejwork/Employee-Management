import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import ToastContainer from './components/ui/Toast';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/Login/LoginPage';
import DashboardHome from './pages/Dashboard/DashboardHome';
import EmployeesPage from './pages/Employees/EmployeesPage';
import SalaryPage from './pages/Salary/SalaryPage';
import LeavesPage from './pages/Leaves/LeavesPage';
import ReportsPage from './pages/Reports/ReportsPage';
import { ROUTES } from './constants/routes';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="employees/*" element={<EmployeesPage />} />
            <Route path="salary/*" element={<SalaryPage />} />
            <Route path="leaves/*" element={<LeavesPage />} />
            <Route path="reports/*" element={<ReportsPage />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
