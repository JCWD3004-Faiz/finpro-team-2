import React from "react";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import MoreCard from "../components/more-card";
import FruggerMarquee from "../components/frugger-marquee"; // Import FruggerMarquee component

const HeroBanner = dynamic(() => import('../components/hero-banner'), { ssr: false });

const Home: React.FC = () => {
  const vegetablesAndFruits = [
    { productId: 'vf1', productName: 'Apple', productDescription: 'Fresh, crisp apples.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'vf2', productName: 'Banana', productDescription: 'Ripe bananas from organic farms.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'vf3', productName: 'Tomato', productDescription: 'Red, juicy tomatoes.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'vf4', productName: 'Cucumber', productDescription: 'Fresh cucumbers for salads.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'vf5', productName: 'Carrot', productDescription: 'Crunchy and sweet carrots.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'vf6', productName: 'Broccoli', productDescription: 'Fresh green broccoli.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'vf7', productName: 'Spinach', productDescription: 'Organic spinach leaves.', productImage: 'https://via.placeholder.com/150' },
  ];

  const poultry = [
    { productId: 'p1', productName: 'Chicken Breast', productDescription: 'Lean and tender chicken breast.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'p2', productName: 'Chicken Thighs', productDescription: 'Juicy and flavorful chicken thighs.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'p3', productName: 'Duck Breast', productDescription: 'Premium quality duck breast.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'p4', productName: 'Turkey', productDescription: 'Farm-fresh turkey meat.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'p5', productName: 'Quail', productDescription: 'Small, tender quail meat.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'p6', productName: 'Goose Breast', productDescription: 'Delicious and tender goose breast.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'p7', productName: 'Chicken Wings', productDescription: 'Perfect for grilling.', productImage: 'https://via.placeholder.com/150' },
  ];

  const dairy = [
    { productId: 'd1', productName: 'Cottage Cheese', productDescription: 'Fresh, delicate Cottage Cheese', productImage: 'https://via.placeholder.com/150' },
    { productId: 'd2', productName: 'Hazelnut Milk', productDescription: 'Freshly squeezed from our natural grown hazelnuts.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'd3', productName: 'Whole Milk', productDescription: 'For your baking needs.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'd4', productName: 'Yoghurt', productDescription: 'Freshly made daily.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'd5', productName: 'Cheddar Cheese', productDescription: 'Aged cheddar cheese.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'd6', productName: 'Almond Milk', productDescription: 'Nutritious almond milk.', productImage: 'https://via.placeholder.com/150' },
    { productId: 'd7', productName: 'Butter', productDescription: 'Creamy, fresh butter.', productImage: 'https://via.placeholder.com/150' },
  ];

  const handleMoreClick = () => {
    console.log("Showing more products...");
  };

  return (
    <div className="flex flex-col mt-[11vh]">
      {/* Hero Banner */}
      <div className="w-full">
        <HeroBanner />
      </div>

      {/* FruggerMarquee component placed below hero banner */}
      <FruggerMarquee />

      {/* Vegetables & Fruits Section */}
      <div className="mx-8 my-8">
        <h2 className="text-6xl font-semibold mb-6">Vegetables & Fruits</h2>
        <Swiper spaceBetween={20} slidesPerView={4} keyboard={true} freeMode={true} modules={[FreeMode]}>
          {vegetablesAndFruits.map((product) => (
            <SwiperSlide key={product.productId}>
              <div className="product-card w-[20vw] h-[55vh] bg-white shadow-lg border border-black overflow-hidden relative">
                <img 
                  src={product.productImage} 
                  alt={product.productName} 
                  className="w-full h-2/3 object-cover" 
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.productDescription}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <MoreCard onClickMore={handleMoreClick} />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Poultry Section */}
      <div className="mx-8 my-8">
        <h2 className="text-6xl font-semibold mb-6">Poultry</h2>
        <Swiper spaceBetween={20} slidesPerView={4} keyboard={true} freeMode={true} modules={[FreeMode]}>
          {poultry.map((product) => (
            <SwiperSlide key={product.productId}>
              <div className="product-card w-[20vw] h-[55vh] bg-white shadow-lg border border-black overflow-hidden relative">
                <img 
                  src={product.productImage} 
                  alt={product.productName} 
                  className="w-full h-2/3 object-cover" 
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.productDescription}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <MoreCard onClickMore={handleMoreClick} />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Dairy Section */}
      <div className="mx-8 my-8">
        <h2 className="text-6xl font-semibold mb-6">Dairy</h2>
        <Swiper spaceBetween={20} slidesPerView={4} keyboard={true} freeMode={true} modules={[FreeMode]}>
          {dairy.map((product) => (
            <SwiperSlide key={product.productId}>
              <div className="product-card w-[20vw] h-[55vh] bg-white shadow-lg border border-black overflow-hidden relative">
                <img 
                  src={product.productImage} 
                  alt={product.productName} 
                  className="w-full h-2/3 object-cover" 
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.productDescription}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <MoreCard onClickMore={handleMoreClick} />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Home;
