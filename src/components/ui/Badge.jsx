const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-primary-light text-primary',
    success: 'bg-green-50 text-success',
    danger: 'bg-red-50 text-danger',
    warning: 'bg-amber-50 text-warning',
    secondary: 'bg-card text-text-secondary',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
