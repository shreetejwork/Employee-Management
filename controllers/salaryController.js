import { SalaryModel } from '../models/salary.js';
import { sendEmailWithAttachment } from '../config/email.js';

export const salaryController = {
  async getHistory(req, res) {
    try {
      const history = await SalaryModel.getHistory();
      return res.status(200).json({ success: true, data: history });
    } catch (error) {
      console.error('Error fetching salary history:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch salary history' });
    }
  },

  async prefill(req, res) {
    const { employeeId, month, year } = req.query;
    if (!employeeId || month === undefined || !year) {
      return res.status(400).json({ success: false, message: 'employeeId, month, and year are required' });
    }

    try {
      const prefillData = await SalaryModel.prefillData({ employeeId, month, year });
      return res.status(200).json({ success: true, data: prefillData });
    } catch (error) {
      console.error('Error pre-filling salary data:', error);
      return res.status(500).json({ success: false, message: 'Failed to prefill salary data' });
    }
  },

  async generate(req, res) {
    const slipData = req.body;
    if (!slipData.employee_id || slipData.salaryMonth === undefined || !slipData.salaryYear) {
      return res.status(400).json({ success: false, message: 'Missing employee_id, month, or year' });
    }

    try {
      const createdSlip = await SalaryModel.create(slipData);
      return res.status(201).json({ success: true, data: createdSlip });
    } catch (error) {
      console.error('Error generating salary slip:', error);
      // Handle unique constraint (employee cannot have multiple slips for same month/year)
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'A salary slip has already been generated for this employee in the selected period'
        });
      }
      return res.status(500).json({ success: false, message: 'Failed to generate salary slip' });
    }
  },

  async sendEmail(req, res) {
    const { employeeEmail, employeeName, monthName, year, pdfBase64, companyName } = req.body;
    
    if (!employeeEmail || !pdfBase64) {
      return res.status(400).json({ success: false, message: 'Employee email and PDF document are required' });
    }

    try {
      const cleanedBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
      const buffer = Buffer.from(cleanedBase64, 'base64');
      
      const subject = `Salary Slip - ${monthName} ${year}`;
      const html = `
        <p>Dear ${employeeName},</p>
        <p>Please find attached your salary slip for ${monthName} ${year}.</p>
        <p>Regards,<br/>${companyName || 'WinRender Systems LLP.'}</p>
      `;

      const result = await sendEmailWithAttachment({
        to: employeeEmail,
        subject,
        html,
        attachments: [
          {
            filename: `salary-slip-${employeeName.replace(/\s+/g, '-')}-${monthName}-${year}.pdf`,
            content: buffer,
            contentType: 'application/pdf'
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: result.simulated ? 'Email sent successfully (Simulated mode)' : 'Email sent successfully'
      });
    } catch (error) {
      console.error('Error sending salary slip email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  }
};
