import { formatCurrency } from "@/utils/formatCurrency";

interface ProductCardProps {
  inventoryId: number;
  productId: number;
  productImage: string;
  productName: string;
  categoryName: string;
  userStock: number;
  price: string;
  discountedPrice: string;
  discountType: string | null;
  discountValue: number | null;
  onClick: () => void;
}

export default function ProductCardLatest({
  productName,
  categoryName,
  productImage,
  userStock,
  price,
  discountedPrice,
  discountType,
  discountValue,
  onClick,
}: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      style={{ width: "280px",  height: "500px"  }} // Fixed width for the card
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

        <div className="flex items-baseline gap-2 mb-2 h-14">
          {discountedPrice && discountedPrice !== price ? (
            <>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(parseInt(discountedPrice))}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(parseInt(price))}
                </span>
              </div>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(parseInt(price))}
            </span>
          )}
          {discountType === "PERCENTAGE" && discountValue && (
            <span className="text-sm font-medium text-green-600">
              {Math.round(discountValue)}% OFF
            </span>
          )}
          {discountType === "NOMINAL" && discountValue && (
            <span className="text-sm font-medium text-green-600">
              {formatCurrency(discountValue)} OFF
            </span>
          )}
          {discountType === "BOGO" && (
            <span className="text-sm font-medium text-green-600">
              Buy One Get One Free
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Stock: {userStock} units
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
          className="w-full bg-neutral-800 text-white py-2 px-4 hover:bg-neutral-600 transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
