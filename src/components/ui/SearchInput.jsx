import { IoSearch } from 'react-icons/io5';

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
    />
  </div>
);

export default SearchInput;
