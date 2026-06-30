import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const downloadSalarySlipPdf = async (
  elementId,
  filename = "salary-slip.pdf",
) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Salary slip element not found");
  }

  // Wait for full render stability (VERY IMPORTANT for modals)
  await new Promise(requestAnimationFrame);
  await new Promise((r) => setTimeout(r, 300));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;

  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);

  heightLeft -= contentHeight;

  // Next pages (correct slicing logic)
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      margin,
      position + margin,
      contentWidth,
      imgHeight,
    );

    heightLeft -= contentHeight;
  }

  pdf.save(filename);
};
