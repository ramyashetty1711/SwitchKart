
import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { createPortal } from "react-dom";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    ({ type = "success", heading = "", message = "" }) => {
      setToast({ type, heading, message });

      setTimeout(() => {
        setToast(null);
      }, 3000); // Hide after 3s
    },
    []
  );

  const toastStyles = {
    success: {
      bg: "bg-green-100 border-green-400 text-green-700",
      icon: <FiCheckCircle className="text-green-600 text-xl mr-2" />,
    },
    error: {
      bg: "bg-red-100 border-red-400 text-red-700",
      icon: <FiXCircle className="text-red-600 text-xl mr-2" />,
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {createPortal(
        toast && (
          <div className="fixed top-5 right-5 z-50000">
            <div className="min-w-[300px] w-full shadow-lg rounded-lg overflow-hidden animate-fade-in bg-white border border-gray-400">
              {/* Header with colored background */}
              <div
                className={`flex items-center px-4 py-2 font-semibold text-base ${
                  toast.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {toastStyles[toast.type].icon}
                {toast.heading}
              </div>

              {/* Body with white background */}
              <div className="px-4 py-3 text-sm text-gray-700 bg-white">
                {toast.message}
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </ToastContext.Provider>
  );
}
