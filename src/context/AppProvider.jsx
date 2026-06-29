import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { CompanyProvider } from './CompanyContext';
import { EmployeeProvider } from './EmployeeContext';
import { SalaryProvider } from './SalaryContext';
import { LeaveProvider } from './LeaveContext';

export const AppProvider = ({ children }) => (
  <ToastProvider>
    <AuthProvider>
      <CompanyProvider>
        <EmployeeProvider>
          <SalaryProvider>
            <LeaveProvider>{children}</LeaveProvider>
          </SalaryProvider>
        </EmployeeProvider>
      </CompanyProvider>
    </AuthProvider>
  </ToastProvider>
);
