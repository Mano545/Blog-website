import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import "./Popup.css";

const VISIBLE_DURATION = 1200;
const EXIT_DURATION = 250;

export default function SuccessPopup({ message, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => onClose?.(), EXIT_DURATION);
    }, VISIBLE_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`popup-overlay popup-success-overlay ${isClosing ? "popup-exit" : "popup-enter"}`}>
      <div className={`popup-box popup-success ${isClosing ? "popup-box-exit" : "popup-box-enter"}`}>
        <div className="popup-success-icon">
          <Check size={48} strokeWidth={3} />
        </div>
        <p className="popup-message">{message}</p>
      </div>
    </div>
  );
}
