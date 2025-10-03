"use client";

import { useEffect, useState } from "react";

type FloatingErrorProps = {
  message: string;
  duration?: number; // milliseconds
  onClose?: () => void;
};

export default function FloatingError({
  message,
  duration = 4000,
  onClose,
}: FloatingErrorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 transform -translate-x-1/2">
      <div
        className="bg-red-600 bg-opacity-90 text-white px-6 py-3 rounded-xl shadow-lg animate-rise"
        style={{ animationDuration: `${duration}ms` }}
      >
        {message}
      </div>

      <style jsx>{`
        @keyframes rise {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(100%);
          }
        }
        .animate-rise {
          animation-name: rise;
          animation-timing-function: ease;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
