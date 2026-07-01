import { useMemo, useState, useEffect } from 'react';
import { useLeaveContext } from '../../context/LeaveContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { formatDate } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchInput from '../../components/ui/SearchInput';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const statusVariant = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

const LeaveHistory = () => {
  const { leaves, loading, error, filterLeaves, getLeaves } = useLeaveContext();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    getLeaves().catch(() => {});
  }, [getLeaves]);

  const filtered = useMemo(
    () => filterLeaves({ search: debouncedSearch }),
    [filterLeaves, debouncedSearch]
  );

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [filtered]
  );

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(sorted, 10);

  const columns = [
    { key: 'leaveId', label: 'Leave ID' },
    { key: 'employeeName', label: 'Employee' },
    { key: 'leaveType', label: 'Type' },
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
    {
      key: 'createdAt',
      label: 'Applied On',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <SearchInput value={search} onChange={setSearch} placeholder="Search leave history..." className="max-w-md" />

      <Card noPadding>
        {loading && leaves.length === 0 ? (
          <div className="p-6"><TableSkeleton rows={6} cols={6} /></div>
        ) : leaves.length === 0 ? (
          <EmptyState title="No Leave History" description="Leave records will appear here once created." />
        ) : (
          <>
            <Table columns={columns} data={paginatedItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </Card>
    </div>
  );
};

export default LeaveHistory;
