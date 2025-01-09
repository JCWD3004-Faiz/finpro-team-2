import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryClick: (category: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange, onCategoryClick }) => {
  return (
    <div className="w-full h-[30vh] bg-white border-b border-black flex flex-col items-center sticky top-[11vh] z-10 mx-6">
      <div className="w-full text-left p-4">
        <p className="text-2xl font-semibold">Start your frugal life today.</p>
      </div>
      <div className="w-full px-4 flex flex-col items-center mt-4">
        <input
          type="text"
          className="w-full border-b border-gray-500 py-2 text-center text-gray-700 placeholder-gray-400"
          placeholder="What are you looking for today?"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <div className="w-full px-4 mt-4 flex justify-between space-x-4">
        <button className="w-1/4 h-16 bg-white text-center border border-black" onClick={() => onCategoryClick('vf')}>Vegetables & Fruits</button>
        <button className="w-1/4 h-16 bg-white text-center border border-black" onClick={() => onCategoryClick('p')}>Poultry</button>
        <button className="w-1/4 h-16 bg-white text-center border border-black" onClick={() => onCategoryClick('d')}>Dairy</button>
        <button className="w-1/4 h-16 bg-white text-center border border-black" onClick={() => onCategoryClick('bg')}>Baked Goods</button>
      </div>
    </div>
  );
};

export default SearchBar;

