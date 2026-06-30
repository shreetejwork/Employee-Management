import { CompanyModel } from '../models/company.js';

export const companyController = {
  async getInfo(req, res) {
    try {
      const companyInfo = await CompanyModel.getInfo();
      return res.status(200).json({ success: true, data: companyInfo });
    } catch (error) {
      console.error('Error fetching company details:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch company details' });
    }
  },

  async updateAddresses(req, res) {
    const { registeredOffice, manufacturingUnit } = req.body;
    if (!registeredOffice || !manufacturingUnit) {
      return res.status(400).json({ success: false, message: 'Both registered office and manufacturing unit are required' });
    }

    try {
      await CompanyModel.updateAddresses(registeredOffice, manufacturingUnit);
      return res.status(200).json({
        success: true,
        data: { registeredOffice, manufacturingUnit }
      });
    } catch (error) {
      console.error('Error updating company addresses:', error);
      return res.status(500).json({ success: false, message: 'Failed to update company addresses' });
    }
  }
};
