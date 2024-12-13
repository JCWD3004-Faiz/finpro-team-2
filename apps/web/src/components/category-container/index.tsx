// components/CategoryContainer.tsx
import React from 'react';
import ProductCard from '../product-card'; 

interface CategoryContainerProps {
  categoryName: string; 
  products: { 
    productName: string;
    productDescription: string;
    productImage: string;
  }[];
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({ categoryName, products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="category-container w-full bg-white relative">
        {/* Category Name */}
        <div className="p-4 mx-4 my-4">
          <h2 className="text-5xl text-black">{categoryName}</h2>
        </div>
        
        {/* Fallback message when no products */}
        <p className="text-center mt-10">No products available for this category.</p>
      </div>
    );
  }

  return (
    <div className="category-container w-full bg-white relative">
      {/* Category Name */}
      <div className="p-4 mx-4 my-4">
        <h2 className="text-5xl text-black">{categoryName}</h2>
      </div>

      {/* Product Cards Section */}
      <div className="flex overflow-x-auto space-x-4 py-4 px-4">
        {products.map((product, index) => (
          <ProductCard 
            key={index} 
            productName={product.productName} 
            productDescription={product.productDescription} 
            productImage={product.productImage}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryContainer;







