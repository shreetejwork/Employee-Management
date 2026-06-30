import { api } from '../utils/api';
import { COMPANY } from '../constants/company';

const defaultAddresses = {
  registeredOffice: COMPANY.registeredOffice,
  manufacturingUnit: COMPANY.manufacturingUnit,
};

export const companyService = {
  getStoredAddresses() {
    // For synchronous initialization fallback
    return defaultAddresses;
  },

  async getCompanyInfo() {
    try {
      const res = await api.get('/company');
      if (res.success && res.data) {
        return { ...COMPANY, ...res.data };
      }
      return { ...COMPANY, ...defaultAddresses };
    } catch {
      return { ...COMPANY, ...defaultAddresses };
    }
  },

  async updateAddresses(registeredOffice, manufacturingUnit) {
    const res = await api.put('/company/addresses', { registeredOffice, manufacturingUnit });
    return res.data;
  },
};
