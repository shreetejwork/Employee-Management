import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color = 'primary', trend }) => {
  const colorMap = {
    primary: 'bg-primary-light text-primary',
    success: 'bg-green-50 text-success',
    warning: 'bg-amber-50 text-warning',
    danger: 'bg-red-50 text-danger',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-bold text-text mt-1">{value}</p>
          {trend && <p className="text-xs text-text-secondary mt-1">{trend}</p>}
        </div>
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
