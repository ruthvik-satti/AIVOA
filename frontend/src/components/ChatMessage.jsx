import React from "react";
import RiskBadge from "./RiskBadge";

export function ChatMessage({ message }) {
  const isUser = message.sender === "user";
  const isError = message.type === "error";

  if (isError) {
    return (
      <div className="chat-msg-row chat-msg-error">
        <div className="msg-avatar error-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="msg-bubble error-bubble">
          <div className="msg-header">
            <span className="msg-sender-name">System Error</span>
            <span className="msg-time">{message.timestamp}</span>
          </div>
          <div className="msg-body">{message.text}</div>
          {message.details && (
            <div className="msg-error-details">
              <code>{message.details}</code>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-msg-row ${isUser ? "chat-msg-user" : "chat-msg-ai"}`}>
      <div className={`msg-avatar ${isUser ? "user-avatar" : "ai-avatar"}`}>
        {isUser ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <rect x="3" y="8" width="18" height="12" rx="4" />
            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
            <circle cx="15" cy="13" r="1.5" fill="currentColor" />
            <path d="M9 17h6" />
          </svg>
        )}
      </div>

      <div className={`msg-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
        <div className="msg-header">
          <span className="msg-sender-name">
            {isUser ? "QA Operator" : "AIVOA Copilot"}
          </span>
          <span className="msg-time">{message.timestamp}</span>
        </div>

        <div className="msg-body">
          <p>{message.text}</p>
        </div>

        {/* Rich Copilot extraction summary card */}
        {!isUser && message.extractedData && (
          <div className="msg-extraction-card">
            <div className="msg-extraction-header">
              <span className="extraction-title">Extracted Complaint Summary</span>
              {message.extractedData.risk_assessment?.severity && (
                <RiskBadge severity={message.extractedData.risk_assessment.severity} size="small" />
              )}
            </div>

            <div className="msg-meta-grid">
              {message.extractedData.product_name && (
                <div className="msg-meta-item">
                  <span className="meta-label">Product:</span>
                  <span className="meta-val">
                    {message.extractedData.product_name} {message.extractedData.strength || ""}
                  </span>
                </div>
              )}
              {message.extractedData.batch_number && (
                <div className="msg-meta-item">
                  <span className="meta-label">Batch:</span>
                  <span className="meta-val font-mono">{message.extractedData.batch_number}</span>
                </div>
              )}
              {message.extractedData.customer_name && (
                <div className="msg-meta-item">
                  <span className="meta-label">Customer:</span>
                  <span className="meta-val">{message.extractedData.customer_name}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
