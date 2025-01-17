import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProductDetailsByInventoryId } from "@/redux/slices/getProductsSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { fetchCartItems } from "@/redux/slices/cartSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import LoadingVignette from "@/components/LoadingVignette";

function SingleProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, productDetailUser } = useSelector(
    (state: RootState) => state.getProducts
  );

  const user = useAuth();
  const user_id = Number(user?.id);
  const isVerified = user?.is_verified;
  const { addresses } = useSelector((state: RootState) => state.userProfile);
  const current_store_id = Number(Cookies.get("current_store_id"));
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const params = useParams();
  const productId = params?.product_id; // Get the productId from URL

  const [selectedImage, setSelectedImage] = useState(
    productDetailUser.product_images[0].product_image || ""
  ); // Default to main image
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

  useEffect(() => {
    if (productId) {
      const inventoryId = Number(productId); // Replace with the inventory ID you want to fetch
      dispatch(fetchProductDetailsByInventoryId(inventoryId))
        .unwrap()
        .then((data) => {})
        .catch((err) => {
          console.error("Error fetching product details:", err);
        });
    }
  }, [dispatch, productId]);

  useEffect(() => {
    // Update selectedImage only when productDetailUser is updated and valid
    if (productDetailUser?.product_images?.length > 0) {
      setSelectedImage(productDetailUser.product_images[0].product_image);
    }
  }, [productDetailUser]);

  const handleAddToCart = async () => {
    if (user_id) {
      if (addresses.length === 0) {
        toast.info("You must set an address before shopping.");
        return;
      }
      if (current_store_id === 28) {
        toast.error("Invalid store. Please change your address.");
        return;
      }
      if (cartItems.length > 0 && cartItems[0].store_id !== current_store_id) {
        toast.error("You cannot purchase from a different store");
        return;
      }
      if (isVerified === false) {
        toast.error("Please verify your email");
        return;
      }
      try {
        const resultAction = await dispatch(
          addToCart({ user_id, inventory_id: Number(productId) })
        );
        if (addToCart.rejected.match(resultAction)) {
          toast.error(String(resultAction.payload));
          return;
        }
        toast.success("Item added to cart!");
        dispatch(fetchCartItems(user_id));
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      toast.info("Sign in to start shopping!");
    }
  };

  return (
    <div
      className="bg-white min-h-screen flex justify-center p-8 text-gray-900"
      style={{ marginTop: "11vh" }}
    >
      {loading && <LoadingVignette />}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-10">
        {/* Left side */}
        <div className="flex flex-col items-center w-full lg:w-1/2">
          <img
            src={
              selectedImage || productDetailUser.product_images[0].product_image
            }
            alt={productDetailUser.product_name}
            className="w-full h-[60vh] object-cover"
          />

          <div className="flex sm:gap-4 mt-4">
            {productDetailUser.product_images.map((image, index) => (
              <img
                key={index}
                src={image.product_image}
                alt={`Thumbnail ${index}`}
                className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] object-cover cursor-pointer border"
                onClick={() => handleImageSelect(image.product_image)}
              />
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2">
          {/* Product Name */}
          <h1 className="text-6xl font-bold">
            {productDetailUser.product_name}
          </h1>

          {/* Price Section */}
          {productDetailUser.discount_type &&
          productDetailUser.discount_value ? (
            <div className="mt-4">
              {/* Original Price */}
              <p className="text-xl text-gray-500 line-through">
                {formatCurrency(productDetailUser.price)}
              </p>
              {/* Discounted Price */}
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(productDetailUser.discounted_price)}
              </p>
              {/* Discount Details */}
              <p className="text-sm text-green-500 mt-2">
                Save{" "}
                {productDetailUser.discount_type === "NOMINAL"
                  ? `${formatCurrency(productDetailUser.discount_value)}`
                  : `${productDetailUser.discount_value}%`}{" "}
                OFF!
              </p>
            </div>
          ) : (
            <div className="mt-4">
              {/* Price without Discount */}
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(productDetailUser.price)}
              </p>
            </div>
          )}

          {/* Stock Section */}
          <div className="border-b border-gray-300 my-4">
            <p className="text-gray-700 font-medium">
              Stock:{" "}
              {productDetailUser.user_stock > 0
                ? productDetailUser.user_stock
                : "Out of Stock"}
            </p>
          </div>

          {/* Product Description */}
          <p className="text-sm text-gray-600">
            {productDetailUser.description}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className={`w-full py-3 mt-6 transition-colors duration-200 text-xl ${
              productDetailUser.user_stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white font-bold hover:bg-neutral-600"
            }`}
            disabled={productDetailUser.user_stock === 0}
          >
            {productDetailUser.user_stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProductPage;
