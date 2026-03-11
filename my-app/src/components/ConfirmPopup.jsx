import React from "react";
import "./Popup.css";

export default function ConfirmPopup({ title, message, onConfirm, onCancel }) {
  return (
    <div className="popup-overlay popup-enter" onClick={onCancel}>
      <div className="popup-box popup-confirm popup-box-enter" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onCancel} aria-label="Close">
          ×
        </button>
        <div className="popup-icon popup-icon-warning">!</div>
        <h3 className="popup-title">{title}</h3>
        <p className="popup-desc">{message}</p>
        <div className="popup-actions">
          <button className="popup-btn popup-btn-primary" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="popup-btn popup-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
