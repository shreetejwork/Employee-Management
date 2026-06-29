import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useLeaveContext } from '../../context/LeaveContext';
import { useToastContext } from '../../context/ToastContext';
import { LEAVE_TYPES } from '../../constants/formOptions';
import { calculateLeaveDays } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';

const AddLeave = () => {
  const { employees } = useEmployeeContext();
  const { addLeave } = useLeaveContext();
  const { addToast } = useToastContext();
  const [submitting, setSubmitting] = useState(false);

  const employeeOptions = employees
    .filter((e) => e.status === 'Active')
    .map((e) => ({ value: e.id, label: `${e.employeeId} - ${e.fullName}` }));

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { employeeId: '', leaveType: '', startDate: '', endDate: '', reason: '' },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const days = startDate && endDate ? calculateLeaveDays(startDate, endDate) : 0;

  const onSubmit = async (data) => {
    const employee = employees.find((e) => e.id === data.employeeId);
    if (!employee) {
      addToast('Please select a valid employee', 'error');
      return;
    }
    if (new Date(data.endDate) < new Date(data.startDate)) {
      addToast('End date cannot be before start date', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addLeave(data, employee);
      addToast('Leave request submitted successfully!', 'success');
      reset();
    } catch {
      addToast('Failed to submit leave request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Add Leave Request">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <Select
          label="Employee"
          required
          options={employeeOptions}
          error={errors.employeeId?.message}
          {...register('employeeId', { required: 'Please select an employee' })}
        />
        <Select
          label="Leave Type"
          required
          options={LEAVE_TYPES}
          error={errors.leaveType?.message}
          {...register('leaveType', { required: 'Please select leave type' })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            required
            error={errors.startDate?.message}
            {...register('startDate', { required: 'Start date is required' })}
          />
          <Input
            label="End Date"
            type="date"
            required
            error={errors.endDate?.message}
            {...register('endDate', { required: 'End date is required' })}
          />
        </div>
        {days > 0 && (
          <p className="text-sm text-primary font-medium">Total Days: {days}</p>
        )}
        <TextArea
          label="Reason"
          required
          error={errors.reason?.message}
          {...register('reason', { required: 'Reason is required' })}
        />
        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>Submit Leave Request</Button>
          <Button type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
        </div>
      </form>
    </Card>
  );
};

export default AddLeave;
