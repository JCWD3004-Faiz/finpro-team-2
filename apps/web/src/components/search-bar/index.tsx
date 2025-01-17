import React, { useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { FreeMode, Scrollbar, Keyboard } from "swiper/modules";

interface SearchBarProps {
  searchQuery: string;
  categories: any[]; // Dynamically generated categories
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryClick: (category: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  categories,
  onSearchChange,
  onCategoryClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full bg-white border-b border-black mx-6 overflow-hidden transition-all duration-500">
      <div
        className={`w-full flex flex-col items-center transition-all duration-500 overflow-hidden ${
          isExpanded ? "h-[34vh]" : "h-[0vh]"
        }`}
      >
        <div className="w-full text-left p-4">
          <p className="text-2xl font-semibold text-center sm:text-left">
            Start your frugal life today.
          </p>
        </div>

        <div
          className={`w-full px-4 flex flex-col items-center mt-4 transition-all duration-500 ${
            isExpanded ? "translate-y-0" : "-translate-y-20 opacity-0"
          }`}
        >
          <input
            type="text"
            className="w-full border-b text-2xl border-gray-500 py-2 text-center text-gray-700 placeholder-gray-400 outline-none sm:text-lg sm:px-4"
            placeholder="What are you looking for today?"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>

        <div
          className={`w-full px-4 mt-4 transition-all duration-500 ${
            isExpanded ? "translate-y-0" : "-translate-y-20 opacity-0"
          }`}
        >
          <div className="w-full h-[10vh] flex items-center">
            <Swiper
              spaceBetween={10}
              slidesPerView={"auto"}
              freeMode={true}
              scrollbar={{
                draggable: true,
                el: ".swiper-scrollbar", // Custom scrollbar container
                hide: false, // Always show the scrollbar
              }}
              keyboard={{
                enabled: true, // Enable keyboard navigation
                onlyInViewport: true, // Navigation only works when the Swiper is visible
              }}
              modules={[FreeMode, Scrollbar, Keyboard]}
              className="category-swiper"
            >
              {categories.map((category) => (
                <SwiperSlide
                  key={category.category_name}
                  style={{ width: "250px" }} // Adjust width for smaller screens
                >
                  <button
                    className="w-full h-[10vh] bg-white text-black text-center border border-black cursor-pointer hover:bg-black hover:text-white transition-all"
                    onClick={() => onCategoryClick(category.category_name)}
                  >
                    {category.category_name}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Custom scrollbar positioned below with 4vh of space */}
          <div className="w-full h-[2vh] mt-2">
            <div className="swiper-scrollbar" />
          </div>
        </div>
      </div>

      <div
        className="w-full h-[10vh] border-t border-black flex items-center justify-center transition-all duration-300 hover:bg-black hover:text-white group cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-2 text-black group-hover:text-white">
          <FaArrowDown
            className={`text-gray-700 text-3xl cursor-pointer transition-transform duration-500 ${
              isExpanded ? "rotate-180" : ""
            } group-hover:text-white`}
          />
          <span className="text-black text-2xl font-medium group-hover:text-white sm:text-xl">
            Search for products here.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
