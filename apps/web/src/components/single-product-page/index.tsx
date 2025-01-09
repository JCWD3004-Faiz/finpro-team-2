import React, { useState } from "react";

interface ProductPageProps {
  productName: string;
  priceIDR: string;
  images: string[]; // Array of image URLs, the first one is the default large image
  stock: number;
}

const SingleProductPage: React.FC<ProductPageProps> = ({ productName, priceIDR, images, stock }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    if (value > 0 && value <= stock) {
      setQuantity(value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen text-black">
      {/* Left Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center">
          <img
            src={selectedImage}
            alt="Selected product"
            className="object-contain max-h-[80vh] w-full"
          />
        </div>
        <div className="flex gap-2 mt-4">
          {images.slice(1).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx}`}
              className="h-20 w-20 object-cover cursor-pointer border border-black"
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col p-6 justify-start">
        <h1 className="text-4xl font-bold mb-4">{productName}</h1>
        <p className="text-2xl mb-4">IDR {priceIDR}</p>
        <div className="border-b border-black mb-4" />

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              className="border border-black px-3 py-1"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className="border border-black px-3 py-1"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </button>
          </div>
          <button className="bg-black text-white px-6 py-2">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;