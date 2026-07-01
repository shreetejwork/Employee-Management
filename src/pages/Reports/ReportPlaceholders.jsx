import { useEffect, useMemo, useState } from 'react';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useSalaryContext } from '../../context/SalaryContext';
import { useLeaveContext } from '../../context/LeaveContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const ReportShell = ({ title, description, loading, error, onRetry, children }) => (
  <Card title={title} subtitle={description}>
    {loading && <TableSkeleton rows={5} />}
    {error && (
      <div className="rounded-lg border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger mb-4">
        {error}
        {onRetry && (
          <button type="button" onClick={onRetry} className="ml-3 underline cursor-pointer">
            Retry
          </button>
        )}
      </div>
    )}
    {!loading && !error && children}
  </Card>
);

export const EmployeeReport = () => {
  const { employees, loading, error, fetchEmployees } = useEmployeeContext();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchEmployees()
      .catch(() => {})
      .finally(() => setReady(true));
  }, [fetchEmployees]);

  const departmentStats = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      map[emp.department] = (map[emp.department] || 0) + 1;
    });
    return Object.entries(map).map(([department, count]) => ({ department, count }));
  }, [employees]);

  const columns = [
    { key: 'department', label: 'Department' },
    { key: 'count', label: 'Employees' },
  ];

  return (
    <ReportShell
      title="Employee Report"
      description="Department-wise employee count from database"
      loading={loading && !ready}
      error={error}
      onRetry={fetchEmployees}
    >
      {employees.length === 0 ? (
        <EmptyState title="No Employee Data" description="No employees found in the database." />
      ) : (
        <Table columns={columns} data={departmentStats} />
      )}
    </ReportShell>
  );
};

export const SalaryReport = () => {
  const { salarySlips, loading, error, fetchSalarySlips } = useSalaryContext();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchSalarySlips()
      .catch(() => {})
      .finally(() => setReady(true));
  }, [fetchSalarySlips]);

  const columns = [
    { key: 'slipId', label: 'Slip ID' },
    { key: 'employeeName', label: 'Employee' },
    {
      key: 'period',
      label: 'Period',
      render: (row) => `${row.salaryMonthName} ${row.salaryYear}`,
    },
    {
      key: 'netSalary',
      label: 'Net Salary',
      render: (row) => formatCurrency(row.netSalary),
    },
    {
      key: 'generatedAt',
      label: 'Generated',
      render: (row) => formatDate(row.generatedAt),
    },
  ];

  return (
    <ReportShell
      title="Salary Report"
      description="Salary slip records fetched from database"
      loading={loading && !ready}
      error={error}
      onRetry={fetchSalarySlips}
    >
      {salarySlips.length === 0 ? (
        <EmptyState title="No Salary Data" description="No salary slips found in the database." />
      ) : (
        <Table columns={columns} data={salarySlips} />
      )}
    </ReportShell>
  );
};

export const LeaveReport = () => {
  const { leaves, loading, error, getLeaves } = useLeaveContext();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getLeaves()
      .catch(() => {})
      .finally(() => setReady(true));
  }, [getLeaves]);

  const typeStats = useMemo(() => {
    const map = {};
    leaves.forEach((leave) => {
      map[leave.leaveType] = (map[leave.leaveType] || 0) + 1;
    });
    return Object.entries(map).map(([leaveType, count]) => ({ leaveType, count }));
  }, [leaves]);

  const columns = [
    { key: 'leaveType', label: 'Leave Type' },
    { key: 'count', label: 'Records' },
  ];

  return (
    <ReportShell
      title="Leave Report"
      description="Leave records summary from database"
      loading={loading && !ready}
      error={error}
      onRetry={getLeaves}
    >
      {leaves.length === 0 ? (
        <EmptyState title="No Leave Data" description="No leave records found in the database." />
      ) : (
        <Table columns={columns} data={typeStats} />
      )}
    </ReportShell>
  );
};
