import React from "react";

export function RiskBadge({ severity, size = "large" }) {
  const normalized = (severity || "").trim().toLowerCase();

  let badgeClass = "risk-badge-awaiting";
  let label = "Awaiting Assessment";
  let dotColor = "#94a3b8";
  let icon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );

  if (normalized.includes("high") || normalized.includes("critical")) {
    badgeClass = "risk-badge-high";
    label = "High Severity Risk";
    dotColor = "#ef4444";
    icon = (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  } else if (normalized.includes("medium") || normalized.includes("moderate")) {
    badgeClass = "risk-badge-medium";
    label = "Medium Severity Risk";
    dotColor = "#f59e0b";
    icon = (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  } else if (normalized.includes("low") || normalized.includes("minor")) {
    badgeClass = "risk-badge-low";
    label = "Low Severity Risk";
    dotColor = "#10b981";
    icon = (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }

  return (
    <div className={`risk-badge ${badgeClass} risk-badge-${size}`}>
      <span className="risk-badge-dot" style={{ backgroundColor: dotColor }} />
      <span className="risk-badge-icon">{icon}</span>
      <span className="risk-badge-text">
        {severity ? severity.toUpperCase() : label}
      </span>
    </div>
  );
}

export default RiskBadge;
