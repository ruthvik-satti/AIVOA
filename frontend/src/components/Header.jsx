import React from "react";

export function Header({ onReset, hasData }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo-container">
          <div className="header-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="brand-badge">QA-AI</div>
        </div>
        <div className="header-title-block">
          <div className="header-title-row">
            <h1>AIVOA Pharma QA Copilot</h1>
            <span className="compliance-tag">cGMP / 21 CFR Part 11</span>
          </div>
          <p className="header-subtitle">
            AI-Powered Customer Complaint Intake, Structured Extraction & Risk Intelligence
          </p>
        </div>
      </div>

      <div className="header-meta">
        <div className="system-status-indicator">
          <span className="status-pulse-dot" />
          <span className="status-label">Groq Llama 3.3 70B</span>
        </div>

        {hasData && (
          <button 
            className="btn-header-reset" 
            onClick={onReset}
            title="Clear current complaint and start fresh"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            New Complaint
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
