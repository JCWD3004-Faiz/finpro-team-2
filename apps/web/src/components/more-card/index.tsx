import React from "react";

interface ProductCardProps {
  onClickMore: () => void;
}

const MoreCard: React.FC<ProductCardProps> = ({ onClickMore }) => {
  return (
    <div className="product-card w-[20vw] h-[55vh] bg-white shadow-lg border border-black overflow-hidden relative flex justify-center items-center">
      <span 
        className="text-2xl font-bold text-black cursor-pointer" 
        onClick={onClickMore}
      >
        More
      </span>
    </div>
  );
};

export default MoreCard;
