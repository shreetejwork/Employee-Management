import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { COMPANY } from '../constants/company';
import { companyService } from '../services/companyService';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState({
    ...COMPANY,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCompanyInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await companyService.getCompanyInfo();
      setCompanyInfo(info);
      return info;
    } catch (err) {
      setError(err.message || 'Failed to load company information');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanyInfo();
  }, [loadCompanyInfo]);

  const updateAddresses = useCallback(async (registeredOffice, manufacturingUnit) => {
    const updated = await companyService.updateAddresses(registeredOffice, manufacturingUnit);
    setCompanyInfo((prev) => ({
      ...prev,
      registeredOffice: updated.registeredOffice,
      manufacturingUnit: updated.manufacturingUnit,
    }));
    return updated;
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companyInfo,
        addresses: {
          registeredOffice: companyInfo.registeredOffice,
          manufacturingUnit: companyInfo.manufacturingUnit,
        },
        loading,
        error,
        loadCompanyInfo,
        updateAddresses,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompanyContext must be used within CompanyProvider');
  return context;
};
