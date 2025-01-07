import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ExtraBoxProps {
  isVisible: boolean;
  onClose: () => void;
}

const ExtraBox: React.FC<ExtraBoxProps> = ({ isVisible, onClose }) => {
  return (
    <div
      className={`extra-box ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } fixed top-0 left-0 w-[60vw] h-full bg-white text-black shadow-lg transition-transform duration-500 z-50`}
    >
      {/* Close Icon */}
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={onClose}
      >
        <AiOutlineClose size={24} />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-4 mt-16 px-6">
        <span className="cursor-pointer">Home</span>
        <span className="cursor-pointer">Products</span>
        <span className="cursor-pointer">About</span>
      </div>
    </div>
  );
};

export default ExtraBox;
