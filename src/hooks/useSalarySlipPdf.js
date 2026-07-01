import { useState, useCallback } from 'react';
import {
  generateSalarySlipPdf,
  downloadSalarySlipPdf,
  getPdfBase64,
  printSalarySlip,
} from '../utils/pdfDownload';

export const useSalarySlipPdf = () => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  const resetPdf = useCallback(() => {
    setPdfDoc(null);
    setPdfReady(false);
  }, []);

  const handleGeneratePdf = useCallback(async () => {
    setGeneratingPdf(true);
    try {
      const pdf = await generateSalarySlipPdf('salary-slip-print');
      setPdfDoc(pdf);
      setPdfReady(true);
      return pdf;
    } finally {
      setGeneratingPdf(false);
    }
  }, []);

  const handleDownloadPdf = useCallback(async (filename) => {
    if (!pdfDoc) {
      throw new Error('Please generate the PDF first');
    }
    setDownloading(true);
    try {
      await downloadSalarySlipPdf(pdfDoc, filename);
    } finally {
      setDownloading(false);
    }
  }, [pdfDoc]);

  const handlePrint = useCallback(async () => {
    if (!pdfReady) {
      throw new Error('Please generate the PDF first');
    }
    setPrinting(true);
    try {
      printSalarySlip();
    } finally {
      setTimeout(() => setPrinting(false), 500);
    }
  }, [pdfReady]);

  const getPdfData = useCallback(() => getPdfBase64(pdfDoc), [pdfDoc]);

  return {
    pdfDoc,
    pdfReady,
    generatingPdf,
    downloading,
    printing,
    resetPdf,
    handleGeneratePdf,
    handleDownloadPdf,
    handlePrint,
    getPdfData,
  };
};
