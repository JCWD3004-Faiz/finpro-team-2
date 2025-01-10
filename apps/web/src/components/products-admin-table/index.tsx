"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FaSort } from "react-icons/fa6";
import {
  fetchAllProductsAdmin,
  deleteProduct,
  setSortField,
  setSortOrder,
  setCurrentPage,
  setSearch,
  setCategory,
} from "@/redux/slices/manageProductSlice";
import SearchField from "../searchField";
import Pagination from "../pagination";
import useDebounce from "@/hooks/useDebounce";
import { MdDelete, MdEditSquare, MdCategory } from "react-icons/md";
import router from "next/router";
import { hideConfirmation, showConfirmation } from "@/redux/slices/confirmSlice";
import { showSuccess } from "@/redux/slices/successSlice";
import { showError } from "@/redux/slices/errorSlice";

function ProductAdminTable() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCatQuery, setSearchCatQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const debounceCatQuery = useDebounce(searchCatQuery, 500);
  const {
    products,
    sortOrder,
    currentPage,
    totalPages,
    sortField,
    search,
    category,
    error,
    loading,
  } = useSelector((state: RootState) => state.manageProduct);

  const handleSort = (field: string) => {
    const updatedSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    if (sortField === field) {
      dispatch(setSortOrder(updatedSortOrder));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder("asc"));
    }
    dispatch(
      fetchAllProductsAdmin({
        page: 1,
        pageSize: 10,
        sortField: field,
        sortOrder: updatedSortOrder,
      })
    );
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleDeleteProduct = (productId: number) => {
    dispatch(
      showConfirmation({
        message: "Are you sure you want to delete this product?",
        onConfirm: () => {
          dispatch(deleteProduct(productId))
            .unwrap()
            .then(() => {
              dispatch(showSuccess("Product successfully deleted!"));
            })
            .catch((error) => {
              dispatch(
                showError(
                  error || "Failed to delete product. Please try again."
                )
              );
            })
            .finally(() => {
              dispatch(hideConfirmation());
            });
        },
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchAllProductsAdmin({
        page: currentPage,
        pageSize: 10,
        search: debouncedQuery,
        category: debounceCatQuery,
        sortField,
        sortOrder,
      })
    );
  }, [
    currentPage,
    sortField,
    sortOrder,
    debounceCatQuery,
    debouncedQuery,
    dispatch,
  ]);

  return (
    <>
      <div>
        <div className="my-5">
          <div className="flex flex-col gap-5 lg:flex-row">
            <SearchField
              className=""
              placeholder="Search products..."
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <SearchField
              className=""
              placeholder="Search categories..."
              searchTerm={searchCatQuery}
              onSearchChange={setSearchCatQuery}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full bg-white shadow-2xl rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-left text-xs uppercase font-semibold">
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("product_name")}
              >
                <div className="flex items-center">
                  Name
                  <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th className="p-4">Category</th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Price
                  <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th className="p-4">Created At</th>
              <th className="p-4">Updated At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.product_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b hover:bg-gray-100 transition-colors`}
              >
                <td className="p-4  text-gray-700 font-medium">
                  {product.product_name}
                </td>
                <td className="p-4  text-gray-700 font-medium">
                  {product.category}
                </td>
                <td className="p-4 text-gray-600">
                  {product.price
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(product.price))
                    : "N/A"}
                </td>
                <td className="p-4  text-gray-700 font-medium">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>
                <td className="p-4  text-gray-700 font-medium">
                  {new Date(product.updated_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-2 text-center whitespace-nowrap">
                  <button
                    title="Edit product"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/admin-super/products/updateProduct/${product.product_id}`
                      );
                    }}
                    className="mx-2 py-2 px-2 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
                  >
                    <MdEditSquare className="text-2xl" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.product_id)
                    }}
                    className="mx-2 py-2 px-2 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-colors transform"
                    title="Delete product"
                  >
                    <MdDelete className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default ProductAdminTable;
