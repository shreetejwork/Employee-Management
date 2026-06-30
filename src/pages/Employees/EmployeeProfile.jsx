import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCreateOutline } from 'react-icons/io5';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useLeaveContext } from '../../context/LeaveContext';
import { leaveService } from '../../services/leaveService';
import { formatCurrency, formatDate, formatDateLong } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { DashboardSkeleton } from '../../components/ui/LoadingSkeleton';

const statusVariant = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

const InfoRow = ({ label, value }) => (
  <div className="py-2">
    <p className="text-xs text-text-secondary font-medium">{label}</p>
    <p className="text-sm text-text mt-0.5">{value || '-'}</p>
  </div>
);

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee } = useEmployeeContext();
  const { getLeaves, leaves } = useLeaveContext();
  const [employee, setEmployee] = useState(null);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getEmployee(id);
        setEmployee(data);
        if (data) {
          const balData = await leaveService.getBalances(id);
          setBalances(balData);
          await getLeaves();
        }
      } catch (err) {
        console.error('Error fetching employee profile details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, getEmployee, getLeaves]);

  const employeeLeaves = useMemo(() => {
    return leaves.filter(l => l.employee_id === id);
  }, [leaves, id]);

  const leaveSummary = useMemo(() => {
    let total = 0;
    let used = 0;
    let remaining = 0;
    balances.forEach(b => {
      if (b.leaveType !== 'Unpaid') {
        total += b.allowed;
        used += b.used;
        remaining += b.remaining;
      }
    });
    return { total, used, remaining };
  }, [balances]);

  if (loading) return <DashboardSkeleton />;
  if (!employee) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">Employee not found</p>
        <Button className="mt-4" onClick={() => navigate(ROUTES.EMPLOYEES)}>Back to List</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={<IoArrowBack />} onClick={() => navigate(ROUTES.EMPLOYEES)}>
            Back
          </Button>
          <Avatar src={employee.photo} name={employee.fullName} size="xl" />
          <div>
            <h1 className="text-2xl font-bold text-text">{employee.fullName}</h1>
            <p className="text-text-secondary text-sm">{employee.employeeId} · {employee.designation}</p>
            <Badge variant={employee.status === 'Active' ? 'success' : 'secondary'} className="mt-1">
              {employee.status}
            </Badge>
          </div>
        </div>
        <Button
          icon={<IoCreateOutline />}
          onClick={() => navigate(`/employees/edit/${employee.id}`)}
        >
          Edit Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Personal Information">
          <div className="grid grid-cols-2 gap-x-4">
            <InfoRow label="Full Name" value={employee.fullName} />
            <InfoRow label="Father Name" value={employee.fatherName} />
            <InfoRow label="Mother Name" value={employee.motherName} />
            <InfoRow label="Gender" value={employee.gender} />
            <InfoRow label="Date of Birth" value={formatDateLong(employee.dateOfBirth)} />
            <InfoRow label="Blood Group" value={employee.bloodGroup} />
            <InfoRow label="Mobile" value={employee.mobile} />
            <InfoRow label="Email" value={employee.email} />
            <InfoRow label="Current Address" value={employee.currentAddress} />
            <InfoRow label="Permanent Address" value={employee.permanentAddress} />
            <InfoRow label="City" value={employee.city} />
            <InfoRow label="State" value={employee.state} />
            <InfoRow label="Country" value={employee.country} />
            <InfoRow label="PIN Code" value={employee.pinCode} />
          </div>
        </Card>

        <Card title="Employment Information">
          <div className="grid grid-cols-2 gap-x-4">
            <InfoRow label="Department" value={employee.department} />
            <InfoRow label="Designation" value={employee.designation} />
            <InfoRow label="Grade" value={employee.grade} />
            <InfoRow label="Joining Date" value={formatDateLong(employee.joiningDate)} />
            <InfoRow label="Employment Type" value={employee.employmentType} />
            <InfoRow label="Status" value={employee.status} />
          </div>
        </Card>

        <Card title="Salary Information">
          <div className="grid grid-cols-2 gap-x-4">
            <InfoRow label="Basic Pay" value={formatCurrency(employee.basicPay)} />
            <InfoRow label="DA" value={formatCurrency(employee.da)} />
            <InfoRow label="H.R.A." value={formatCurrency(employee.hra)} />
            <InfoRow label="Fixed Allowance" value={formatCurrency(employee.fixedAllowance ?? employee.otherAllowances)} />
            <InfoRow label="Medical Allowance" value={formatCurrency(employee.medicalAllowance)} />
            <InfoRow label="Conveyance" value={formatCurrency(employee.conveyance)} />
            <InfoRow label="F.B.A." value={formatCurrency(employee.fba)} />
          </div>
        </Card>

        <Card title="Bank Information">
          <div className="grid grid-cols-2 gap-x-4">
            <InfoRow label="PAN Number" value={employee.panNumber} />
            <InfoRow label="Aadhar Number" value={employee.aadharNumber} />
            <InfoRow label="Bank Name" value={employee.bankName} />
            <InfoRow label="Account Number" value={employee.accountNumber} />
            <InfoRow label="IFSC Code" value={employee.ifscCode} />
          </div>
        </Card>

        <Card title="Emergency Contact">
          <div className="grid grid-cols-2 gap-x-4">
            <InfoRow label="Contact Name" value={employee.emergencyContactName} />
            <InfoRow label="Contact Number" value={employee.emergencyContactNumber} />
          </div>
        </Card>

        <Card title="Leave Summary">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-primary-light rounded-lg">
              <p className="text-xs text-text-secondary">Total Allowed</p>
              <p className="text-lg font-bold text-primary">{leaveSummary.total}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-text-secondary">Used Leaves</p>
              <p className="text-lg font-bold text-danger">{leaveSummary.used}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-text-secondary">Remaining</p>
              <p className="text-lg font-bold text-success">{leaveSummary.remaining}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Breakdown</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {balances.map(b => (
                <div key={b.leaveType} className="flex justify-between py-1 border-b border-border/40">
                  <span className="font-medium">{b.leaveType} Leave</span>
                  <span className="text-text-secondary">
                    {b.used} / {b.allowed === 999 ? '∞' : b.allowed} remaining
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Leave History">
          {employeeLeaves.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-6">No leaves taken yet.</p>
          ) : (
            <div className="overflow-x-auto max-h-[300px] text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border font-semibold text-text-secondary">
                    <th className="py-2">Period</th>
                    <th className="py-2">Type</th>
                    <th className="py-2 text-center">Days</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeLeaves.map(leave => (
                    <tr key={leave.id} className="border-b border-border/40">
                      <td className="py-2">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </td>
                      <td className="py-2">{leave.leaveType}</td>
                      <td className="py-2 text-center">{leave.days}</td>
                      <td className="py-2 text-right">
                        <Badge variant={statusVariant[leave.status]}>{leave.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {employee.remarks && (
          <Card title="Remarks">
            <p className="text-sm text-text">{employee.remarks}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
