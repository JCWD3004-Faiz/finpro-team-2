import React, { useState } from 'react';
import { useParams } from 'next/navigation';

const vegetablesAndFruits = [
  {
    productId: 'vf1',
    productName: 'Apple',
    productDescription: 'Fresh, crisp apples.',
    productImage: 'https://via.placeholder.com/600',
    price: 25000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf2',
    productName: 'Banana',
    productDescription: 'Ripe bananas from organic farms.',
    productImage: 'https://via.placeholder.com/600',
    price: 15000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf3',
    productName: 'Tomato',
    productDescription: 'Red, juicy tomatoes.',
    productImage: 'https://via.placeholder.com/600',
    price: 20000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf4',
    productName: 'Cucumber',
    productDescription: 'Fresh cucumbers for salads.',
    productImage: 'https://via.placeholder.com/600',
    price: 18000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf5',
    productName: 'Carrot',
    productDescription: 'Crunchy and sweet carrots.',
    productImage: 'https://via.placeholder.com/600',
    price: 22000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf6',
    productName: 'Broccoli',
    productDescription: 'Fresh green broccoli.',
    productImage: 'https://via.placeholder.com/600',
    price: 30000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf7',
    productName: 'Spinach',
    productDescription: 'Organic spinach leaves.',
    productImage: 'https://via.placeholder.com/600',
    price: 25000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf8',
    productName: 'Pineapple',
    productDescription: 'Sweet and tangy pineapples.',
    productImage: 'https://via.placeholder.com/600',
    price: 40000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf9',
    productName: 'Peach',
    productDescription: 'Juicy and sweet peaches.',
    productImage: 'https://via.placeholder.com/600',
    price: 35000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf10',
    productName: 'Grapes',
    productDescription: 'Fresh, seedless grapes.',
    productImage: 'https://via.placeholder.com/600',
    price: 28000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf11',
    productName: 'Strawberry',
    productDescription: 'Sweet and ripe strawberries.',
    productImage: 'https://via.placeholder.com/600',
    price: 27000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'vf12',
    productName: 'Watermelon',
    productDescription: 'Refreshing and juicy watermelon.',
    productImage: 'https://via.placeholder.com/600',
    price: 50000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
];

const poultry = [
  {
    productId: 'p1',
    productName: 'Chicken Breast',
    productDescription: 'Lean and tender chicken breast.',
    productImage: 'https://via.placeholder.com/600',
    price: 75000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p2',
    productName: 'Chicken Thighs',
    productDescription: 'Juicy and flavorful chicken thighs.',
    productImage: 'https://via.placeholder.com/600',
    price: 70000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p3',
    productName: 'Duck Breast',
    productDescription: 'Premium quality duck breast.',
    productImage: 'https://via.placeholder.com/600',
    price: 100000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p4',
    productName: 'Turkey',
    productDescription: 'Farm-fresh turkey meat.',
    productImage: 'https://via.placeholder.com/600',
    price: 120000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p5',
    productName: 'Quail',
    productDescription: 'Small, tender quail meat.',
    productImage: 'https://via.placeholder.com/600',
    price: 110000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p6',
    productName: 'Goose Breast',
    productDescription: 'Delicious and tender goose breast.',
    productImage: 'https://via.placeholder.com/600',
    price: 150000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p7',
    productName: 'Chicken Wings',
    productDescription: 'Perfect for grilling.',
    productImage: 'https://via.placeholder.com/600',
    price: 45000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p8',
    productName: 'Cornish Hen',
    productDescription: 'Small, tender Cornish hen.',
    productImage: 'https://via.placeholder.com/600',
    price: 85000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p9',
    productName: 'Chicken Drumsticks',
    productDescription: 'Juicy, flavorful chicken drumsticks.',
    productImage: 'https://via.placeholder.com/600',
    price: 55000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p10',
    productName: 'Chicken Sausages',
    productDescription: 'Seasoned chicken sausages.',
    productImage: 'https://via.placeholder.com/600',
    price: 60000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p11',
    productName: 'Duck Legs',
    productDescription: 'Succulent duck legs.',
    productImage: 'https://via.placeholder.com/600',
    price: 130000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'p12',
    productName: 'Turkey Bacon',
    productDescription: 'Healthy and tasty turkey bacon.',
    productImage: 'https://via.placeholder.com/600',
    price: 75000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
];

const dairy = [
  {
    productId: 'd1',
    productName: 'Cottage Cheese',
    productDescription: 'Fresh, delicate Cottage Cheese.',
    productImage: 'https://via.placeholder.com/600',
    price: 35000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd2',
    productName: 'Hazelnut Milk',
    productDescription: 'Freshly squeezed from our natural grown hazelnuts.',
    productImage: 'https://via.placeholder.com/600',
    price: 45000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd3',
    productName: 'Whole Milk',
    productDescription: 'For your baking needs.',
    productImage: 'https://via.placeholder.com/600',
    price: 20000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd4',
    productName: 'Yoghurt',
    productDescription: 'Freshly made daily.',
    productImage: 'https://via.placeholder.com/600',
    price: 22000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd5',
    productName: 'Cheddar Cheese',
    productDescription: 'Aged cheddar cheese.',
    productImage: 'https://via.placeholder.com/600',
    price: 80000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd6',
    productName: 'Almond Milk',
    productDescription: 'Nutritious almond milk.',
    productImage: 'https://via.placeholder.com/600',
    price: 35000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd7',
    productName: 'Butter',
    productDescription: 'Creamy, fresh butter.',
    productImage: 'https://via.placeholder.com/600',
    price: 40000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd8',
    productName: 'Feta Cheese',
    productDescription: 'Creamy and tangy feta cheese.',
    productImage: 'https://via.placeholder.com/600',
    price: 90000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd9',
    productName: 'Ricotta Cheese',
    productDescription: 'Fresh ricotta cheese.',
    productImage: 'https://via.placeholder.com/600',
    price: 75000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd10',
    productName: 'Cream Cheese',
    productDescription: 'Smooth and tangy cream cheese.',
    productImage: 'https://via.placeholder.com/600',
    price: 65000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd11',
    productName: 'Gouda Cheese',
    productDescription: 'Mild and creamy gouda cheese.',
    productImage: 'https://via.placeholder.com/600',
    price: 95000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'd12',
    productName: 'Mozzarella Cheese',
    productDescription: 'Fresh mozzarella cheese.',
    productImage: 'https://via.placeholder.com/600',
    price: 70000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
];

const bakedGoods = [
  {
    productId: 'bg1',
    productName: 'Croissant',
    productDescription: 'Buttery, flaky croissants.',
    productImage: 'https://via.placeholder.com/600',
    price: 35000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg2',
    productName: 'Baguette',
    productDescription: 'Crispy on the outside, soft on the inside.',
    productImage: 'https://via.placeholder.com/600',
    price: 40000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg3',
    productName: 'Sourdough Bread',
    productDescription: 'Freshly baked, tangy sourdough.',
    productImage: 'https://via.placeholder.com/600',
    price: 60000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg4',
    productName: 'Blueberry Muffin',
    productDescription: 'Soft, moist blueberry muffins.',
    productImage: 'https://via.placeholder.com/600',
    price: 20000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg5',
    productName: 'Cinnamon Roll',
    productDescription: 'Warm cinnamon rolls with icing.',
    productImage: 'https://via.placeholder.com/600',
    price: 30000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg6',
    productName: 'Chocolate Chip Cookie',
    productDescription: 'Chewy and loaded with chocolate chips.',
    productImage: 'https://via.placeholder.com/600',
    price: 18000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg7',
    productName: 'Apple Pie',
    productDescription: 'Classic homemade apple pie.',
    productImage: 'https://via.placeholder.com/600',
    price: 90000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg8',
    productName: 'Lemon Pound Cake',
    productDescription: 'Moist, zesty lemon pound cake.',
    productImage: 'https://via.placeholder.com/600',
    price: 85000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg9',
    productName: 'Pumpkin Bread',
    productDescription: 'Spiced pumpkin bread.',
    productImage: 'https://via.placeholder.com/600',
    price: 70000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg10',
    productName: 'Pita Bread',
    productDescription: 'Soft and warm pita bread.',
    productImage: 'https://via.placeholder.com/600',
    price: 25000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg11',
    productName: 'Bagel',
    productDescription: 'Freshly baked bagels.',
    productImage: 'https://via.placeholder.com/600',
    price: 22000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
  {
    productId: 'bg12',
    productName: 'Cheese Biscuit',
    productDescription: 'Buttery cheese biscuits.',
    productImage: 'https://via.placeholder.com/600',
    price: 27000, // Price in IDR
    smallImages: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  },
];


// Combine all categories into one array
const productData = [...vegetablesAndFruits, ...poultry, ...dairy, ...bakedGoods];

function SingleProductPage() {
  const params = useParams();
  const productId = params?.productId; // Get the productId from URL
  const product = productData.find((item) => item.productId === productId); // Find the product

  const [selectedImage, setSelectedImage] = useState(product?.productImage || ''); // Default to main image
  const [quantity, setQuantity] = useState(1);

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <div className="bg-white min-h-screen flex justify-center p-8">
      <div className="flex w-full max-w-6xl gap-10">
        {/* Left side */}
        <div className="flex flex-col items-center w-1/2">
          <img src={selectedImage} alt={product.productName} className="w-full h-[60vh] object-cover" />
          
          <div className="flex gap-4 mt-4">
            {product.smallImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index}`}
                className="w-[80px] h-[80px] object-cover cursor-pointer border"
                onClick={() => handleImageSelect(image)}
              />
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2">
          <h1 className="text-6xl font-bold">{product.productName}</h1>
          <p className="text-xl text-gray-800 mt-4">IDR {product.price.toLocaleString()}</p>
          <div className="border-b border-gray-300 my-4"></div>
          <p className="text-sm text-gray-600">{product.productDescription}</p>

          {/* Quantity controls */}
          <div className="flex items-center mt-6">
            <button
              onClick={handleDecrease}
              className="w-10 h-10 border border-black flex justify-center items-center text-lg font-semibold"
            >
              -
            </button>
            <span className="mx-4 text-xl">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="w-10 h-10 border border-black flex justify-center items-center text-lg font-semibold"
            >
              +
            </button>
          </div>

          <button className="mt-6 w-full py-3 bg-black text-white font-bold text-xl">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default SingleProductPage;
