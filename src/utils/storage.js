const STORAGE_KEYS = {
  COMPANY_ADDRESSES: 'hr_company_addresses',
  ADMIN_PASSWORD: 'hr_admin_password',
};

export const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export { STORAGE_KEYS };
