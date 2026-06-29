import { IoDocumentTextOutline } from 'react-icons/io5';

const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
      {icon || <IoDocumentTextOutline className="text-primary" size={28} />}
    </div>
    <h3 className="text-lg font-semibold text-text">{title}</h3>
    <p className="text-sm text-text-secondary mt-1 text-center max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
