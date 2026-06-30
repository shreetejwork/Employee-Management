import { useState, useMemo, useEffect } from 'react';
import { useLeaveContext } from '../../context/LeaveContext';
import { useToastContext } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { LEAVE_STATUS, LEAVE_TYPES } from '../../constants/formOptions';
import { formatDate } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { IoCheckmark, IoClose, IoEyeOutline } from 'react-icons/io5';

const statusVariant = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

const LeaveRequests = () => {
  const { leaves, filterLeaves, approveLeave, rejectLeave, getLeaves } = useLeaveContext();
  const { addToast } = useToastContext();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [viewLeave, setViewLeave] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const debouncedSearch = useDebounce(search);

  // Fetch leaves on mount
  useEffect(() => {
    getLeaves();
  }, [getLeaves]);

  const filtered = useMemo(
    () => filterLeaves({ search: debouncedSearch, status, leaveType }),
    [filterLeaves, debouncedSearch, status, leaveType]
  );

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(filtered, 10);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveLeave(id);
      addToast('Leave approved successfully', 'success');
    } catch {
      addToast('Failed to approve leave', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await rejectLeave(id);
      addToast('Leave rejected', 'success');
    } catch {
      addToast('Failed to reject leave', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'employeeId', label: 'ID' },
    { key: 'leaveType', label: 'Leave Type' },
    { key: 'days', label: 'Days' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setViewLeave(row)} className="p-1.5 rounded-lg hover:bg-primary-light text-primary cursor-pointer">
            <IoEyeOutline size={18} />
          </button>
          {row.status === 'Pending' && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                disabled={actionLoading === row.id}
                className="p-1.5 rounded-lg hover:bg-green-50 text-success cursor-pointer disabled:opacity-50"
              >
                <IoCheckmark size={18} />
              </button>
              <button
                onClick={() => handleReject(row.id)}
                disabled={actionLoading === row.id}
                className="p-1.5 rounded-lg hover:bg-red-50 text-danger cursor-pointer disabled:opacity-50"
              >
                <IoClose size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search leaves..." className="flex-1" />
        <Select options={LEAVE_STATUS} value={status} onChange={(e) => setStatus(e.target.value)} placeholder="All Status" containerClassName="w-full sm:w-40" />
        <Select options={LEAVE_TYPES} value={leaveType} onChange={(e) => setLeaveType(e.target.value)} placeholder="All Types" containerClassName="w-full sm:w-40" />
      </div>

      <Card noPadding>
        {leaves.length === 0 ? (
          <EmptyState title="No Leave Requests" description="Leave requests will appear here." />
        ) : (
          <>
            <Table columns={columns} data={paginatedItems} emptyMessage="No leaves match your filters" />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </Card>

      <Modal isOpen={!!viewLeave} onClose={() => setViewLeave(null)} title="Leave Details" size="sm">
        {viewLeave && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-text-secondary">Employee</p><p className="font-medium">{viewLeave.employeeName}</p></div>
              <div><p className="text-text-secondary">Leave Type</p><p className="font-medium">{viewLeave.leaveType}</p></div>
              <div><p className="text-text-secondary">Start Date</p><p className="font-medium">{formatDate(viewLeave.startDate)}</p></div>
              <div><p className="text-text-secondary">End Date</p><p className="font-medium">{formatDate(viewLeave.endDate)}</p></div>
              <div><p className="text-text-secondary">Days</p><p className="font-medium">{viewLeave.days}</p></div>
              <div><p className="text-text-secondary">Status</p><Badge variant={statusVariant[viewLeave.status]}>{viewLeave.status}</Badge></div>
            </div>
            <div><p className="text-text-secondary">Reason</p><p className="font-medium mt-1">{viewLeave.reason}</p></div>
            {viewLeave.status === 'Pending' && (
              <div className="flex gap-3 pt-4">
                <Button size="sm" onClick={() => { handleApprove(viewLeave.id); setViewLeave(null); }}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => { handleReject(viewLeave.id); setViewLeave(null); }}>Reject</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeaveRequests;
