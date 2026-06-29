import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoCreateOutline, IoTrashOutline, IoPersonAddOutline } from 'react-icons/io5';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { employeeService } from '../../services/employeeService';
import { useToastContext } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { DEPARTMENTS, GRADES, EMPLOYEE_STATUS } from '../../constants/formOptions';
import { ROUTES } from '../../constants/routes';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const EmployeeList = () => {
  const { employees, loading, filterEmployees, deleteEmployee } = useEmployeeContext();
  const { addToast } = useToastContext();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [grade, setGrade] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    const result = filterEmployees({ search: debouncedSearch, department, status, grade });
    return employeeService.sortEmployees(result, sortField, sortOrder);
  }, [filterEmployees, debouncedSearch, department, status, grade, sortField, sortOrder]);

  const { currentPage, totalPages, paginatedItems, goToPage, resetPage } = usePagination(filtered, 10);

  useEffect(() => { resetPage(); }, [debouncedSearch, department, status, grade, resetPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteEmployee(deleteId);
      addToast('Employee deleted successfully', 'success');
      setDeleteId(null);
    } catch {
      addToast('Failed to delete employee', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    {
      key: 'photo',
      label: 'Photo',
      render: (row) => <Avatar src={row.photo} name={row.fullName} size="sm" />,
    },
    { key: 'fullName', label: 'Employee Name', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'grade', label: 'Grade', sortable: true },
    {
      key: 'joiningDate',
      label: 'Joining Date',
      sortable: true,
      render: (row) => formatDate(row.joiningDate),
    },
    {
      key: 'basicPay',
      label: 'Basic Pay',
      sortable: true,
      render: (row) => formatCurrency(row.basicPay),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/employees/view/${row.id}`)}
            className="p-1.5 rounded-lg hover:bg-primary-light text-primary cursor-pointer"
            title="View"
          >
            <IoEyeOutline size={18} />
          </button>
          <button
            onClick={() => navigate(`/employees/edit/${row.id}`)}
            className="p-1.5 rounded-lg hover:bg-amber-50 text-warning cursor-pointer"
            title="Edit"
          >
            <IoCreateOutline size={18} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-danger cursor-pointer"
            title="Delete"
          >
            <IoTrashOutline size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && employees.length === 0) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, ID, email..."
          className="flex-1"
        />
        <Select
          options={DEPARTMENTS}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="All Departments"
          containerClassName="w-full sm:w-44"
        />
        <Select
          options={EMPLOYEE_STATUS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="All Status"
          containerClassName="w-full sm:w-36"
        />
        <Select
          options={GRADES}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="All Grades"
          containerClassName="w-full sm:w-36"
        />
        <Button icon={<IoPersonAddOutline />} onClick={() => navigate(ROUTES.EMPLOYEE_ADD)}>
          Add Employee
        </Button>
      </div>

      <Card noPadding>
        {employees.length === 0 ? (
          <EmptyState
            title="No Employees Yet"
            description="Start by adding your first employee to the system."
            action={
              <Button icon={<IoPersonAddOutline />} onClick={() => navigate(ROUTES.EMPLOYEE_ADD)}>
                Add Employee
              </Button>
            }
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedItems}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
              emptyMessage="No employees match your filters"
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default EmployeeList;
