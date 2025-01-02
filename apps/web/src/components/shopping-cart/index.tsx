import React from "react";
import { IoCloseSharp } from "react-icons/io5";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { productId: string; productName: string; productPrice: number }[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  cartItems,
}) => {
  const totalAmount = cartItems.reduce((total, item) => total + item.productPrice, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 h-full w-full bg-black opacity-40 z-50"
          onClick={onClose}
        />
      )}

      {/* Shopping Cart */}
      <div
        className={`fixed top-0 right-0 h-full w-[30vw] bg-white shadow-lg z-50 p-8 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header Section */}
        <div className="mb-6 border-b border-black pb-4 -mx-8 px-8">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            {/* Close Button */}
            <button
              className="text-black text-3xl font-bold cursor-pointer"
              onClick={onClose}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.productId} className="flex justify-between">
                  <span>{item.productName}</span>
                  <span>IDR {item.productPrice.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Total */}
        <div className="mt-6 border-t border-black pt-4">
          <p className="text-lg font-bold">
            Total: IDR {totalAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;

