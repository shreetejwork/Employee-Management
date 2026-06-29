import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useToastContext } from '../../context/ToastContext';
import {
  GENDERS, BLOOD_GROUPS, DEPARTMENTS, DESIGNATIONS, GRADES,
  EMPLOYMENT_TYPES, EMPLOYEE_STATUS, INDIAN_STATES, COUNTRIES,
} from '../../constants/formOptions';
import { validateEmail, validatePhone, validatePAN, validateAadhar, validateIFSC, validatePIN } from '../../utils/validators';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import FileUpload from '../../components/ui/FileUpload';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const EmployeeForm = ({ editData = null, onCancel }) => {
  const { getNextEmployeeId, addEmployee, updateEmployee } = useEmployeeContext();
  const { addToast } = useToastContext();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState(editData?.photo || null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: editData || {
      gender: '', bloodGroup: '', department: '', designation: '', grade: '',
      employmentType: '', status: 'Active', country: 'India',
      basicPay: '', hra: '', da: '', medicalAllowance: '', fixedAllowance: '', conveyance: '', fba: '', otherAllowances: '',
    },
  });

  useEffect(() => {
    if (!editData) {
      getNextEmployeeId().then((id) => setValue('employeeId', id));
    }
  }, [editData, getNextEmployeeId, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        photo,
        basicPay: Number(data.basicPay),
        hra: Number(data.hra || 0),
        da: Number(data.da || 0),
        medicalAllowance: Number(data.medicalAllowance || 0),
        fixedAllowance: Number(data.fixedAllowance || 0),
        conveyance: Number(data.conveyance || 0),
        fba: Number(data.fba || 0),
        otherAllowances: Number(data.otherAllowances || 0),
      };
      if (editData) {
        await updateEmployee(editData.id, payload);
        addToast('Employee updated successfully!', 'success');
      } else {
        await addEmployee(payload);
        addToast('Employee registered successfully!', 'success');
      }
      navigate(ROUTES.EMPLOYEES);
    } catch {
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (editData) {
      reset(editData);
      setPhoto(editData.photo);
    } else {
      reset();
      setPhoto(null);
      getNextEmployeeId().then((id) => setValue('employeeId', id));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Employee ID" {...register('employeeId')} readOnly disabled />
          <Input label="Full Name" required error={errors.fullName?.message} {...register('fullName', { required: 'Full name is required' })} />
          <Input label="Father Name" required error={errors.fatherName?.message} {...register('fatherName', { required: 'Father name is required' })} />
          <Input label="Mother Name" required error={errors.motherName?.message} {...register('motherName', { required: 'Mother name is required' })} />
          <Select label="Gender" required error={errors.gender?.message} options={GENDERS} {...register('gender', { required: 'Gender is required' })} />
          <Input label="Date of Birth" type="date" required error={errors.dateOfBirth?.message} {...register('dateOfBirth', { required: 'Date of birth is required' })} />
          <Select label="Blood Group" options={BLOOD_GROUPS} {...register('bloodGroup')} />
          <Input label="Mobile Number" required error={errors.mobile?.message} {...register('mobile', { required: 'Mobile is required', validate: (v) => validatePhone(v) || 'Enter valid 10-digit mobile number' })} />
          <Input label="Email Address" required error={errors.email?.message} {...register('email', { required: 'Email is required', validate: (v) => validateEmail(v) || 'Enter valid email' })} />
        </div>
      </Card>

      <Card title="Address Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextArea label="Current Address" required containerClassName="md:col-span-2" error={errors.currentAddress?.message} {...register('currentAddress', { required: 'Current address is required' })} />
          <TextArea label="Permanent Address" required containerClassName="md:col-span-2" error={errors.permanentAddress?.message} {...register('permanentAddress', { required: 'Permanent address is required' })} />
          <Input label="City" required error={errors.city?.message} {...register('city', { required: 'City is required' })} />
          <Select label="State" required error={errors.state?.message} options={INDIAN_STATES} {...register('state', { required: 'State is required' })} />
          <Select label="Country" required options={COUNTRIES} {...register('country', { required: 'Country is required' })} />
          <Input label="PIN Code" required error={errors.pinCode?.message} {...register('pinCode', { required: 'PIN code is required', validate: (v) => validatePIN(v) || 'Enter valid 6-digit PIN' })} />
        </div>
      </Card>

      <Card title="Employment Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select label="Department" required error={errors.department?.message} options={DEPARTMENTS} {...register('department', { required: 'Department is required' })} />
          <Select label="Designation" required error={errors.designation?.message} options={DESIGNATIONS} {...register('designation', { required: 'Designation is required' })} />
          <Select label="Grade" required error={errors.grade?.message} options={GRADES} {...register('grade', { required: 'Grade is required' })} />
          <Input label="Joining Date" type="date" required error={errors.joiningDate?.message} {...register('joiningDate', { required: 'Joining date is required' })} />
          <Select label="Employment Type" required error={errors.employmentType?.message} options={EMPLOYMENT_TYPES} {...register('employmentType', { required: 'Employment type is required' })} />
          <Select label="Status" required options={EMPLOYEE_STATUS} {...register('status', { required: 'Status is required' })} />
        </div>
      </Card>

      <Card title="Salary Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Basic Pay" type="number" required error={errors.basicPay?.message} {...register('basicPay', { required: 'Basic pay is required', min: { value: 1, message: 'Must be greater than 0' } })} />
          <Input label="Dearness Allowance (DA)" type="number" {...register('da')} />
          <Input label="House Rent Allowance (H.R.A.)" type="number" {...register('hra')} />
          <Input label="Fixed Allowance" type="number" {...register('fixedAllowance')} />
          <Input label="Medical Allowance" type="number" {...register('medicalAllowance')} />
          <Input label="Conveyance" type="number" {...register('conveyance')} />
          <Input label="F.B.A." type="number" {...register('fba')} />
          <Input label="Other Allowances" type="number" {...register('otherAllowances')} />
        </div>
      </Card>

      <Card title="Bank & Identity Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="PAN Number" required error={errors.panNumber?.message} {...register('panNumber', { required: 'PAN is required', validate: (v) => validatePAN(v) || 'Enter valid PAN (e.g. ABCDE1234F)' })} />
          <Input label="Aadhar Number" required error={errors.aadharNumber?.message} {...register('aadharNumber', { required: 'Aadhar is required', validate: (v) => validateAadhar(v) || 'Enter valid 12-digit Aadhar' })} />
          <Input label="Bank Name" required error={errors.bankName?.message} {...register('bankName', { required: 'Bank name is required' })} />
          <Input label="Account Number" required error={errors.accountNumber?.message} {...register('accountNumber', { required: 'Account number is required' })} />
          <Input label="IFSC Code" required error={errors.ifscCode?.message} {...register('ifscCode', { required: 'IFSC is required', validate: (v) => validateIFSC(v) || 'Enter valid IFSC code' })} />
        </div>
      </Card>

      <Card title="Emergency Contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Emergency Contact Name" required error={errors.emergencyContactName?.message} {...register('emergencyContactName', { required: 'Emergency contact name is required' })} />
          <Input label="Emergency Contact Number" required error={errors.emergencyContactNumber?.message} {...register('emergencyContactNumber', { required: 'Emergency contact number is required', validate: (v) => validatePhone(v) || 'Enter valid 10-digit number' })} />
        </div>
      </Card>

      <Card title="Additional Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUpload label="Employee Photograph" value={photo} onChange={setPhoto} />
          <TextArea label="Remarks" {...register('remarks')} />
        </div>
      </Card>

      <div className="flex flex-wrap gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel || (() => navigate(ROUTES.EMPLOYEES))}>
          Cancel
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit" loading={submitting}>
          {editData ? 'Update Employee' : 'Save Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
