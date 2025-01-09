import React from "react";

interface ProductCardProps {
  productName: string;
  productDescription: string;
  productImage: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  productDescription,
  productImage,
}) => {
  return (
    <div className="product-card w-[20vw] h-[55vh] bg-white shadow-lg border border-black overflow-hidden">
      <img 
        src={productImage} 
        alt={productName} 
        className="w-full h-2/3 object-cover" 
      />
      <div className="p-4">
        <h3 className="text-xl font-bold">{productName}</h3>
        <p className="text-sm text-gray-600">{productDescription}</p>
      </div>
    </div>
  );
};

export default ProductCard;

