import { motion } from 'framer-motion';

const Card = ({ children, className = '', title, subtitle, action, noPadding = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white border border-border rounded-xl shadow-sm ${className}`}
  >
    {(title || action) && (
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          {title && <h3 className="text-base font-semibold text-primary">{title}</h3>}
          {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className={noPadding ? '' : 'p-5'}>{children}</div>
  </motion.div>
);

export default Card;
