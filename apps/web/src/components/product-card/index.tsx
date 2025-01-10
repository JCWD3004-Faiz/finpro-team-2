import React from "react";

interface ProductCardProps {
  productName: string;
  productDescription: string;
  productImage: string;
  onClick: () => void; // Add onClick handler prop
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  productDescription,
  productImage,
  onClick, // Destructure the onClick prop
}) => {
  return (
    <div
      className="product-card w-[20vw] h-[55vh] bg-white shadow-lg border border-black overflow-hidden cursor-pointer"
      onClick={onClick} // Add onClick event to the card
    >
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


