// components/HeroBanner.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import HeroBannerCard from '../hero-banner-card'; // Import the card component

const HeroBanner: React.FC = () => {
  const slides = [
    {
      title: 'Lorem Ipsum 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      imagePath: 'https://via.placeholder.com/1500x500', // Placeholder grey image
    },
    {
      title: 'Lorem Ipsum 2',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imagePath: 'https://via.placeholder.com/1500x500',
    },
    {
      title: 'Lorem Ipsum 3',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      imagePath: 'https://via.placeholder.com/1500x500',
    },
    {
      title: 'Lorem Ipsum 4',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
      imagePath: 'https://via.placeholder.com/1500x500',
    },
    {
      title: 'Lorem Ipsum 5',
      description: 'Excepteur sint occaecat cupidatat non proident.',
      imagePath: 'https://via.placeholder.com/1500x500',
    },
  ];

  return (
    <div className="hero-banner w-full h-[60vh] overflow-hidden relative">
      <Swiper
        modules={[Keyboard, Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        pagination={{ clickable: true, dynamicBullets: true }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <HeroBannerCard
              title={slide.title}
              description={slide.description}
              imagePath={slide.imagePath}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;



