import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import "./Popup.css";

const EXIT_DURATION = 250;

export default function ErrorPopup({ title = "Something went wrong?", message, onClose, duration = 2000 }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose?.(), EXIT_DURATION);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => onClose?.(), EXIT_DURATION);
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`popup-overlay popup-error-overlay ${isClosing ? "popup-exit" : "popup-enter"}`}>
      <div className={`popup-box popup-error ${isClosing ? "popup-box-exit" : "popup-box-enter"}`}>
        <button className="popup-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        <div className="popup-error-icon">
          <AlertTriangle size={40} strokeWidth={2.5} />
        </div>
        <h3 className="popup-title">{title}</h3>
        <p className="popup-desc popup-error-desc">{message}</p>
      </div>
    </div>
  );
}
