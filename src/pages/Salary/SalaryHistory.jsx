import { useState, useMemo, useEffect } from 'react';
import { useSalaryContext } from '../../context/SalaryContext';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useToastContext } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import SalarySlipPreview from './SalarySlipPreview';
import SalarySlipActions from '../../components/salary/SalarySlipActions';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { IoEyeOutline } from 'react-icons/io5';

const SalaryHistory = () => {
  const { salarySlips, loading, error, fetchSalarySlips } = useSalaryContext();
  const { employees, fetchEmployees } = useEmployeeContext();
  const { addToast } = useToastContext();
  const [search, setSearch] = useState('');
  const [viewSlip, setViewSlip] = useState(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchSalarySlips().catch(() => {
      addToast('Failed to load salary history from database', 'error');
    });
    fetchEmployees().catch(() => {
      addToast('Failed to load employee records', 'error');
    });
  }, [fetchSalarySlips, fetchEmployees, addToast]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return salarySlips;
    const q = debouncedSearch.toLowerCase();
    return salarySlips.filter(
      (s) =>
        s.employeeName?.toLowerCase().includes(q) ||
        s.employeeId?.toLowerCase().includes(q) ||
        s.slipId?.toLowerCase().includes(q)
    );
  }, [salarySlips, debouncedSearch]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)),
    [filtered]
  );

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(sorted, 10);

  const viewEmployee = viewSlip
    ? employees.find((e) => e.employeeId === viewSlip.employeeId)
    : null;

  const columns = [
    { key: 'slipId', label: 'Slip ID' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'employeeName', label: 'Employee' },
    { key: 'department', label: 'Department' },
    {
      key: 'period',
      label: 'Period',
      render: (row) => `${row.salaryMonthName} ${row.salaryYear}`,
    },
    {
      key: 'grossEarnings',
      label: 'Gross',
      render: (row) => formatCurrency(row.grossEarnings),
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
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => setViewSlip(row)}
          className="p-1.5 rounded-lg hover:bg-primary-light text-primary cursor-pointer"
          title="View"
        >
          <IoEyeOutline size={18} />
        </button>
      ),
    },
  ];

  if (loading && salarySlips.length === 0) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by employee, slip ID..."
        className="max-w-md"
      />

      <Card noPadding>
        {salarySlips.length === 0 ? (
          <EmptyState title="No Salary Slips" description="Generated salary slips will appear here." />
        ) : (
          <>
            <Table columns={columns} data={paginatedItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </Card>

      <Modal isOpen={!!viewSlip} onClose={() => setViewSlip(null)} title="Salary Slip" size="lg">
        {viewSlip && viewEmployee && (
          <div className="salary-slip-print-root">
            <SalarySlipPreview slip={viewSlip} employee={viewEmployee} />
            <SalarySlipActions
              employee={viewEmployee}
              slip={viewSlip}
              onClose={() => setViewSlip(null)}
            />
          </div>
        )}
        {viewSlip && !viewEmployee && (
          <p className="text-sm text-danger">Employee record not found in database.</p>
        )}
      </Modal>
    </div>
  );
};

export default SalaryHistory;
