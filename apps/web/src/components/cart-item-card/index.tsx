import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

interface CartItemProps {
  imageSrc: string;
  name: string;
  description: string;
  price: number;
  quantity: number; // Added quantity to the interface
}

const CartItemCard: React.FC<CartItemProps> = ({ imageSrc, name, description, price, quantity }) => {
  return (
    <div className="flex items-center border border-black p-4 shadow-lg w-full">
      {/* Image Section */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover border border-black"
        />
      </div>

      {/* Item Details Section */}
      <div className="flex-grow ml-4">
        {/* Name and Description */}
        <h2 className="text-lg font-bold mb-2">{name}</h2>
        <p className="text-sm text-gray-600 mb-2">{description}</p>

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">IDR {price.toLocaleString()}</span>
          <div className="flex items-center gap-2">
            <button className="p-1 border border-black rounded">
              <AiOutlineMinus />
            </button>
            <span className="px-2">{quantity}</span>
            <button className="p-1 border border-black rounded">
              <AiOutlinePlus />
            </button>
          </div>
        </div>
      </div>

      {/* Remove Item Button */}
      <button className="ml-4 text-black text-2xl" title="Remove Item">
        <IoCloseSharp />
      </button>
    </div>
  );
};

export default CartItemCard;
