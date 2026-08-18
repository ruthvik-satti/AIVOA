import React, { useRef, useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";

export function CopilotPanel({
  messages,
  complaintText,
  setComplaintText,
  loading,
  progress,
  onAnalyze,
  onEdit,
  hasExistingComplaint,
  errorMessage,
  onDismissError,
  onFileUpload,
  selectedFile,
  onClearFile,
}) {
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  const handleSendSubmit = (e) => {
    e.preventDefault();
    if (!complaintText.trim() || loading) return;
    if (hasExistingComplaint) {
      onEdit();
    } else {
      onAnalyze();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendSubmit(e);
    }
  };

  // Sample prompt helper
  const handleSampleClick = (sampleText) => {
    setComplaintText(sampleText);
    setShowPasteArea(true);
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="reference-right-panel">
      {/* Header */}
      <div className="ref-right-header">
        <div className="ref-right-title-row">
          <div className="ref-sparkle-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
            </svg>
          </div>
          <h2>AI Complaint Intake Assistant</h2>
        </div>
        <span className="ref-beta-badge">BETA</span>
      </div>

      {/* Error Alert Banner if any */}
      {errorMessage && (
        <div className="copilot-error-banner">
          <div className="error-banner-content">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
          {onDismissError && (
            <button className="btn-dismiss-error" onClick={onDismissError} title="Dismiss">
              &times;
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="ref-right-scrollable">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.eml,.json"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Drag & Drop Box / Selected File Indicator */}
        <div
          className={`ref-upload-zone ${dragActive ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => {
            if (!loading) fileInputRef.current?.click();
          }}
        >
          {selectedFile ? (
            <div className="ref-selected-file-display">
              <div className="ref-file-type-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="ref-selected-file-info">
                <span className="ref-file-name" title={selectedFile.name}>{selectedFile.name}</span>
                <span className="ref-file-size">{formatFileSize(selectedFile.size)}</span>
              </div>
              {onClearFile && !loading && (
                <button
                  type="button"
                  className="ref-btn-clear-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFile();
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  title="Remove file"
                >
                  &times;
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="ref-upload-cloud-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
              </div>
              <p className="ref-upload-title">Drag &amp; drop complaint document here</p>
              <p className="ref-upload-subtitle">
                or <span className="ref-upload-link">click to browse</span>
              </p>
            </>
          )}
        </div>

        {/* OR Divider */}
        <div className="ref-or-divider">
          <span>OR</span>
        </div>

        {/* Paste Complaint Text / Email Button */}
        <div className="ref-paste-button-container">
          <button
            type="button"
            className="ref-btn-paste-text"
            onClick={() => setShowPasteArea(!showPasteArea)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            Paste Complaint Text / Email
          </button>
        </div>

        {/* Expandable Text Input if clicked */}
        {showPasteArea && (
          <div className="ref-paste-expanded-area">
            <textarea
              rows={3}
              placeholder="Paste raw email, customer feedback, or complaint details here..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="ref-paste-textarea"
            />
            <div className="ref-paste-actions">
              <button
                type="button"
                className="ref-btn-analyze-now"
                onClick={onAnalyze}
                disabled={loading || !complaintText.trim()}
              >
                {loading ? "Extracting..." : "Process Text"}
              </button>
            </div>
          </div>
        )}

        {/* Supported Formats Info Banner */}
        <div className="ref-info-banner">
          <div className="ref-info-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="ref-info-text">
            <p className="ref-info-line1">Supported formats: PDF, DOCX, TXT, EML</p>
            <p className="ref-info-line2">Max file size: 10MB</p>
          </div>
        </div>

        {/* Extraction Progress Bar */}
        {(loading || progress > 0) && (
          <div className="ref-progress-card">
            <div className="ref-progress-header">
              <span className="ref-progress-title">EXTRACTION PROGRESS</span>
              <span className="ref-progress-percent">{progress || 10}%</span>
            </div>

            <div className="ref-progress-track">
              <div
                className="ref-progress-fill"
                style={{ width: `${progress || (loading ? 65 : 100)}%` }}
              />
            </div>

            <p className="ref-progress-status">
              {loading
                ? `Analyzing document content and extracting key details${selectedFile ? ` for ${selectedFile.name}` : ""}...`
                : "Extraction complete. All fields populated."}
            </p>
            {loading && (
              <p className="ref-progress-substatus">Please wait, this may take a few moments.</p>
            )}
          </div>
        )}

        {/* AI ASSISTANT Conversation Section */}
        <div className="ref-assistant-section">
          <span className="ref-assistant-label">AI ASSISTANT</span>

          <div className="ref-assistant-bubble-card">
            <div className="ref-robot-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="12" rx="4" />
                <path d="M12 2v6" />
                <circle cx="9" cy="13" r="1.5" fill="#2563eb" />
                <circle cx="15" cy="13" r="1.5" fill="#2563eb" />
                <path d="M9 17h6" />
              </svg>
            </div>
            <div className="ref-robot-message">
              Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.
            </div>
          </div>

          {/* Chat History Messages */}
          {messages.length > 1 && (
            <div className="ref-chat-history">
              {messages.slice(1).map((msg, idx) => (
                <ChatMessage key={msg.id || idx} message={msg} />
              ))}
            </div>
          )}

          {/* Quick Demo Templates */}
          {messages.length <= 1 && (
            <div className="ref-quick-chips">
              <span className="ref-chips-label">Demo Scenarios:</span>
              <div className="ref-chips-row">
                <button
                  type="button"
                  className="ref-chip-btn"
                  onClick={() =>
                    handleSampleClick(
                      "Dr. Robert Evans at Metro Health reported that Amoxicillin 500mg (Batch #BX-2049, Mfg: 2024-01-15, Exp: 2026-01-15, Qty: 120 bottles) had yellowish discoloration and caused mild nausea."
                    )
                  }
                >
                  Discoloration (Amoxicillin)
                </button>
                <button
                  type="button"
                  className="ref-chip-btn"
                  onClick={() =>
                    handleSampleClick(
                      "St. Jude Hospital reported 45 vials of Insulin Glargine 100 IU/ml (Batch #IN-8821, Mfg: 2023-11-01, Exp: 2025-11-01) had broken crimp seals with visible leakage."
                    )
                  }
                >
                  Broken Seal (Insulin)
                </button>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Bottom Chat Prompt Input Bar */}
      <div className="ref-right-footer">
        <form onSubmit={handleSendSubmit} className="ref-chat-input-form">
          <input
            type="text"
            placeholder={
              hasExistingComplaint
                ? "Ask a question or provide a correction (e.g. update batch number)..."
                : "Ask me anything about this complaint or enter details..."
            }
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="ref-chat-text-input"
          />

          <button
            type="submit"
            disabled={loading || !complaintText.trim()}
            className="ref-chat-send-btn"
            title="Send"
          >
            {loading ? (
              <span className="ref-btn-spinner" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>

        <p className="ref-disclaimer-text">
          AI responses may contain errors. Please verify information.
        </p>
      </div>
    </div>
  );
}

export default CopilotPanel;
