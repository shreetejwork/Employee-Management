import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useCompanyContext } from '../../context/CompanyContext';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';

const SettingsPage = () => {
  const { addresses, updateAddresses } = useCompanyContext();
  const { changePassword } = useAuthContext();
  const { addToast } = useToastContext();
  const [savingAddresses, setSavingAddresses] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddressForm,
    formState: { errors: addressErrors },
  } = useForm({
    defaultValues: {
      registeredOffice: addresses.registeredOffice,
      manufacturingUnit: addresses.manufacturingUnit,
    },
  });

  useEffect(() => {
    resetAddressForm({
      registeredOffice: addresses.registeredOffice,
      manufacturingUnit: addresses.manufacturingUnit,
    });
  }, [addresses.registeredOffice, addresses.manufacturingUnit, resetAddressForm]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const newPassword = watch('newPassword');

  const onSaveAddresses = async (data) => {
    setSavingAddresses(true);
    try {
      await updateAddresses(data.registeredOffice, data.manufacturingUnit);
      addToast('Company addresses updated successfully', 'success');
    } catch {
      addToast('Failed to update addresses', 'error');
    } finally {
      setSavingAddresses(false);
    }
  };

  const onChangePassword = async (data) => {
    setChangingPassword(true);
    try {
      const result = await changePassword(data.oldPassword, data.newPassword);
      if (result.success) {
        addToast('Password changed successfully', 'success');
        resetPasswordForm();
      } else {
        addToast(result.message || 'Failed to change password', 'error');
      }
    } catch {
      addToast('Failed to change password', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">
          Manage company addresses and admin account settings
        </p>
      </div>

      <Card title="Company Addresses" subtitle="These addresses appear on salary slips and official documents">
        <form onSubmit={handleAddressSubmit(onSaveAddresses)} className="space-y-4 max-w-3xl">
          <TextArea
            label="Registered Office Address"
            required
            rows={3}
            error={addressErrors.registeredOffice?.message}
            {...registerAddress('registeredOffice', { required: 'Registered office address is required' })}
          />
          <TextArea
            label="Manufacturing Unit Address"
            required
            rows={3}
            error={addressErrors.manufacturingUnit?.message}
            {...registerAddress('manufacturingUnit', { required: 'Manufacturing unit address is required' })}
          />
          <Button type="submit" loading={savingAddresses}>
            Save Addresses
          </Button>
        </form>
      </Card>

      <Card title="Change Admin Password" subtitle="Update the login password for the admin account">
        <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            required
            autoComplete="current-password"
            error={passwordErrors.oldPassword?.message}
            {...registerPassword('oldPassword', { required: 'Current password is required' })}
          />
          <Input
            label="New Password"
            type="password"
            required
            autoComplete="new-password"
            error={passwordErrors.newPassword?.message}
            {...registerPassword('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            autoComplete="new-password"
            error={passwordErrors.confirmPassword?.message}
            {...registerPassword('confirmPassword', {
              required: 'Please confirm your new password',
              validate: (value) => value === newPassword || 'Passwords do not match',
            })}
          />
          <Button type="submit" loading={changingPassword}>
            Update Password
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;
