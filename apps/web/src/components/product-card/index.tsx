// components/ProductCard.tsx
import React from 'react';

interface ProductCardProps {
  productName: string; // Name of the product
  productDescription: string; // Description of the product
  productImage: string; // Image URL for the product
}

const ProductCard: React.FC<ProductCardProps> = ({ productName, productDescription, productImage }) => {
  return (
    <div className="product-card w-[20vw] h-[50vh] bg-white shadow-lg overflow-hidden">
      <img 
        src={productImage} 
        alt={productName} 
        className="w-full h-2/3 object-cover" // Make the image cover the upper 2/3 of the card
      />
      <div className="p-4">
        <h3 className="text-xl font-bold">{productName}</h3>
        <p className="text-sm text-gray-600">{productDescription}</p>
      </div>
    </div>
  );
};

export default ProductCard;
