import { IoBarChartOutline, IoConstructOutline } from 'react-icons/io5';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';

const PlaceholderReport = ({ title, description }) => (
  <Card>
    <EmptyState
      icon={<IoConstructOutline className="text-primary" size={28} />}
      title={title}
      description={description}
    />
    <div className="flex justify-center pb-8">
      <div className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-lg">
        <IoBarChartOutline className="text-primary" size={18} />
        <span className="text-sm text-primary font-medium">Coming Soon — Backend Integration Required</span>
      </div>
    </div>
  </Card>
);

export const EmployeeReport = () => (
  <PlaceholderReport
    title="Employee Report"
    description="Comprehensive employee analytics and reports will be available once connected to the backend database."
  />
);

export const SalaryReport = () => (
  <PlaceholderReport
    title="Salary Report"
    description="Payroll reports, salary trends, and export features will be available in a future update."
  />
);

export const LeaveReport = () => (
  <PlaceholderReport
    title="Leave Report"
    description="Leave analytics, balance tracking, and department-wise leave reports coming soon."
  />
);
