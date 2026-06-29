import Modal from './Modal';
import Button from './Button';
import { IoWarning } from 'react-icons/io5';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <div className="flex flex-col items-center text-center gap-4 py-2">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <IoWarning className="text-danger" size={28} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        <p className="text-sm text-text-secondary mt-2">{message}</p>
      </div>
      <div className="flex gap-3 w-full mt-2">
        <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} className="flex-1" onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
