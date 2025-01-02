import React, { useState } from "react";
import dynamic from "next/dynamic";
import CategoryContainer from "../components/category-container";
import ShoppingCart from "../components/shopping-cart";

// Dynamically load Swiper
const HeroBanner = dynamic(() => import('../components/hero-banner'), { ssr: false });

const Home: React.FC = () => {
  const [cartItems, setCartItems] = useState<
    { productId: string; productName: string; productPrice: number }[]
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const vegetablesAndFruits = [
    {
      productId: 'vf1',
      productName: 'Apple',
      productDescription: 'Fresh, crisp apples.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 20000,
    },
    {
      productId: 'vf2',
      productName: 'Banana',
      productDescription: 'Ripe bananas from organic farms.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 15000,
    },
    {
      productId: 'vf3',
      productName: 'Tomato',
      productDescription: 'Red, juicy tomatoes.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 10000,
    },
    {
      productId: 'vf4',
      productName: 'Cucumber',
      productDescription: 'Fresh cucumbers for salads.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 8000,
    },
  ];

  const poultry = [
    {
      productId: 'p1',
      productName: 'Chicken Breast',
      productDescription: 'Lean and tender chicken breast.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 50000,
    },
    {
      productId: 'p2',
      productName: 'Chicken Thighs',
      productDescription: 'Juicy and flavorful chicken thighs.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 40000,
    },
    {
      productId: 'p3',
      productName: 'Duck Breast',
      productDescription: 'Premium quality duck breast.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 70000,
    },
    {
      productId: 'p4',
      productName: 'Turkey',
      productDescription: 'Farm-fresh turkey meat.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 90000,
    },
  ];

  const addToCart = (product: {
    productId: string;
    productName: string;
    productPrice: number;
  }) => {
    console.log("Products:", product);
    setCartItems((prev) => [...prev, product]);
  };

   console.log("Cart:", cartItems);

  return (
    <div className="flex flex-col mt-[11vh]">
      {/* Hero Banner Section */}
      <div className="w-full">
        <HeroBanner />
      </div>

      {/* Category Sections */}
      <div className="flex flex-col">
        <CategoryContainer
          categoryName="Vegetables & Fruits"
          products={vegetablesAndFruits.map((product) => ({
            ...product,
            addToCart,
          }))}
        />
        <CategoryContainer
          categoryName="Poultry"
          products={poultry.map((product) => ({
            ...product,
            addToCart,
          }))}
        />
      </div>

      {/* Shopping Cart */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />
    </div>
  );
};

export default Home;


