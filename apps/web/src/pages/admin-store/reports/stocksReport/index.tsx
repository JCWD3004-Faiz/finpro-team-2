"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchStocksStore } from "@/redux/slices/storeStockSlice";
import StoreSidebar from "@/components/StoreSidebar";
import LoadingVignette from "@/components/LoadingVignette";
import { Button } from "@/components/ui/button";
import SearchField from "@/components/searchField";
import useDebounce from "@/hooks/useDebounce";

function StoreStocksReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen } = useSelector((state: RootState) => state.storeAdmin);
  const { stocksData, currentPage, totalPages, storeId, loading, error } =
    useSelector((state: RootState) => state.storeStocks);

  useEffect(() => {
    dispatch(
      fetchStocksStore({ page: currentPage, search: debouncedQuery })
    );
  }, [dispatch, currentPage, debouncedQuery]);

  console.log("stocks data: ", stocksData);

  const toggleSidebar = () => {
    dispatch({ type: "storeAdmin/toggleSidebar" });
  };

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <StoreSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Stocks Report
        </h1>
        <SearchField
              className=""
              placeholder="Search products..."
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
            />
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full bg-white shadow-2xl rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-left text-xs uppercase font-semibold">
                <th className="p-4">Product</th>
                <th className="p-4">Store</th>
                <th className="p-4">Change Type</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Previous Stock</th>
                <th className="p-4">New Stock</th>
                <th className="p-4">Change Category</th>
                <th className="p-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {stocksData.map((stock, index) => (
                <tr
                  key={stock.journal_id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-4  text-gray-700 font-medium">
                    {stock.inventory_name}
                  </td>
                  <td className="p-4  text-gray-700 font-medium">
                    {stock.store_name}
                  </td>
                  <td className="p-4  text-gray-700 font-medium">
                    {stock.change_type}
                  </td>
                  <td className="p-4  text-gray-700 font-medium">
                    {stock.change_quantity}
                  </td>
                  <td className="p-4  text-gray-700 font-medium">
                    {stock.prev_stock}
                  </td>
                  <td className="p-4  text-gray-700 font-medium">
                    {stock.new_stock}
                  </td>
                  <td className="p-4  text-gray-700 font-medium">
                    {stock.change_category}
                  </td>
                  <td className="p-4  text-gray-700 font-medium">
                    {new Date(stock.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StoreStocksReports;
