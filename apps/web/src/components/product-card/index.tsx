import React from "react";
import { FaCartArrowDown } from "react-icons/fa6";

interface ProductCardProps {
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  productDescription,
  productImage,
  productPrice,
  onAddToCart,
}) => {
  return (
    <div className="product-card w-[20vw] h-[60vh] bg-white shadow-lg overflow-hidden relative">
      <img 
        src={productImage} 
        alt={productName} 
        className="w-full h-2/3 object-cover" 
      />
      <div className="p-4">
        <h3 className="text-xl font-bold">{productName}</h3>
        <p className="text-sm text-gray-600">{productDescription}</p>
        <p className="text-lg font-semibold text-green-600 mt-2">IDR {productPrice.toLocaleString()}</p>
      </div>
      <FaCartArrowDown
        className="absolute bottom-4 right-4 text-4xl text-black cursor-pointer"
        onClick={onAddToCart}
      />
    </div>
  );
};

export default ProductCard;
