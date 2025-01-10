"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FaSort } from "react-icons/fa6";
import SearchField from "../searchField";
import Pagination from "../pagination";
import useDebounce from "@/hooks/useDebounce";
import router from "next/router";
import Cookies from "js-cookie";
import {
  fetchDiscountsAdmin,
  deleteDiscount,
  setSortField,
  setSortOrder,
  setCurrentPage,
  setSearch,
} from "@/redux/slices/getDiscountSlice";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { showSuccess } from "@/redux/slices/successSlice";
import { showError } from "@/redux/slices/errorSlice";
import {
  showConfirmation,
  hideConfirmation,
} from "@/redux/slices/confirmSlice";

function DiscountAdminTable() {
  const storeId = Cookies.get("storeId");
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { discounts, sortField, sortOrder, currentPage, totalPages } =
    useSelector((state: RootState) => state.getDiscount);

  const getActiveColor = (active: boolean) => {
    switch (active) {
      case true:
        return "bg-green-500";
      case false:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleSort = (field: string) => {
    const updatedSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    if (sortField === field) {
      dispatch(setSortOrder(updatedSortOrder));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder("asc"));
    }
    if (storeId) {
      dispatch(
        fetchDiscountsAdmin({
          storeId: parseInt(storeId),
          page: 1,
          pageSize: 10,
          sortField: field,
          sortOrder: updatedSortOrder,
        })
      );
    }
  };

  const handleDeleteDiscount = (discountId: number) => {
    dispatch(
      showConfirmation({
        message: "Are you sure you want to delete this discount?",
        onConfirm: () => {
          dispatch(deleteDiscount(discountId))
            .unwrap()
            .then(() => {
              dispatch(showSuccess("Discount successfully deleted"));
            })
            .catch((error) => {
              dispatch(showError(error || "Failed to delete discount"));
            })
            .finally(() => {
              dispatch(hideConfirmation());
            });
        },
      })
    );
  };

  useEffect(() => {
    if (storeId) {
      dispatch(
        fetchDiscountsAdmin({
          storeId: parseInt(storeId),
          page: currentPage,
          sortField,
          sortOrder,
          search: debouncedQuery,
        })
      );
    }
  }, [dispatch, currentPage, sortField, sortOrder, debouncedQuery]);
  return (
    <>
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full bg-white shadow-2xl rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-left text-xs uppercase font-semibold">
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center">
                  Discount Type
                  <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Value</th>
              <th className="p-4">Active</th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("start_date")}
              >
                <div className="flex items-center">
                  Start Date
                  <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("end_date")}
              >
                <div className="flex items-center">
                  End Date
                  <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th className="p-4">Created At</th>
              <th className="p-4">Updated At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount, index) => (
              <tr
                key={discount.discount_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b text-sm hover:bg-gray-100 transition-colors`}
              >
                <td className="p-4 text-gray-700 font-medium">
                  {discount.type || "Unkown Product"}
                </td>
                <td className="p-4 text-gray-700 font-medium">
                  {discount.product_name || "Unkown Product"}
                </td>
                <td className="p-4 text-gray-700 font-medium">
                  {discount.type === "PERCENTAGE"
                    ? `${discount.value}%`
                    : discount.type === "BOGO"
                      ? "Buy One Get One"
                      : new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(discount.value))}
                </td>
                <td className="p-4 text-gray-700 text-sm text-center">
                  <div
                    className={`${getActiveColor(discount.is_active)} font-bold py-2 rounded-full text-white`}
                  >
                    {discount.is_active ? "Yes" : "No"}
                  </div>
                </td>
                <td>{new Date(discount.start_date).toLocaleDateString()}</td>
                <td>{new Date(discount.end_date).toLocaleDateString()}</td>
                <td>{new Date(discount.created_at).toLocaleDateString()}</td>
                <td>{new Date(discount.updated_at).toLocaleDateString()}</td>
                <td className="">
                  <div className="flex justify-center items-center h-full">
                    <button
                      title="Edit product"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/admin-store/discounts/update-discount/${discount.discount_id}`
                        );
                      }}
                      className="py-2 px-2 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
                    >
                      <MdEditSquare className="text-2xl" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDiscount(discount.discount_id);
                      }}
                      className="py-2 px-2 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-colors transform"
                      title="Delete product"
                    >
                      <MdDelete className="text-2xl" />
                    </button>
                  </div>
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

export default DiscountAdminTable;
