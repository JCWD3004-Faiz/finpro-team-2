import React from "react";
import { MdErrorOutline } from "react-icons/md";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string | null;
}

function ErrorModal({ isOpen, onClose, errorMessage }: ErrorModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold text-rose-600 mb-4">An Error Occurred</h2>
        <MdErrorOutline className="animate-bounce w-12 h-12 text-rose-600"/>
        <p className="text-gray-700 text-center mt-4">{errorMessage || "Something went wrong. Please try again later."}</p>
        <div className="flex justify-end mt-6">
          <button
            className="bg-rose-600 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal;
