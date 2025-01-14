import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchInventoriesUser } from "@/redux/slices/getProductsSlice";
import ProductCardLatest from "../components/product-card-latest";
import FruggerMarquee from "../components/frugger-marquee"; // Import FruggerMarquee component
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components
import "swiper/css"; // Import Swiper styles
import "swiper/css/free-mode"; // Import FreeMode styles
import { FreeMode } from "swiper/modules";
import Cookies from "js-cookie";

const HeroBanner = dynamic(() => import('../components/hero-banner'), { ssr: false });

const Home: React.FC = () => {
  const current_store_id = Cookies.get("current_store_id");
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
        store_id: Number(current_store_id)
      })
    );
  }, [dispatch, current_store_id]);

  // Group products by category
  const groupedProducts = productAllUser.reduce((groups, product) => {
    const { category_name } = product;
    if (!groups[category_name]) {
      groups[category_name] = [];
    }
    groups[category_name].push(product);
    return groups;
  }, {} as Record<string, typeof productAllUser>);

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
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-12">
              {/* Category Title */}
              <h2 className="text-5xl font-bold mb-6">{category}</h2>

              {/* Swiper for the current category */}
              <Swiper
                spaceBetween={20}
                slidesPerView={"auto"}
                freeMode={true}
                modules={[FreeMode]}
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
                      onClick={() => {
                        // Navigate to the product details page when clicked
                        window.location.href = `/products-page/product-details-page/${product.inventory_id}`;
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
