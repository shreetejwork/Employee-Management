import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle, IoWarning, IoInformationCircle } from 'react-icons/io5';
import { useToastContext } from '../../context/ToastContext';

const icons = {
  success: <IoCheckmarkCircle className="text-success" size={22} />,
  error: <IoCloseCircle className="text-danger" size={22} />,
  warning: <IoWarning className="text-warning" size={22} />,
  info: <IoInformationCircle className="text-primary" size={22} />,
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-lg shadow-lg min-w-[300px]"
          >
            {icons[toast.type] || icons.success}
            <span className="text-sm text-text flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-secondary hover:text-text cursor-pointer"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
