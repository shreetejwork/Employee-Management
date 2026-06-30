import { useState, useMemo, useEffect } from 'react';
import { useLeaveContext } from '../../context/LeaveContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { LEAVE_TYPES } from '../../constants/formOptions';
import { formatDate } from '../../utils/formatters';
import Table from '../../components/ui/Table';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';

const statusVariant = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

const RecentLeaves = () => {
  const { leaves, filterLeaves, getLeaves } = useLeaveContext();
  const [search, setSearch] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    getLeaves();
  }, [getLeaves]);

  const filtered = useMemo(
    () => filterLeaves({ search: debouncedSearch, leaveType }),
    [filterLeaves, debouncedSearch, leaveType]
  );

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [filtered]
  );

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(sorted, 10);

  const columns = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'employeeId', label: 'ID' },
    { key: 'leaveType', label: 'Leave Type' },
    {
      key: 'period',
      label: 'Period',
      render: (row) => `${formatDate(row.startDate)} - ${formatDate(row.endDate)}`,
    },
    { key: 'days', label: 'Days' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 px-5 pt-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search leaves..." className="flex-1" />
        <Select
          options={LEAVE_TYPES}
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          placeholder="All Types"
          containerClassName="w-full sm:w-40"
        />
      </div>

      {leaves.length === 0 ? (
        <EmptyState title="No Leaves Yet" description="Added leaves will appear here." />
      ) : (
        <>
          <Table columns={columns} data={paginatedItems} emptyMessage="No leaves match your filters" />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
};

export default RecentLeaves;
