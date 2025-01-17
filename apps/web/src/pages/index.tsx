import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchInventoriesUser } from "@/redux/slices/getProductsSlice";
import ProductCardLatest from "../components/product-card-latest";
import FruggerMarquee from "../components/frugger-marquee"; // Import FruggerMarquee component
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { FreeMode, Scrollbar, Keyboard } from "swiper/modules";

const HeroBanner = dynamic(() => import("../components/hero-banner"), { ssr: false });

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, productAllUser } = useSelector((state: RootState) => state.getProducts);

  useEffect(() => {
    // Fetch all products
    const pageSize = 10000; // Use a sufficiently large number to fetch all products
    const sortField = "product_name";
    const sortOrder = "asc";

    dispatch(
      fetchInventoriesUser({
        page: 1, // Fetching all data doesn't need pagination, but provide the first page
        pageSize,
        sortField,
        sortOrder,
      })
    );
  }, [dispatch]);

  // Group products by category
  const groupedProducts = productAllUser.reduce((groups, product) => {
    const { category_name } = product;
    if (!groups[category_name]) {
      groups[category_name] = [];
    }
    groups[category_name].push(product);
    return groups;
  }, {} as Record<string, typeof productAllUser>);

  // Get the first four categories
  const limitedCategories = Object.keys(groupedProducts).slice(0, 4);

  return (
    <div className="flex flex-col mt-[11vh]">
      {/* Hero Banner */}
      <div className="w-full">
        <HeroBanner />
      </div>

      {/* FruggerMarquee component placed below hero banner */}
      <FruggerMarquee />

      {/* Grouped Products by Category */}
      <div className="w-full mt-[3vh] mb-[3vh] p-4">
        {loading ? (
          <div>Loading...</div> // You can replace this with a loading component if needed
        ) : (
          limitedCategories.map((category) => (
            <div key={category} className="mb-12">
              {/* Category Title with Link */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">{category}</h2>
                <a href="/products-page" className="text-black text-lg sm:text-2xl">More</a>
              </div>

              {/* Swiper for the current category */}
              <Swiper
                spaceBetween={20}
                slidesPerView={"auto"}
                freeMode={true}
                scrollbar={{
                  draggable: true,
                  el: `.swiper-scrollbar-${category}`,
                  hide: false,
                }}
                keyboard={{
                  enabled: true,
                  onlyInViewport: true,
                }}
                modules={[FreeMode, Scrollbar, Keyboard]}
                className="category-swiper"
              >
                {groupedProducts[category].map((product) => (
                  <SwiperSlide
                    key={product.inventory_id}
                    style={{ width: "280px" }} // Fixed width for each slide
                  >
                    <ProductCardLatest
                      inventoryId={product.inventory_id}
                      productId={product.product_id}
                      productImage={product.product_image}
                      productName={product.product_name}
                      categoryName={product.category_name}
                      userStock={product.user_stock}
                      price={String(product.price)}
                      discountedPrice={String(product.discounted_price)}
                      discountType={product.discount_type}
                      discountValue={product.discount_value}
                      onClick={() => {
                        // Navigate to the product details page when clicked
                        window.location.href = `/products-page/product-details-page/${product.inventory_id}`;
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Custom scrollbar positioned below with some spacing */}
              <div className={`w-full h-[1vh] mt-2 swiper-scrollbar-${category}`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
