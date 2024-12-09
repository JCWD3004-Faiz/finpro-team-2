// pages/Home.tsx
import dynamic from 'next/dynamic';
import CategoryContainer from '../components/category-container'; // Import the CategoryContainer

// Dynamically load Swiper
const HeroBanner = dynamic(() => import('../components/hero-banner'), { ssr: false });

const Home: React.FC = () => {
  // Example product data for two categories
  const vegetablesAndFruits = [
    {
      productName: 'Apple',
      productDescription: 'Fresh, crisp apples.',
      productImage: 'https://via.placeholder.com/150',
    },
    {
      productName: 'Banana',
      productDescription: 'Ripe bananas from organic farms.',
      productImage: 'https://via.placeholder.com/150',
    },
    {
      productName: 'Tomato',
      productDescription: 'Red, juicy tomatoes.',
      productImage: 'https://via.placeholder.com/150',
    },
    {
      productName: 'Cucumber',
      productDescription: 'Fresh cucumbers for salads.',
      productImage: 'https://via.placeholder.com/150',
    },
    {
      productName: 'Orange',
      productDescription: 'Sweet and tangy oranges.',
      productImage: 'https://via.placeholder.com/150',
    },
  ];

  const poultry = [
    {
      productName: 'Chicken Breast',
      productDescription: 'Lean and tender chicken breast.',
      productImage: 'https://via.placeholder.com/150',
    },
    {
      productName: 'Chicken Thighs',
      productDescription: 'Juicy and flavorful chicken thighs.',
      productImage: 'https://via.placeholder.com/150',
    },
    {
      productName: 'Duck Breast',
      productDescription: 'Premium quality duck breast.',
      productImage: 'https://via.placeholder.com/150',
    },
    {
      productName: 'Turkey',
      productDescription: 'Farm-fresh turkey meat.',
      productImage: 'https://via.placeholder.com/150',
    },
    {
      productName: 'Pork Chops',
      productDescription: 'Tender and flavorful pork chops.',
      productImage: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Banner Section */}
      <div className="w-full mt-[8vh]"> {/* Add margin-top to ensure the navbar doesn't overlap */}
        <HeroBanner />
      </div>

      {/* Categories Section (removed mt-4 to eliminate the gap) */}
      <div className="flex flex-col">
        <CategoryContainer 
          categoryName="Vegetables & Fruits" 
          products={vegetablesAndFruits} 
        />
        <CategoryContainer 
          categoryName="Poultry" 
          products={poultry} 
        />
      </div>
    </div>
  );
};

export default Home;









