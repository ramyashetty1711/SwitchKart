import React, { useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";

const WIDTH_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

const Modal = ({
  isOpen,
  onClose,
  onHide,
  title,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-1500 flex items-center rounded-lg justify-center bg-black/50 bg-opacity-50"
      onClick={onHide}
    >
      <div
        className={`bg-white dark:bg-black  w-full ${WIDTH_MAP[size]} mx-4 rounded-lg shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b py-2 px-4">
          {title}
          <button
            onClick={onClose}
            className=" !bg-white hover:!bg-red-500 hover:!text-white text-xl text-red-500 duration-300 transition-all !w-fit !px-1 !py-1 !outline-none focus:!outline-none"
          >
            {/* &times; */}
            <IoIosCloseCircle size={30} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t p-4 bg-gray-50 rounded-b-lg">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
