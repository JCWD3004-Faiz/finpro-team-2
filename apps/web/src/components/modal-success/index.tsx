import React from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  successMessage: string | null;
}

function SuccessModal({ isOpen, onClose, successMessage }: SuccessModalProps) {
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold text-green-600 mb-4">
          Success!
        </h2>
        <FaRegCircleCheck className="animate-bounce w-12 h-12 text-green-600" />
        <p className="text-gray-700 text-center mt-4">
          {successMessage || "The operation was completed successfully!"}
        </p>
        <div className="flex justify-end mt-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
