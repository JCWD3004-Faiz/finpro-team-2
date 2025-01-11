import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter for routing
import SearchBar from "../../components/search-bar";
import ProductCard from "../../components/product-card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import LoadingVignette from "@/components/LoadingVignette";
import {
  fetchProductDetailsByInventoryId,
  fetchInventoriesUser,
  setCurrentPage,
} from "@/redux/slices/getProductsSlice";

import useDebounce from "@/hooks/useDebounce";
import ProductCardLatest from "@/components/product-card-latest";
import Pagination from "@/components/pagination";

const Products: React.FC = () => {
  const vegetablesAndFruits = [
    {
      productId: "vf1",
      productName: "Apple",
      productDescription: "Fresh, crisp apples.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf2",
      productName: "Banana",
      productDescription: "Ripe bananas from organic farms.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf3",
      productName: "Tomato",
      productDescription: "Red, juicy tomatoes.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf4",
      productName: "Cucumber",
      productDescription: "Fresh cucumbers for salads.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf5",
      productName: "Carrot",
      productDescription: "Crunchy and sweet carrots.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf6",
      productName: "Broccoli",
      productDescription: "Fresh green broccoli.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf7",
      productName: "Spinach",
      productDescription: "Organic spinach leaves.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf8",
      productName: "Pineapple",
      productDescription: "Sweet and tangy pineapples.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf9",
      productName: "Peach",
      productDescription: "Juicy and sweet peaches.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf10",
      productName: "Grapes",
      productDescription: "Fresh, seedless grapes.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf11",
      productName: "Strawberry",
      productDescription: "Sweet and ripe strawberries.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "vf12",
      productName: "Watermelon",
      productDescription: "Refreshing and juicy watermelon.",
      productImage: "https://via.placeholder.com/150",
    },
  ];

  const poultry = [
    {
      productId: "p1",
      productName: "Chicken Breast",
      productDescription: "Lean and tender chicken breast.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p2",
      productName: "Chicken Thighs",
      productDescription: "Juicy and flavorful chicken thighs.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p3",
      productName: "Duck Breast",
      productDescription: "Premium quality duck breast.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p4",
      productName: "Turkey",
      productDescription: "Farm-fresh turkey meat.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p5",
      productName: "Quail",
      productDescription: "Small, tender quail meat.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p6",
      productName: "Goose Breast",
      productDescription: "Delicious and tender goose breast.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p7",
      productName: "Chicken Wings",
      productDescription: "Perfect for grilling.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p8",
      productName: "Cornish Hen",
      productDescription: "Small, tender Cornish hen.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p9",
      productName: "Chicken Drumsticks",
      productDescription: "Juicy, flavorful chicken drumsticks.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p10",
      productName: "Chicken Sausages",
      productDescription: "Seasoned chicken sausages.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p11",
      productName: "Duck Legs",
      productDescription: "Succulent duck legs.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "p12",
      productName: "Turkey Bacon",
      productDescription: "Healthy and tasty turkey bacon.",
      productImage: "https://via.placeholder.com/150",
    },
  ];

  const dairy = [
    {
      productId: "d1",
      productName: "Cottage Cheese",
      productDescription: "Fresh, delicate Cottage Cheese",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d2",
      productName: "Hazelnut Milk",
      productDescription: "Freshly squeezed from our natural grown hazelnuts.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d3",
      productName: "Whole Milk",
      productDescription: "For your baking needs.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d4",
      productName: "Yoghurt",
      productDescription: "Freshly made daily.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d5",
      productName: "Cheddar Cheese",
      productDescription: "Aged cheddar cheese.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d6",
      productName: "Almond Milk",
      productDescription: "Nutritious almond milk.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d7",
      productName: "Butter",
      productDescription: "Creamy, fresh butter.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d8",
      productName: "Feta Cheese",
      productDescription: "Creamy and tangy feta cheese.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d9",
      productName: "Ricotta Cheese",
      productDescription: "Fresh ricotta cheese.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d10",
      productName: "Cream Cheese",
      productDescription: "Smooth and tangy cream cheese.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d11",
      productName: "Gouda Cheese",
      productDescription: "Mild and creamy gouda cheese.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "d12",
      productName: "Mozzarella Cheese",
      productDescription: "Fresh mozzarella cheese.",
      productImage: "https://via.placeholder.com/150",
    },
  ];

  const bakedGoods = [
    {
      productId: "bg1",
      productName: "Croissant",
      productDescription: "Buttery, flaky croissants.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg2",
      productName: "Baguette",
      productDescription: "Crispy on the outside, soft on the inside.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg3",
      productName: "Sourdough Bread",
      productDescription: "Freshly baked, tangy sourdough.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg4",
      productName: "Blueberry Muffin",
      productDescription: "Soft, moist blueberry muffins.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg5",
      productName: "Cinnamon Roll",
      productDescription: "Warm cinnamon rolls with icing.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg6",
      productName: "Chocolate Chip Cookie",
      productDescription: "Chewy and loaded with chocolate chips.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg7",
      productName: "Apple Pie",
      productDescription: "Classic homemade apple pie.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg8",
      productName: "Pumpkin Bread",
      productDescription: "Moist pumpkin bread with spices.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg9",
      productName: "Bagel",
      productDescription: "Soft bagels with a golden crust.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg10",
      productName: "Pecan Pie",
      productDescription: "Delicious, nutty pecan pie.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg11",
      productName: "Cheese Danish",
      productDescription: "Flaky pastry with creamy cheese filling.",
      productImage: "https://via.placeholder.com/150",
    },
    {
      productId: "bg12",
      productName: "Lemon Pound Cake",
      productDescription: "Tangy and moist lemon pound cake.",
      productImage: "https://via.placeholder.com/150",
    },
  ];

  const allProducts = [
    ...vegetablesAndFruits,
    ...poultry,
    ...dairy,
    ...bakedGoods,
  ];
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    error,
    productDetailUser,
    productAllUser,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.getProducts);
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const router = useRouter();

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      category === "all" || product.productId.startsWith(category);
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleCategoryClick = (category: string) => {
    setCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (productId: number) => {
    /* const selectedProduct = allProducts.find(
      (product) => product.productId === productId
    ); 
    if (selectedProduct) {
      
    }
      */
    router.push(`/products-page/product-details-page/${productId}`);
  };

  useEffect(() => {
    // Replace with your store_id
    const page = 1; // You can modify pagination values
    const pageSize = 12;
    const search = ""; // Add a search term if needed
    const category = ""; // Add a category if needed
    const sortField = "product_name";
    const sortOrder = "asc";

    dispatch(
      fetchInventoriesUser({
        page: currentPage,
        pageSize,
        search: debouncedQuery,
        category,
        sortField,
        sortOrder,
      })
    )
      .unwrap()
      .then((data) => {
        console.log("Fetched Inventories:", data); // Log the fetched data
      })
      .catch((err) => {
        console.error("Error fetching inventories:", err); // Log any errors
      });
  }, [dispatch, debouncedQuery, currentPage]);

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col items-center">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCategoryClick={handleCategoryClick}
      />
      {loading && <LoadingVignette />}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 mt-[15vh] mb-[3vh] p-4 justify-items-center items-center">
        {productAllUser.map((product) => (
          <ProductCardLatest
            inventoryId={product.inventory_id}
            productId={product.product_id}
            productImage={product.product_image}
            productName={product.product_name}
            categoryName={product.category_name}
            userStock={product.user_stock}
            price={String(product.price)}
            discountedPrice={String(product.discounted_price)}
            onClick={() => {
              router.push(
                `/products-page/product-details-page/${product.inventory_id}`
              );
            }}
          />
        ))}
      </div>
      <div className="mb-[3vh]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Products;
