import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import dynamic from "next/dynamic";
import { RootState } from "../redux/store";
import { FaCartArrowDown } from "react-icons/fa6";
import ShoppingCart from "../components/shopping-cart";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const HeroBanner = dynamic(() => import('../components/hero-banner'), { ssr: false });
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const vegetablesAndFruits = [
    { productId: 'vf1', productName: 'Apple', productDescription: 'Fresh, crisp apples.', productImage: 'https://via.placeholder.com/150', productPrice: 20000 },
    { productId: 'vf2', productName: 'Banana', productDescription: 'Ripe bananas from organic farms.', productImage: 'https://via.placeholder.com/150', productPrice: 15000 },
    { productId: 'vf3', productName: 'Tomato', productDescription: 'Red, juicy tomatoes.', productImage: 'https://via.placeholder.com/150', productPrice: 10000 },
    { productId: 'vf4', productName: 'Cucumber', productDescription: 'Fresh cucumbers for salads.', productImage: 'https://via.placeholder.com/150', productPrice: 8000 },
    { productId: 'vf5', productName: 'Carrot', productDescription: 'Crunchy and sweet carrots.', productImage: 'https://via.placeholder.com/150', productPrice: 12000 },
    { productId: 'vf6', productName: 'Broccoli', productDescription: 'Fresh green broccoli.', productImage: 'https://via.placeholder.com/150', productPrice: 25000 },
    { productId: 'vf7', productName: 'Spinach', productDescription: 'Organic spinach leaves.', productImage: 'https://via.placeholder.com/150', productPrice: 18000 },
    { productId: 'vf8', productName: 'Potato', productDescription: 'Perfect for all dishes.', productImage: 'https://via.placeholder.com/150', productPrice: 22000 },
  ];

  const poultry = [
    { productId: 'p1', productName: 'Chicken Breast', productDescription: 'Lean and tender chicken breast.', productImage: 'https://via.placeholder.com/150', productPrice: 50000 },
    { productId: 'p2', productName: 'Chicken Thighs', productDescription: 'Juicy and flavorful chicken thighs.', productImage: 'https://via.placeholder.com/150', productPrice: 40000 },
    { productId: 'p3', productName: 'Duck Breast', productDescription: 'Premium quality duck breast.', productImage: 'https://via.placeholder.com/150', productPrice: 70000 },
    { productId: 'p4', productName: 'Turkey', productDescription: 'Farm-fresh turkey meat.', productImage: 'https://via.placeholder.com/150', productPrice: 90000 },
    { productId: 'p5', productName: 'Quail', productDescription: 'Small, tender quail meat.', productImage: 'https://via.placeholder.com/150', productPrice: 30000 },
    { productId: 'p6', productName: 'Goose Breast', productDescription: 'Delicious and tender goose breast.', productImage: 'https://via.placeholder.com/150', productPrice: 80000 },
    { productId: 'p7', productName: 'Chicken Wings', productDescription: 'Perfect for grilling.', productImage: 'https://via.placeholder.com/150', productPrice: 35000 },
    { productId: 'p6', productName: 'Chicken Wings', productDescription: 'Perfectly cut chicken wings.', productImage: 'https://via.placeholder.com/150', productPrice: 45000 },
    { productId: 'p7', productName: 'Goose Meat', productDescription: 'Premium goose meat.', productImage: 'https://via.placeholder.com/150', productPrice: 95000 },
    { productId: 'p8', productName: 'Duck Legs', productDescription: 'Tender duck legs.', productImage: 'https://via.placeholder.com/150', productPrice: 75000 },
  ];

  const dairy = [
    { productId: 'd1', productName: 'Cottage Cheese', productDescription: 'Fresh, delicate Cottage Cheese', productImage: 'https://via.placeholder.com/150', productPrice: 60000 },
    { productId: 'd2', productName: 'Hazelnut Milk', productDescription: 'Freshly squeezed from our natural grown hazelnuts.', productImage: 'https://via.placeholder.com/150', productPrice: 15000 },
    { productId: 'd3', productName: 'Whole Milk', productDescription: 'For your baking needs.', productImage: 'https://via.placeholder.com/150', productPrice: 10000 },
    { productId: 'd4', productName: 'Yoghurt', productDescription: 'Freshly made daily.', productImage: 'https://via.placeholder.com/150', productPrice: 8000 },
    { productId: 'd5', productName: 'Cheddar Cheese', productDescription: 'Aged cheddar cheese.', productImage: 'https://via.placeholder.com/150', productPrice: 70000 },
    { productId: 'd6', productName: 'Almond Milk', productDescription: 'Nutritious almond milk.', productImage: 'https://via.placeholder.com/150', productPrice: 20000 },
    { productId: 'd7', productName: 'Butter', productDescription: 'Creamy, fresh butter.', productImage: 'https://via.placeholder.com/150', productPrice: 50000 },
    { productId: 'd8', productName: 'Cream Cheese', productDescription: 'Smooth cream cheese.', productImage: 'https://via.placeholder.com/150', productPrice: 65000 },
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
        <h2 className="text-4xl font-semibold mb-4">Vegetables & Fruits</h2>
        <Swiper spaceBetween={20} slidesPerView={4} keyboard={true}>
          {vegetablesAndFruits.map((product) => (
            <SwiperSlide key={product.productId}>
              <div className="product-card w-[20vw] h-[60vh] bg-white shadow-lg overflow-hidden relative">
                <img 
                  src={product.productImage} 
                  alt={product.productName} 
                  className="w-full h-2/3 object-cover" 
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.productDescription}</p>
                  <p className="text-lg font-semibold text-green-600 mt-2">IDR {formattedPrice(product.productPrice)}</p>
                </div>
                <FaCartArrowDown
                  className="absolute bottom-4 right-4 text-4xl text-black cursor-pointer"
                  onClick={() => handleAddToCart(product)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Poultry Section */}
      <div className="mx-8 my-8">
        <h2 className="text-4xl font-semibold mb-4">Poultry</h2>
        <Swiper spaceBetween={20} slidesPerView={4} keyboard={true}>
          {poultry.map((product) => (
            <SwiperSlide key={product.productId}>
              <div className="product-card w-[20vw] h-[60vh] bg-white shadow-lg overflow-hidden relative">
                <img 
                  src={product.productImage} 
                  alt={product.productName} 
                  className="w-full h-2/3 object-cover" 
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.productDescription}</p>
                  <p className="text-lg font-semibold text-green-600 mt-2">IDR {formattedPrice(product.productPrice)}</p>
                </div>
                <FaCartArrowDown
                  className="absolute bottom-4 right-4 text-4xl text-black cursor-pointer"
                  onClick={() => handleAddToCart(product)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Dairy Section */}
      <div className="mx-8 my-8">
        <h2 className="text-4xl font-semibold mb-4">Dairy</h2>
        <Swiper spaceBetween={20} slidesPerView={4} keyboard={true}>
          {dairy.map((product) => (
            <SwiperSlide key={product.productId}>
              <div className="product-card w-[20vw] h-[60vh] bg-white shadow-lg overflow-hidden relative">
                <img 
                  src={product.productImage} 
                  alt={product.productName} 
                  className="w-full h-2/3 object-cover" 
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.productDescription}</p>
                  <p className="text-lg font-semibold text-green-600 mt-2">IDR {formattedPrice(product.productPrice)}</p>
                </div>
                <FaCartArrowDown
                  className="absolute bottom-4 right-4 text-4xl text-black cursor-pointer"
                  onClick={() => handleAddToCart(product)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
