import { createContext, useContext, useState, useCallback } from 'react';
import { COMPANY } from '../constants/company';
import { companyService } from '../services/companyService';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [addresses, setAddresses] = useState(() => companyService.getStoredAddresses());

  const updateAddresses = useCallback(async (registeredOffice, manufacturingUnit) => {
    const updated = await companyService.updateAddresses(registeredOffice, manufacturingUnit);
    setAddresses(updated);
    return updated;
  }, []);

  const companyInfo = {
    ...COMPANY,
    registeredOffice: addresses.registeredOffice,
    manufacturingUnit: addresses.manufacturingUnit,
  };

  return (
    <CompanyContext.Provider value={{ companyInfo, addresses, updateAddresses }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompanyContext must be used within CompanyProvider');
  return context;
};
