import React from 'react';
import ProductCard from '../product-card'; 

interface CategoryContainerProps {
  categoryName: string; 
  products: { 
    productName: string;
    productDescription: string;
    productImage: string;
    productPrice: number; 
  }[];
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({ categoryName, products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="category-container w-full bg-white relative">
        <div className="p-4 mx-12 my-8">
          <h2 className="text-5xl text-black">{categoryName}</h2>
        </div>
        <p className="text-center mt-10">No products available for this category.</p>
      </div>
    );
  }

  return (
    <div className="category-container w-full bg-white relative">
      <div className="p-4 mx-12 my-8">
        <h2 className="text-5xl text-black">{categoryName}</h2>
      </div>
      <div className="flex overflow-x-auto space-x-12 py-4 px-4 items-center justify-center mb-12">
        {products.map((product, index) => (
          <ProductCard 
            key={index} 
            productName={product.productName} 
            productDescription={product.productDescription} 
            productImage={product.productImage}
            productPrice={product.productPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryContainer;










