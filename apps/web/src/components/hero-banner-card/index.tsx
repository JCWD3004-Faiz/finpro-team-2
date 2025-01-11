// components/HeroBannerCard.tsx
import React from 'react';

interface HeroBannerCardProps {
  title: string;
  description: string;
  imagePath: string; // Path to the image
}

const HeroBannerCard: React.FC<HeroBannerCardProps> = ({ title, description, imagePath }) => {
  return (
    <div
      className="relative w-full h-[70vh] bg-gray-500" // Fallback grey background in case image fails
      style={{
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Text content */}
      <div className="absolute bottom-10 right-10 text-white text-right p-4">
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        <p className="text-lg md:text-xl">{description}</p>
      </div>
    </div>
  );
};

export default HeroBannerCard;



