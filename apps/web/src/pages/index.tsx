import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import dynamic from "next/dynamic";
import { RootState } from "../redux/store";
import { FaCartArrowDown } from "react-icons/fa6";
import ShoppingCart from "../components/shopping-cart"

const HeroBanner = dynamic(() => import('../components/hero-banner'), { ssr: false });
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

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

  const dairy = [
    {
      productId: 'd1',
      productName: 'Cottage Cheese',
      productDescription: 'Fresh, delicate Cottage Cheese',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 60000,
    },
    {
      productId: 'd2',
      productName: 'Hazelnut Milk',
      productDescription: 'Freshly squeezed from our natural grown hazelnuts.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 15000,
    },
    {
      productId: 'd3',
      productName: 'Whole Milk',
      productDescription: 'For your baking needs.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 10000,
    },
    {
      productId: 'd4',
      productName: 'Yoghurt',
      productDescription: 'Freshly made daily.',
      productImage: 'https://via.placeholder.com/150',
      productPrice: 8000,
    },
  ];


  const handleAddToCart = (product: {
    productId: string;
    productName: string;
    productPrice: number;
  }) => {
    dispatch(addItem(product));
  };

  return (
    <div className="flex flex-col mt-[11vh]">
      <div className="w-full">
        <HeroBanner />
      </div>

      {/* Vegetables & Fruits Section */}
      <div className="mx-8 my-8">
        <h2 className="text-2xl font-semibold mb-4">Vegetables & Fruits</h2>
        <div className="flex gap-6 overflow-x-auto">
          {vegetablesAndFruits.map((product) => (
            <div
              key={product.productId}
              className="product-card w-[20vw] h-[60vh] bg-white shadow-lg overflow-hidden relative"
            >
              <img 
                src={product.productImage} 
                alt={product.productName} 
                className="w-full h-2/3 object-cover" 
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{product.productName}</h3>
                <p className="text-sm text-gray-600">{product.productDescription}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">IDR {product.productPrice.toLocaleString()}</p>
              </div>
              <FaCartArrowDown
                className="absolute bottom-4 right-4 text-4xl text-black cursor-pointer"
                onClick={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Poultry Section */}
      <div className="mx-8 my-8">
        <h2 className="text-2xl font-semibold mb-4">Poultry</h2>
        <div className="flex gap-6 overflow-x-auto">
          {poultry.map((product) => (
            <div
              key={product.productId}
              className="product-card w-[20vw] h-[60vh] bg-white shadow-lg overflow-hidden relative"
            >
              <img 
                src={product.productImage} 
                alt={product.productName} 
                className="w-full h-2/3 object-cover" 
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{product.productName}</h3>
                <p className="text-sm text-gray-600">{product.productDescription}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">IDR {product.productPrice.toLocaleString()}</p>
              </div>
              <FaCartArrowDown
                className="absolute bottom-4 right-4 text-4xl text-black cursor-pointer"
                onClick={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>
      </div>

        {/* Poultry Section */}
        <div className="mx-8 my-8">
        <h2 className="text-2xl font-semibold mb-4">Dairy</h2>
        <div className="flex gap-6 overflow-x-auto">
          {poultry.map((product) => (
            <div
              key={product.productId}
              className="product-card w-[20vw] h-[60vh] bg-white shadow-lg overflow-hidden relative"
            >
              <img 
                src={product.productImage} 
                alt={product.productName} 
                className="w-full h-2/3 object-cover" 
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{product.productName}</h3>
                <p className="text-sm text-gray-600">{product.productDescription}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">IDR {product.productPrice.toLocaleString()}</p>
              </div>
              <FaCartArrowDown
                className="absolute bottom-4 right-4 text-4xl text-black cursor-pointer"
                onClick={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>
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

