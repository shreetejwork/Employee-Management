import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCreateOutline } from 'react-icons/io5';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { formatCurrency, formatDate, formatDateLong } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { DashboardSkeleton } from '../../components/ui/LoadingSkeleton';

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
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getEmployee(id);
      setEmployee(data);
      setLoading(false);
    };
    fetch();
  }, [id, getEmployee]);

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
