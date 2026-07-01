import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const waitForRender = async (element) => {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const images = element.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = resolve;
          img.onerror = resolve;
        })
    )
  );

  await new Promise(requestAnimationFrame);
  await new Promise((resolve) => setTimeout(resolve, 150));
};

export const buildSalarySlipFilename = (employeeName, monthName, year) => {
  const safeName = (employeeName || 'Employee').replace(/\s+/g, '_');
  return `${safeName}_${monthName}_${year}_SalarySlip.pdf`;
};

export const generateSalarySlipPdf = async (elementId = 'salary-slip-print') => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('Salary slip element not found');
  }

  await waitForRender(element);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    scrollX: 0,
    scrollY: -window.scrollY,
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  const imgData = canvas.toDataURL('image/png', 1.0);
  const imgHeight = (canvas.height * printableWidth) / canvas.width;

  if (imgHeight <= printableHeight) {
    pdf.addImage(imgData, 'PNG', margin, margin, printableWidth, imgHeight, undefined, 'FAST');
    return pdf;
  }

  const scaleFactor = printableHeight / imgHeight;
  const finalWidth = printableWidth * scaleFactor;
  const finalHeight = printableHeight;
  const xOffset = margin + (printableWidth - finalWidth) / 2;

  pdf.addImage(imgData, 'PNG', xOffset, margin, finalWidth, finalHeight, undefined, 'FAST');
  return pdf;
};

export const downloadSalarySlipPdf = async (pdfDoc, filename = 'salary-slip.pdf') => {
  if (!pdfDoc) {
    throw new Error('PDF has not been generated yet');
  }
  pdfDoc.save(filename);
};

export const getPdfBase64 = (pdfDoc) => {
  if (!pdfDoc) {
    throw new Error('PDF has not been generated yet');
  }
  return pdfDoc.output('datauristring');
};

export const printSalarySlip = () => {
  window.print();
};
