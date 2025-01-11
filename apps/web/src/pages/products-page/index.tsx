import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter for routing
import SearchBar from "../../components/search-bar"; 
import ProductCard from "../../components/product-card"; 

const Products: React.FC = () => {

    const vegetablesAndFruits = [
      { productId: 'vf1', productName: 'Apple', productDescription: 'Fresh, crisp apples.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf2', productName: 'Banana', productDescription: 'Ripe bananas from organic farms.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf3', productName: 'Tomato', productDescription: 'Red, juicy tomatoes.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf4', productName: 'Cucumber', productDescription: 'Fresh cucumbers for salads.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf5', productName: 'Carrot', productDescription: 'Crunchy and sweet carrots.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf6', productName: 'Broccoli', productDescription: 'Fresh green broccoli.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf7', productName: 'Spinach', productDescription: 'Organic spinach leaves.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf8', productName: 'Pineapple', productDescription: 'Sweet and tangy pineapples.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf9', productName: 'Peach', productDescription: 'Juicy and sweet peaches.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf10', productName: 'Grapes', productDescription: 'Fresh, seedless grapes.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf11', productName: 'Strawberry', productDescription: 'Sweet and ripe strawberries.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'vf12', productName: 'Watermelon', productDescription: 'Refreshing and juicy watermelon.', productImage: 'https://via.placeholder.com/150' },
    ];
  
    const poultry = [
      { productId: 'p1', productName: 'Chicken Breast', productDescription: 'Lean and tender chicken breast.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p2', productName: 'Chicken Thighs', productDescription: 'Juicy and flavorful chicken thighs.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p3', productName: 'Duck Breast', productDescription: 'Premium quality duck breast.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p4', productName: 'Turkey', productDescription: 'Farm-fresh turkey meat.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p5', productName: 'Quail', productDescription: 'Small, tender quail meat.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p6', productName: 'Goose Breast', productDescription: 'Delicious and tender goose breast.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p7', productName: 'Chicken Wings', productDescription: 'Perfect for grilling.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p8', productName: 'Cornish Hen', productDescription: 'Small, tender Cornish hen.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p9', productName: 'Chicken Drumsticks', productDescription: 'Juicy, flavorful chicken drumsticks.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p10', productName: 'Chicken Sausages', productDescription: 'Seasoned chicken sausages.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p11', productName: 'Duck Legs', productDescription: 'Succulent duck legs.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'p12', productName: 'Turkey Bacon', productDescription: 'Healthy and tasty turkey bacon.', productImage: 'https://via.placeholder.com/150' },
    ];
  
    const dairy = [
      { productId: 'd1', productName: 'Cottage Cheese', productDescription: 'Fresh, delicate Cottage Cheese', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd2', productName: 'Hazelnut Milk', productDescription: 'Freshly squeezed from our natural grown hazelnuts.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd3', productName: 'Whole Milk', productDescription: 'For your baking needs.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd4', productName: 'Yoghurt', productDescription: 'Freshly made daily.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd5', productName: 'Cheddar Cheese', productDescription: 'Aged cheddar cheese.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd6', productName: 'Almond Milk', productDescription: 'Nutritious almond milk.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd7', productName: 'Butter', productDescription: 'Creamy, fresh butter.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd8', productName: 'Feta Cheese', productDescription: 'Creamy and tangy feta cheese.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd9', productName: 'Ricotta Cheese', productDescription: 'Fresh ricotta cheese.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd10', productName: 'Cream Cheese', productDescription: 'Smooth and tangy cream cheese.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd11', productName: 'Gouda Cheese', productDescription: 'Mild and creamy gouda cheese.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'd12', productName: 'Mozzarella Cheese', productDescription: 'Fresh mozzarella cheese.', productImage: 'https://via.placeholder.com/150' },
    ];
  
    const bakedGoods = [
      { productId: 'bg1', productName: 'Croissant', productDescription: 'Buttery, flaky croissants.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg2', productName: 'Baguette', productDescription: 'Crispy on the outside, soft on the inside.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg3', productName: 'Sourdough Bread', productDescription: 'Freshly baked, tangy sourdough.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg4', productName: 'Blueberry Muffin', productDescription: 'Soft, moist blueberry muffins.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg5', productName: 'Cinnamon Roll', productDescription: 'Warm cinnamon rolls with icing.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg6', productName: 'Chocolate Chip Cookie', productDescription: 'Chewy and loaded with chocolate chips.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg7', productName: 'Apple Pie', productDescription: 'Classic homemade apple pie.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg8', productName: 'Pumpkin Bread', productDescription: 'Moist pumpkin bread with spices.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg9', productName: 'Bagel', productDescription: 'Soft bagels with a golden crust.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg10', productName: 'Pecan Pie', productDescription: 'Delicious, nutty pecan pie.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg11', productName: 'Cheese Danish', productDescription: 'Flaky pastry with creamy cheese filling.', productImage: 'https://via.placeholder.com/150' },
      { productId: 'bg12', productName: 'Lemon Pound Cake', productDescription: 'Tangy and moist lemon pound cake.', productImage: 'https://via.placeholder.com/150' },
    ];
  
    const allProducts = [
      ...vegetablesAndFruits,
      ...poultry,
      ...dairy,
      ...bakedGoods,
    ];

  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const router = useRouter();

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = category === 'all' || product.productId.startsWith(category);
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (category: string) => {
    setCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (productId: string) => {
    const selectedProduct = allProducts.find((product) => product.productId === productId);
    if (selectedProduct) {
      router.push(
        `/products-page/product-details-page/${productId}`
      );
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
        onCategoryClick={handleCategoryClick} 
      />
      
      <div className="w-full grid grid-cols-4 gap-x-10 gap-y-20 my-[15vh] p-4 justify-items-center items-center">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.productId}
            productName={product.productName}
            productDescription={product.productDescription}
            productImage={product.productImage}
            onClick={() => handleProductClick(product.productId)} // Pass onClick handler here
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
