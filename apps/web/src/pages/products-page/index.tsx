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

 /*  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      category === "all" || product.productId.startsWith(category);
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }); */

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
            discountType={product.discount_type}  
            discountValue={product.discount_value}
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
