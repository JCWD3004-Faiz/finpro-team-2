import React from 'react';

const LocationHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 border-b border-black w-full h-[3vh] bg-white z-50 flex items-center justify-center">
      <span className="text-sm text-center">DKI Jakarta</span>
    </header>
  );
};

export default LocationHeader;