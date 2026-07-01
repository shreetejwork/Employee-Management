import { useState, useEffect } from 'react';
import {
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoShareSocialOutline,
} from 'react-icons/io5';
import { useCompanyContext } from '../../context/CompanyContext';
import { useToastContext } from '../../context/ToastContext';
import { salaryService } from '../../services/salaryService';
import { buildSalarySlipFilename } from '../../utils/pdfDownload';
import { useSalarySlipPdf } from '../../hooks/useSalarySlipPdf';
import Button from '../ui/Button';

const SalarySlipActions = ({ employee, slip, onClose }) => {
  const { companyInfo } = useCompanyContext();
  const { addToast } = useToastContext();
  const {
    pdfReady,
    generatingPdf,
    downloading,
    printing,
    resetPdf,
    handleGeneratePdf,
    handleDownloadPdf,
    handlePrint,
    getPdfData,
  } = useSalarySlipPdf();

  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    resetPdf();
  }, [slip?.id, slip?.slipId, resetPdf]);

  if (!employee || !slip) return null;

  const filename = buildSalarySlipFilename(
    employee.fullName,
    slip.salaryMonthName,
    slip.salaryYear
  );

  const onGeneratePdf = async () => {
    try {
      await handleGeneratePdf();
      addToast('PDF generated successfully', 'success');
    } catch {
      addToast('Failed to generate PDF. Please try again.', 'error');
    }
  };

  const onDownload = async () => {
    try {
      await handleDownloadPdf(filename);
      addToast('PDF downloaded successfully', 'success');
    } catch {
      addToast('Failed to download PDF', 'error');
    }
  };

  const onPrint = async () => {
    try {
      await handlePrint();
    } catch {
      addToast('Failed to print salary slip', 'error');
    }
  };

  const onShare = async () => {
    if (!employee.email) {
      addToast('Employee email not found in database', 'warning');
      return;
    }

    setSharing(true);
    try {
      const pdfBase64 = getPdfData();
      await salaryService.sendSalarySlipEmail({
        employeeEmail: employee.email,
        employeeName: employee.fullName,
        monthName: slip.salaryMonthName,
        year: slip.salaryYear,
        pdfBase64,
        companyName: companyInfo.name,
      });
      addToast(`Salary slip sent to ${employee.email}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to send email', 'error');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-end gap-3 mt-6 no-print">
      <Button
        icon={<IoDocumentTextOutline />}
        loading={generatingPdf}
        onClick={onGeneratePdf}
      >
        Generate PDF
      </Button>
      <Button
        variant="outline"
        icon={<IoDownloadOutline />}
        loading={downloading}
        disabled={!pdfReady}
        onClick={onDownload}
      >
        Download
      </Button>
      <Button
        variant="outline"
        icon={<IoPrintOutline />}
        loading={printing}
        disabled={!pdfReady}
        onClick={onPrint}
      >
        Print
      </Button>
      <Button
        variant="outline"
        icon={<IoShareSocialOutline />}
        loading={sharing}
        disabled={!pdfReady}
        onClick={onShare}
      >
        Share
      </Button>
      {onClose && (
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      )}
    </div>
  );
};

export default SalarySlipActions;
