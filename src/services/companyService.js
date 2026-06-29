import { delay } from '../utils/formatters';
import { COMPANY } from '../constants/company';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const defaultAddresses = {
  registeredOffice: COMPANY.registeredOffice,
  manufacturingUnit: COMPANY.manufacturingUnit,
};

export const companyService = {
  getStoredAddresses() {
    return loadFromStorage(STORAGE_KEYS.COMPANY_ADDRESSES, defaultAddresses);
  },

  async getCompanyInfo() {
    await delay(100);
    const addresses = this.getStoredAddresses();
    return { ...COMPANY, ...addresses };
  },

  async updateAddresses(registeredOffice, manufacturingUnit) {
    await delay(200);
    const updated = {
      registeredOffice: registeredOffice.trim(),
      manufacturingUnit: manufacturingUnit.trim(),
    };
    saveToStorage(STORAGE_KEYS.COMPANY_ADDRESSES, updated);
    return updated;
  },
};
