import { api } from '../utils/api';
import { COMPANY } from '../constants/company';

const parsePhones = (phones) => {
  if (Array.isArray(phones)) return phones;
  if (typeof phones === 'string' && phones.trim()) {
    return phones.split(',').map((p) => p.trim());
  }
  return COMPANY.phones;
};

const withAssets = (info = {}) => ({
  name: info.name || COMPANY.name,
  shortName: info.shortName || COMPANY.shortName,
  tagline: info.tagline || COMPANY.tagline,
  website: info.website || COMPANY.website,
  email: info.email || COMPANY.email,
  phones: parsePhones(info.phones),
  registeredOffice: info.registeredOffice || COMPANY.registeredOffice,
  manufacturingUnit: info.manufacturingUnit || COMPANY.manufacturingUnit,
  logoIcon: COMPANY.logoIcon,
  logoFull: COMPANY.logoFull,
  appTitle: COMPANY.appTitle,
  appSubtitle: COMPANY.appSubtitle,
});

export const companyService = {
  async getCompanyInfo() {
    const res = await api.get('/company');
    if (res.success && res.data) {
      return withAssets(res.data);
    }
    return withAssets();
  },

  async updateAddresses(registeredOffice, manufacturingUnit) {
    const res = await api.put('/company/addresses', { registeredOffice, manufacturingUnit });
    return {
      registeredOffice: res.data.registeredOffice,
      manufacturingUnit: res.data.manufacturingUnit,
    };
  },
};
