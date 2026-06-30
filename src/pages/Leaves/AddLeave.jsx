import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useLeaveContext } from '../../context/LeaveContext';
import { useToastContext } from '../../context/ToastContext';
import { LEAVE_TYPES } from '../../constants/formOptions';
import { calculateLeaveDays } from '../../utils/formatters';
import { leaveService } from '../../services/leaveService';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';

const AddLeave = () => {
  const { employees, fetchEmployees } = useEmployeeContext();
  const { addLeave } = useLeaveContext();
  const { addToast } = useToastContext();
  const [submitting, setSubmitting] = useState(false);
  const [balances, setBalances] = useState([]);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const employeeOptions = employees
    .filter((e) => e.status === 'Active')
    .map((e) => ({ value: e.id, label: `${e.employeeId} - ${e.fullName}` }));

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { employeeId: '', leaveType: '', startDate: '', endDate: '', reason: '' },
  });

  const watchedEmployeeId = watch('employeeId');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const days = startDate && endDate ? calculateLeaveDays(startDate, endDate) : 0;

  // Fetch leave balances when employee selection changes
  useEffect(() => {
    if (watchedEmployeeId) {
      leaveService.getBalances(watchedEmployeeId)
        .then(data => {
          setBalances(data);
          // Reset leave type selection when employee changes
          setValue('leaveType', '');
        })
        .catch(() => {
          setBalances([]);
          addToast('Failed to load leave balances for employee', 'error');
        });
    } else {
      setBalances([]);
    }
  }, [watchedEmployeeId, setValue, addToast]);

  // Dynamically filter leave types that have remaining balance
  const filteredLeaveTypes = useMemo(() => {
    if (!watchedEmployeeId) return [];
    return LEAVE_TYPES.filter(type => {
      if (type === 'Unpaid') return true; // Always allow unpaid leaves
      const bal = balances.find(b => b.leaveType === type);
      return bal ? bal.remaining > 0 : false;
    });
  }, [balances, watchedEmployeeId]);

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
      addToast('Leave added successfully!', 'success');
      reset();
    } catch {
      addToast('Failed to add leave', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Add Leave">
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
          options={filteredLeaveTypes}
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
          <Button type="submit" loading={submitting}>Add Leave</Button>
          <Button type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
        </div>
      </form>
    </Card>
  );
};

export default AddLeave;
