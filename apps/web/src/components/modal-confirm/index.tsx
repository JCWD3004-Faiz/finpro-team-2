import React from "react";
import { FaCircleExclamation } from "react-icons/fa6";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold text-indigo-600 mb-4">Confirmation</h2>
        <FaCircleExclamation className="animate-bounce w-12 h-12 text-indigo-600" />
        <p className="text-gray-700 text-center mt-4">{message}</p>
        <div className="flex justify-evenly mt-6 w-full">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
