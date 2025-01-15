// components/HeroBanner.tsx
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import HeroBannerCard from "../hero-banner-card"; // Import the card component
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDiscountsByStoreId } from "@/redux/slices/userDiscountSlice";
import Cookies from "js-cookie";

const HeroBanner: React.FC = () => {
  const current_store_id = Number(Cookies.get("current_store_id"));
  const access_token = Cookies.get("access_token");
  const dispatch = useDispatch<AppDispatch>();
  const { allUserDiscounts } = useSelector(
    (state: RootState) => state.userDiscounts
  );
  const { closestStore } = useSelector((state: RootState) => state.landing);

  console.log("all discounts", allUserDiscounts)
  

  useEffect(() => {
    dispatch(fetchDiscountsByStoreId(current_store_id));
  }, [dispatch, current_store_id]);

  return (
    <div className="hero-banner w-full h-[70vh] overflow-hidden relative">
      {Array.isArray(allUserDiscounts) && allUserDiscounts.length > 0 ? (
        <Swiper
          modules={[Keyboard, Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000 }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          pagination={{ clickable: true, dynamicBullets: true }}
        >
          {allUserDiscounts
            .filter((slide) => slide.image) // Only include slides with a valid image
            .map((slide, index) => (
              <SwiperSlide key={index}>
                <HeroBannerCard
                  title={slide.description || "Default Title"} // Provide default title if description is empty
                  description={""}
                  imagePath={
                    slide.image ||
                    "https://res.cloudinary.com/dmratku6l/image/upload/v1736608302/discountImages/gyziasbykkgylettwqkm.webp"
                  }
                />
              </SwiperSlide>
            ))}
        </Swiper>
      ) : (
        // Render default image when there is no data
        <div className="w-full h-full">
          <img
            src="https://res.cloudinary.com/dmratku6l/image/upload/v1736778543/background_sjg8xa.jpg"
            alt="Default Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
