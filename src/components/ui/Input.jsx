const Input = ({
  label,
  error,
  required,
  className = '',
  containerClassName = '',
  ...props
}) => (
  <div className={`flex flex-col gap-1 ${containerClassName}`}>
    {label && (
      <label className="text-sm font-medium text-primary">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
    )}
    <input
      className={`
        w-full px-3 py-2 text-sm text-text bg-white border rounded-lg
        transition-colors duration-200 outline-none
        placeholder:text-text-secondary
        focus:border-primary focus:ring-2 focus:ring-primary/20
        disabled:bg-card disabled:cursor-not-allowed
        ${error ? 'border-danger' : 'border-border'}
        ${className}
      `}
      {...props}
    />
    {error && <span className="text-xs text-danger">{error}</span>}
  </div>
);

export default Input;
