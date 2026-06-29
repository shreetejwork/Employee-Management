import { useRef } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

const FileUpload = ({ label, value, onChange, accept = 'image/*', error }) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-primary">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          hover:border-primary hover:bg-primary-light/30 transition-colors
          ${error ? 'border-danger' : 'border-border'}
        `}
      >
        {value ? (
          <img src={value} alt="Preview" className="w-24 h-24 object-cover rounded-lg mx-auto" />
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <IoCloudUploadOutline className="text-primary" size={28} />
            <p className="text-sm text-text-secondary">Click to upload photo</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
};

export default FileUpload;
