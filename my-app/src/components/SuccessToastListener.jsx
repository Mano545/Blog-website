import React, { useState, useEffect } from "react";
import SuccessPopup from "./SuccessPopup";

export default function SuccessToastListener() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail?.message || null);
    };
    window.addEventListener("showSuccessToast", handler);
    return () => window.removeEventListener("showSuccessToast", handler);
  }, []);

  if (!message) return null;

  return (
    <SuccessPopup
      message={message}
      onClose={() => setMessage(null)}
    />
  );
}
