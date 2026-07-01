import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoPeopleOutline,
  IoWalletOutline,
  IoCalendarOutline,
  IoPersonAddOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { useDashboard } from "../../hooks/useDashboard";
import { ROUTES } from "../../constants/routes";
import { formatCurrency, formatDate } from "../../utils/formatters";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import { DashboardSkeleton } from "../../components/ui/LoadingSkeleton";

const DashboardHome = () => {
  const { data, loading, error, refetch } = useDashboard();
  const navigate = useNavigate();

  if (loading && !data) return <DashboardSkeleton />;

  if (error && !data) {
    return (
      <div className="rounded-xl border border-danger/30 bg-red-50 p-6 text-center">
        <p className="text-danger font-medium">{error}</p>
        <Button className="mt-4" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const company = data.companyInfo;

  const employeeColumns = [
    { key: "employeeId", label: "ID" },
    {
      key: "fullName",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.photo} name={row.fullName} size="sm" />
          <span className="font-medium">{row.fullName}</span>
        </div>
      ),
    },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const salaryColumns = [
    { key: "slipId", label: "Slip ID" },
    { key: "employeeName", label: "Employee" },
    {
      key: "month",
      label: "Period",
      render: (row) => `${row.salaryMonthName} ${row.salaryYear}`,
    },
    {
      key: "netSalary",
      label: "Net Salary",
      render: (row) => formatCurrency(row.netSalary),
    },
    {
      key: "generatedAt",
      label: "Generated",
      render: (row) => formatDate(row.generatedAt),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">
          Overview of your HR & Payroll operations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Employees" value={data.totalEmployees} icon={<IoPeopleOutline size={22} />} color="primary" />
        <StatCard title="Active Employees" value={data.activeEmployees} icon={<IoCheckmarkCircleOutline size={22} />} color="success" />
        <StatCard title="Inactive Employees" value={data.inactiveEmployees} icon={<IoCloseCircleOutline size={22} />} color="secondary" />
        <StatCard title="Salary Slips Generated" value={data.salarySlipsGenerated} icon={<IoWalletOutline size={22} />} color="success" />
        <StatCard title="Joined This Month" value={data.employeesJoinedThisMonth} icon={<IoPersonAddOutline size={22} />} color="primary" />
        <StatCard title="Pending Leaves" value={data.pendingLeaves} icon={<IoCalendarOutline size={22} />} color="warning" />
      </div>

      {company && (
        <Card title="Company Information">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-text-secondary">Company Name</p>
              <p className="font-medium">{company.name}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Email</p>
              <p className="font-medium">{company.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Website</p>
              <p className="font-medium">{company.website || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Phone</p>
              <p className="font-medium">{company.phones || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-text-secondary">Registered Office</p>
              <p className="font-medium">{company.registeredOffice || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-text-secondary">Manufacturing Unit</p>
              <p className="font-medium">{company.manufacturingUnit || '-'}</p>
            </div>
          </div>
        </Card>
      )}

      <Card title="Quick Actions" noPadding>
        <div className="flex flex-wrap gap-3 p-5">
          <Button icon={<IoPersonAddOutline />} onClick={() => navigate(ROUTES.EMPLOYEE_ADD)}>
            Add Employee
          </Button>
          <Button variant="outline" icon={<IoDocumentTextOutline />} onClick={() => navigate(ROUTES.SALARY_GENERATE)}>
            Generate Salary Slip
          </Button>
          <Button variant="outline" icon={<IoCalendarOutline />} onClick={() => navigate(ROUTES.LEAVES)}>
            Leave Management
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Recent Employees"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.EMPLOYEES)}>
              View All
            </Button>
          }
          noPadding
        >
          <Table columns={employeeColumns} data={data.recentEmployees || []} emptyMessage="No employees added yet" />
        </Card>

        <Card
          title="Recent Salary Slips"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.SALARY_HISTORY)}>
              View All
            </Button>
          }
          noPadding
        >
          <Table columns={salaryColumns} data={data.recentSalarySlips || []} emptyMessage="No salary slips generated yet" />
        </Card>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
