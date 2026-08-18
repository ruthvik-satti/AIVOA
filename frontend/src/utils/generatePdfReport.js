import { jsPDF } from "jspdf";

export function generatePdfReport(complaint) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  const val = (v) => {
    if (!v || typeof v !== "string" || !v.trim()) return "Not available";
    return v.trim();
  };

  const now = new Date();
  const reportDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const reportTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let currentY = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Deep Navy (#0f172a)
  doc.rect(margin, currentY, contentWidth, 54, "F");

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("AIVOA Pharma QA — Customer Complaint Report", margin + 14, currentY + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text("Official Quality Assurance Audit Record • cGMP & 21 CFR Part 11 Format", margin + 14, currentY + 38);

  // Reference Code & Date in Top Right
  const batchNum = val(complaint.batch_number);
  const refCode = batchNum !== "Not available" ? `REF: ${batchNum}` : `REF: QA-${now.getTime().toString().slice(-6)}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248); // Sky blue
  doc.text(refCode, pageWidth - margin - 14, currentY + 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${reportDate} ${reportTime}`, pageWidth - margin - 14, currentY + 38, { align: "right" });

  currentY += 68;

  // Helper function to draw Section Header
  const drawSectionHeader = (title) => {
    doc.setFillColor(241, 245, 249); // Slate 100
    doc.rect(margin, currentY, contentWidth, 20, "F");
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, currentY, contentWidth, 20, "S");

    doc.setTextColor(30, 41, 59); // Slate 800
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(title, margin + 8, currentY + 14);

    currentY += 24;
  };

  // Helper function to draw 2-column key-value row
  const drawTwoColRow = (label1, val1, label2, val2) => {
    const colWidth = (contentWidth - 10) / 2;
    const rowHeight = 28;

    // Col 1 Box
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, currentY, colWidth, rowHeight, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, colWidth, rowHeight, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label1.toUpperCase(), margin + 8, currentY + 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(val1, margin + 8, currentY + 23);

    // Col 2 Box
    if (label2) {
      const col2X = margin + colWidth + 10;
      doc.setFillColor(248, 250, 252);
      doc.rect(col2X, currentY, colWidth, rowHeight, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(col2X, currentY, colWidth, rowHeight, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(label2.toUpperCase(), col2X + 8, currentY + 11);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(val2, col2X + 8, currentY + 23);
    }

    currentY += rowHeight + 4;
  };

  // Helper function to draw Full-Width Text Block (Description / Risk)
  const drawFullWidthBlock = (label, textValue, customBg = null, customBorder = null) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const splitText = doc.splitTextToSize(textValue, contentWidth - 16);
    const textHeight = Math.max(splitText.length * 12 + 20, 36);

    doc.setFillColor(customBg ? customBg[0] : 248, customBg ? customBg[1] : 250, customBg ? customBg[2] : 252);
    doc.rect(margin, currentY, contentWidth, textHeight, "F");
    doc.setDrawColor(customBorder ? customBorder[0] : 226, customBorder ? customBorder[1] : 232, customBorder ? customBorder[2] : 240);
    doc.rect(margin, currentY, contentWidth, textHeight, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label.toUpperCase(), margin + 8, currentY + 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(splitText, margin + 8, currentY + 23);

    currentY += textHeight + 6;
  };

  // 1. ORIGIN & CUSTOMER DETAILS
  drawSectionHeader("1. ORIGIN & CUSTOMER DETAILS");
  drawTwoColRow(
    "Complaint Source",
    val(complaint.complaint_source),
    "Customer Name",
    val(complaint.customer_name)
  );

  currentY += 4;

  // 2. PRODUCT & BATCH IDENTIFICATION
  drawSectionHeader("2. PRODUCT & BATCH IDENTIFICATION");
  drawTwoColRow(
    "Product Name",
    val(complaint.product_name),
    "Product Strength / Grade",
    val(complaint.strength)
  );
  drawTwoColRow(
    "Batch / Lot Number",
    val(complaint.batch_number),
    "Manufacturing Date",
    val(complaint.manufacturing_date)
  );
  drawTwoColRow(
    "Expiry Date",
    val(complaint.expiry_date),
    "Quantity Affected",
    val(complaint.affected_quantity)
  );

  currentY += 4;

  // 3. COMPLAINT DETAILS
  drawSectionHeader("3. COMPLAINT DETAILS");
  drawTwoColRow(
    "Complaint Type",
    val(complaint.complaint_type),
    "Complaint Date",
    val(complaint.complaint_date)
  );
  drawFullWidthBlock(
    "Detailed Complaint Description",
    val(complaint.complaint_description)
  );

  currentY += 4;

  // 4. INITIAL ASSESSMENT & PRIORITY
  drawSectionHeader("4. INITIAL ASSESSMENT & PRIORITY");

  const severityVal = val(complaint.risk_assessment?.severity);
  const priorityVal = val(complaint.risk_assessment?.priority);

  drawTwoColRow(
    "Initial Severity",
    severityVal,
    "Priority Level",
    priorityVal
  );

  drawFullWidthBlock(
    "Initial Risk Analysis",
    val(complaint.risk_assessment?.initial_risk)
  );

  drawFullWidthBlock(
    "Suggested Next Action (SOP)",
    val(complaint.risk_assessment?.suggested_next_action),
    [240, 249, 255], // Soft blue tint
    [186, 230, 253]  // Sky blue border
  );

  // Footer Disclaimer & Page Numbering
  const footerY = pageHeight - margin - 24;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("AI-Assisted Assessment Notice:", margin, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This document contains AI-extracted complaint details and risk evaluations. Please verify all information against original source records in accordance with standard operating procedures (SOP).",
    margin,
    footerY + 9
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("AIVOA PHARMA QA SYSTEM • CONFIDENTIAL & PROPRIETARY", margin, footerY + 22);
  doc.text("Page 1 of 1", pageWidth - margin, footerY + 22, { align: "right" });

  // Generate clean filename
  const cleanId = (
    complaint.batch_number ||
    complaint.product_name ||
    now.toISOString().slice(0, 10).replace(/-/g, "")
  )
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .toUpperCase();

  const filename = `AIVOA_Complaint_Report_${cleanId || "RECORD"}.pdf`;

  // Download PDF directly from browser
  doc.save(filename);
}

export default generatePdfReport;
