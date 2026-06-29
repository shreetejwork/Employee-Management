import { getInitials } from '../../utils/formatters';

const Avatar = ({ src, name, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border-2 border-border`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary-light text-primary font-semibold flex items-center justify-center border-2 border-border`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
