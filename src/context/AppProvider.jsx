import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { EmployeeProvider } from './EmployeeContext';
import { SalaryProvider } from './SalaryContext';
import { LeaveProvider } from './LeaveContext';

export const AppProvider = ({ children }) => (
  <ToastProvider>
    <AuthProvider>
      <EmployeeProvider>
        <SalaryProvider>
          <LeaveProvider>{children}</LeaveProvider>
        </SalaryProvider>
      </EmployeeProvider>
    </AuthProvider>
  </ToastProvider>
);
