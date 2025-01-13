import { formatCurrency } from "@/utils/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart } from "@/redux/slices/cartSlice";
import useAuth from "@/hooks/useAuth";
import { toast } from 'react-toastify';
import Cookies from "js-cookie";


interface ProductCardProps {
  inventoryId: number;
  productId: number;
  productImage: string;
  productName: string;
  categoryName: string;
  userStock: number;
  price: string;
  discountedPrice: string;
  onClick: () => void;
}

export default function ProductCardLatest({
  inventoryId,
  productName,
  categoryName,
  productImage,
  userStock,
  price,
  discountedPrice,
  onClick,
}: ProductCardProps) {
  const discount = ((parseInt(price) - parseInt(discountedPrice)) / parseInt(price)) * 100;
  const user = useAuth();
  const user_id = Number(user?.id);
  const isVerified = user?.is_verified
  const dispatch = useDispatch<AppDispatch>();
  const { addresses } = useSelector((state: RootState) => state.userProfile);
  const current_store_id = Number(Cookies.get("current_store_id"));
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const handleAddToCart = async () => {
    if (user_id) {
      if (addresses.length === 0) {
        toast.info("You must set an address before shopping.");
        return;
      } 
      if (current_store_id === 28) {
        toast.error("Invalid store. Please change your address.");
        return
      }
      if (cartItems.length > 0 && cartItems[0].store_id !== current_store_id){
        toast.error("You cannot purchase from a different store");
        return;
      }
      if (isVerified === false) {
        toast.error("Please verify your email");
        return;
      }
      try {
        const resultAction = await dispatch(addToCart({ user_id, inventory_id: inventoryId }));  
        if (addToCart.rejected.match(resultAction)) {
          toast.error(String(resultAction.payload));
          return;
        }
        toast.success("Item added to cart!");
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      toast.info("Sign in to start shopping!");
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      style={{ width: "280px" }} // Fixed width for the card
    >
      <div
        className="aspect-square bg-gray-100 flex items-center justify-center text-gray-500"
        style={{ width: "100%", height: "250px" }} // Fixed height for the image container
      >
        {productImage ? (
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
            style={{ objectFit: "cover" }} // Ensures the image covers the container
          />
        ) : (
          <span>No Image Available</span>
        )}
      </div>

      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{categoryName}</div>
        <h3
          className="font-medium text-gray-900 mb-2 line-clamp-2 h-12 overflow-hidden"
          style={{ lineHeight: "1.5rem" }} // Ensures consistent spacing for two lines
        >
          {productName}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(parseInt(discountedPrice))}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(parseInt(price))}
              </span>
              <span className="text-sm font-medium text-green-600">
                {Math.round(discount)}% OFF
              </span>
            </>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Stock: {userStock} units
        </div>

        <button onClick={(e) => { e.stopPropagation(); handleAddToCart()}}
        className={`w-full py-2 px-4 transition-colors duration-200 ${userStock === 0
        ? 'bg-gray-400 cursor-not-allowed' : 'bg-neutral-800 text-white hover:bg-neutral-600'}`}
        disabled={userStock === 0}>
          {userStock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
