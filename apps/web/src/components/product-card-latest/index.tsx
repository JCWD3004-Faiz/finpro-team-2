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
  onClick: () => void;
}

export default function ProductCardLatest({
  productName,
  categoryName,
  productImage,
  userStock,
  price,
  discountedPrice,
  onClick,
}: ProductCardProps) {
  const discount =
    ((parseInt(price) - parseInt(discountedPrice)) / parseInt(price)) * 100;

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
