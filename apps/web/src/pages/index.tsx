import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import CategoryContainer from '../components/category-container'; // Import the CategoryContainer
import ShoppingCart from '../components/shopping-cart'; // Import the ShoppingCart
import CartItemCard from '../components/cart-item-card'; // Import the CartItemCard

// Dynamically load Swiper
const HeroBanner = dynamic(() => import('../components/hero-banner'), { ssr: false });

const Home: React.FC = () => {
  const vegetablesAndFruits = [
    {
      productName: 'Apple',
      productDescription: 'Fresh, crisp apples.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 20000,
    },
    {
      productName: 'Banana',
      productDescription: 'Ripe bananas from organic farms.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 15000,
    },
    {
      productName: 'Tomato',
      productDescription: 'Red, juicy tomatoes.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 10000,
    },
    {
      productName: 'Cucumber',
      productDescription: 'Fresh cucumbers for salads.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 8000,
    },
  ];

  const poultry = [
    {
      productName: 'Chicken Breast',
      productDescription: 'Lean and tender chicken breast.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 50000,
    },
    {
      productName: 'Chicken Thighs',
      productDescription: 'Juicy and flavorful chicken thighs.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 40000,
    },
    {
      productName: 'Duck Breast',
      productDescription: 'Premium quality duck breast.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 70000,
    },
    {
      productName: 'Turkey',
      productDescription: 'Farm-fresh turkey meat.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 90000,
    },
  ];

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Handle adding products to cart
  const handleAddToCart = (product: any) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productName === product.productName);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productName === product.productName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="flex flex-col mt-[11vh]">
      {/* Hero Banner Section */}
      <div className="w-full">
        <HeroBanner />
      </div>

      <div className="flex flex-col">
        <CategoryContainer 
          categoryName="Vegetables & Fruits" 
          products={vegetablesAndFruits} 
          onAddToCart={handleAddToCart}
        />
        <CategoryContainer 
          categoryName="Poultry" 
          products={poultry} 
          onAddToCart={handleAddToCart}
        />
      </div>

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      >
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItemCard
              key={item.productName}
              imageSrc={item.productImage}
              name={item.productName}
              description={item.productDescription}
              price={item.productPrice}
              quantity={item.quantity}
            />
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </ShoppingCart>
    </div>
  );
};

export default Home;



