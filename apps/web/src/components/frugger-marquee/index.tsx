import React from 'react';

const FruggerMarquee: React.FC = () => {
  return (
    <div className="w-full h-[20vh] bg-black overflow-hidden flex items-center">
      <div className="marquee text-white text-6xl font-bold whitespace-nowrap">
        {Array(20).fill('Get frugal with FRUGMART').map((text, index) => (
          <span key={index} className="mx-4">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FruggerMarquee;