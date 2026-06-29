const Select = ({
  label,
  error,
  required,
  options = [],
  placeholder = 'Select...',
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
    <select
      className={`
        w-full px-3 py-2 text-sm text-text bg-white border rounded-lg
        transition-colors duration-200 outline-none cursor-pointer
        focus:border-primary focus:ring-2 focus:ring-primary/20
        disabled:bg-card disabled:cursor-not-allowed
        ${error ? 'border-danger' : 'border-border'}
        ${className}
      `}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>{opt}</option>
        ) : (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )
      )}
    </select>
    {error && <span className="text-xs text-danger">{error}</span>}
  </div>
);

export default Select;
