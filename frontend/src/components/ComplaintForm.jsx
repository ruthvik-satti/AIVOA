import React, { useState } from "react";
import generatePdfReport from "../utils/generatePdfReport";

export function ComplaintForm({ complaint, onReset }) {
  const [downloadStatus, setDownloadStatus] = useState(null);

  const hasData = Boolean(
    complaint.customer_name ||
    complaint.product_name ||
    complaint.batch_number ||
    complaint.complaint_description ||
    complaint.risk_assessment?.severity
  );

  const severity = complaint.risk_assessment?.severity || "";
  const priority = complaint.risk_assessment?.priority || "";

  const handleDownloadClick = () => {
    if (!hasData) return;
    try {
      generatePdfReport(complaint);
      setDownloadStatus("downloaded");
      setTimeout(() => setDownloadStatus(null), 2500);
    } catch (err) {
      console.error("PDF Generation error:", err);
    }
  };

  return (
    <div className="reference-left-panel">
      {/* Top Header */}
      <div className="ref-panel-header">
        <div>
          <h2 className="ref-panel-title">Log Customer Complaint</h2>
          <p className="ref-panel-subtitle">API &amp; FDF Quality Assurance Module</p>
        </div>

        <div className="ref-triage-badge-container">
          <span className={`ref-triage-badge ${hasData ? "triaged" : "pending"}`}>
            {hasData
              ? `Triaged • ${severity || "Evaluated"}`
              : "Pending Triage"}
          </span>
        </div>
      </div>

      <div className="ref-form-scrollable">
        {/* SECTION 1: ORIGIN & CUSTOMER DETAILS */}
        <div className="ref-form-section">
          <h3 className="ref-section-heading">1. ORIGIN &amp; CUSTOMER DETAILS</h3>
          <div className="ref-grid-2col">
            <div className="ref-field-group">
              <label htmlFor="complaint_source">Complaint Source</label>
              <input
                id="complaint_source"
                type="text"
                value={complaint.complaint_source || ""}
                placeholder="Awaiting AI extraction..."
                readOnly
                className="ref-input"
              />
            </div>

            <div className="ref-field-group">
              <label htmlFor="customer_name">Customer Name</label>
              <input
                id="customer_name"
                type="text"
                value={complaint.customer_name || ""}
                placeholder="Awaiting AI extraction..."
                readOnly
                className="ref-input"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PRODUCT & BATCH IDENTIFICATION */}
        <div className="ref-form-section">
          <h3 className="ref-section-heading">2. PRODUCT &amp; BATCH IDENTIFICATION</h3>
          <div className="ref-grid-2col">
            <div className="ref-field-group">
              <label htmlFor="product_name">Product Name</label>
              <input
                id="product_name"
                type="text"
                value={complaint.product_name || ""}
                placeholder="Awaiting AI extraction..."
                readOnly
                className="ref-input"
              />
            </div>

            <div className="ref-field-group">
              <label htmlFor="strength">Product Strength/Grade</label>
              <input
                id="strength"
                type="text"
                value={complaint.strength || ""}
                placeholder="Awaiting AI extraction..."
                readOnly
                className="ref-input"
              />
            </div>

            <div className="ref-field-group">
              <label htmlFor="batch_number">Batch/Lot Number</label>
              <input
                id="batch_number"
                type="text"
                value={complaint.batch_number || ""}
                placeholder="Awaiting AI extraction..."
                readOnly
                className="ref-input font-mono"
              />
            </div>

            <div className="ref-field-group">
              <label htmlFor="manufacturing_date">Manufacturing Date</label>
              <div className="ref-input-icon-wrapper">
                <input
                  id="manufacturing_date"
                  type="text"
                  value={complaint.manufacturing_date || ""}
                  placeholder="Awaiting AI extraction..."
                  readOnly
                  className="ref-input has-icon"
                />
                <span className="ref-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="ref-field-group">
              <label htmlFor="expiry_date">Expiry Date</label>
              <div className="ref-input-icon-wrapper">
                <input
                  id="expiry_date"
                  type="text"
                  value={complaint.expiry_date || ""}
                  placeholder="Awaiting AI extraction..."
                  readOnly
                  className="ref-input has-icon"
                />
                <span className="ref-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="ref-field-group">
              <label htmlFor="affected_quantity">Quantity Affected</label>
              <div className="ref-input-suffix-wrapper">
                <input
                  id="affected_quantity"
                  type="text"
                  value={complaint.affected_quantity || ""}
                  placeholder="Awaiting AI extraction..."
                  readOnly
                  className="ref-input has-suffix"
                />
                <span className="ref-input-suffix">
                  {complaint.affected_quantity?.includes("kg") ? "kg" : "units"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: COMPLAINT DETAILS */}
        <div className="ref-form-section">
          <h3 className="ref-section-heading">3. COMPLAINT DETAILS</h3>
          <div className="ref-grid-2col">
            <div className="ref-field-group">
              <label htmlFor="complaint_type">Complaint Type</label>
              <input
                id="complaint_type"
                type="text"
                value={complaint.complaint_type || ""}
                placeholder="Awaiting AI extraction..."
                readOnly
                className="ref-input"
              />
            </div>

            <div className="ref-field-group">
              <label htmlFor="complaint_date">Complaint Date</label>
              <div className="ref-input-icon-wrapper">
                <input
                  id="complaint_date"
                  type="text"
                  value={complaint.complaint_date || ""}
                  placeholder="Awaiting AI extraction..."
                  readOnly
                  className="ref-input has-icon"
                />
                <span className="ref-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="ref-field-group full-width">
              <label htmlFor="complaint_description">Detailed Complaint Description</label>
              <textarea
                id="complaint_description"
                rows={3}
                value={complaint.complaint_description || ""}
                placeholder="Awaiting AI extraction..."
                readOnly
                className="ref-textarea"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: INITIAL ASSESSMENT & PRIORITY */}
        <div className="ref-form-section">
          <h3 className="ref-section-heading">4. INITIAL ASSESSMENT &amp; PRIORITY</h3>
          <div className="ref-grid-2col">
            <div className="ref-field-group">
              <label htmlFor="initial_severity">Initial Severity</label>
              <div className="ref-select-wrapper">
                <input
                  id="initial_severity"
                  type="text"
                  value={severity || ""}
                  placeholder="Awaiting AI extraction..."
                  readOnly
                  className={`ref-input ref-select-input ${
                    severity.toLowerCase().includes("high") || severity.toLowerCase().includes("critical")
                      ? "severity-high"
                      : severity.toLowerCase().includes("medium")
                      ? "severity-medium"
                      : severity.toLowerCase().includes("low")
                      ? "severity-low"
                      : ""
                  }`}
                />
                <span className="ref-select-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="ref-field-group">
              <label htmlFor="priority">Priority</label>
              <div className="ref-select-wrapper">
                <input
                  id="priority"
                  type="text"
                  value={priority || ""}
                  placeholder="Awaiting AI extraction..."
                  readOnly
                  className="ref-input ref-select-input font-medium"
                />
                <span className="ref-select-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Optional Risk & Action summary cards if available */}
          {(complaint.risk_assessment?.initial_risk || complaint.risk_assessment?.suggested_next_action) && (
            <div className="ref-risk-details-block">
              {complaint.risk_assessment?.initial_risk && (
                <div className="ref-risk-subcard">
                  <span className="ref-subcard-label">Initial Risk Analysis:</span>
                  <p>{complaint.risk_assessment.initial_risk}</p>
                </div>
              )}
              {complaint.risk_assessment?.suggested_next_action && (
                <div className="ref-risk-subcard action-subcard">
                  <span className="ref-subcard-label">Suggested Next Action (SOP):</span>
                  <p>{complaint.risk_assessment.suggested_next_action}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="ref-form-footer">
        <button
          type="button"
          className="ref-btn-reset"
          onClick={onReset}
          title="Reset and clear all complaint fields"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Reset Form
        </button>

        <button
          type="button"
          className={`ref-btn-save ${downloadStatus === "downloaded" ? "btn-saved" : ""}`}
          onClick={handleDownloadClick}
          disabled={!hasData}
          title="Generate and download AIVOA Pharma QA PDF report"
        >
          {downloadStatus === "downloaded" ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Report Downloaded
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ComplaintForm;
