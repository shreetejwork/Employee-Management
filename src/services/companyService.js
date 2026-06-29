import { delay } from '../utils/formatters';
import { COMPANY } from '../constants/company';

export const companyService = {
  async getCompanyInfo() {
    await delay(100);
    return { ...COMPANY };
  },
};
