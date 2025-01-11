import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProductDetailsByInventoryId } from "@/redux/slices/getProductsSlice";

function SingleProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, productDetailUser } = useSelector(
    (state: RootState) => state.getProducts
  );

  const params = useParams();
  const productId = params?.product_id; // Get the productId from URL

  console.log("product id: ", productId);

  const [selectedImage, setSelectedImage] = useState(productDetailUser.product_images[0].product_image || ''); // Default to main image
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

  // if (!productDetailUser) {
  //   return <div>Product not found!</div>;
  // }
  useEffect(() => {
    const inventoryId = Number(productId); // Replace with the inventory ID you want to fetch
    dispatch(fetchProductDetailsByInventoryId(inventoryId))
      .unwrap()
      .then((data) => {
        console.log("Fetched Product Details:", data);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
      });
  }, [dispatch, productId]);

  console.log("Product details", productDetailUser);

  return (
    <div className="bg-white min-h-screen flex justify-center p-8">
      <div className="flex w-full max-w-6xl gap-10">
        {/* Left side */}
        <div className="flex flex-col items-center w-1/2">
          <img src={productDetailUser.product_images[0].product_image} alt={productDetailUser.product_name} className="w-full h-[60vh] object-cover" />
          
          <div className="flex gap-4 mt-4">
            {productDetailUser.product_images.map((image, index) => (
              <img
                key={index}
                src={image.product_image}
                alt={`Thumbnail ${index}`}
                className="w-[80px] h-[80px] object-cover cursor-pointer border"
                onClick={() => handleImageSelect(image.product_image)}
              />
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2">
          <h1 className="text-6xl font-bold">{productDetailUser.product_name}</h1>
          <p className="text-xl text-gray-800 mt-4">IDR {productDetailUser.discounted_price.toLocaleString()}</p>
          <div className="border-b border-gray-300 my-4"></div>
          <p className="text-sm text-gray-600">{productDetailUser.description}</p>

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
