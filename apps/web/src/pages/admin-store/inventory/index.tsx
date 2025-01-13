import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoreSidebar from "@/components/StoreSidebar";
import { AppDispatch, RootState } from "@/redux/store";
import { FaSort, FaStore } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LuPackage } from "react-icons/lu";
import SearchField from "@/components/searchField";
import useDebounce from "@/hooks/useDebounce";
import {
  fetchInventoriesByStoreId,
  setCurrentPage,
  setSortField,
  setSortOrder,
} from "@/redux/slices/storeInventorySlice";
import { fetchStoreByStoreId } from "@/redux/slices/storeAdminSlice";
import Cookies from "js-cookie";
import Pagination from "@/components/pagination";
import LoadingVignette from "@/components/LoadingVignette";

function StoreInventory() {
  const storeId = Cookies.get("storeId");
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { isSidebarOpen, storeLocation, storeName } = useSelector(
    (state: RootState) => state.storeAdmin
  );
  const {
    store,
    inventories,
    sortField,
    sortOrder,
    currentPage,
    totalPages,
    totalItems,
    loading,
    error,
  } = useSelector((state: RootState) => state.storeInventory);

  const toggleSidebar = () => {
    dispatch({ type: "storeAdmin/toggleSidebar" });
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
    dispatch(
      fetchInventoriesByStoreId({
        page: 1,
        sortField: field,
        sortOrder: updatedSortOrder,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchInventoriesByStoreId({
        page: currentPage,
        sortField,
        sortOrder,
        search: debouncedQuery,
      })
    );
  }, [currentPage, sortField, sortOrder, debouncedQuery, dispatch]);
  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreByStoreId(parseInt(storeId)));
    }
  }, [dispatch, storeId]);
  console.log(inventories);

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <StoreSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {loading && <LoadingVignette />}
      <div
        className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6 relative`}
      >
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Inventory
        </h1>
        <div>
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <div>
              <h2 className=" flex items-center text-xl mb-2 text-gray-700 tracking-wide">
                <FaStore className="flex items-center mr-2" />
                {storeName}
              </h2>
              <h3 className="text-sm text-gray-700 flex items-center mb-2 tracking-wide">
                <FaLocationDot className="flex items-center mr-2" />
                {storeLocation}
              </h3>
            </div>
            <div className="w-full mt-2 sm:w-1/2 lg:w-1/4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-gray-700 text-sm font-medium ">
                    Total Products
                  </CardTitle>
                  <LuPackage className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="my-5">
            <SearchField
              className=""
              placeholder="Search products..."
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
            />
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
                      Product Name
                      <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                    {sortField === "product_name"}
                  </th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th
                    className="p-4 cursor-pointer"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center">
                      Stock
                      <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                    {sortField === "stock"}
                  </th>
                  <th className="p-4">User Stock</th>
                  <th
                    className="p-4 cursor-pointer"
                    onClick={() => handleSort("items_sold")}
                  >
                    <div className="flex items-center">
                      Items Sold
                      <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                    {sortField === "items_sold"}
                  </th>
                  <th className="p-4">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {inventories.map((inventory, index) => (
                  <tr
                    key={inventory.inventory_id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b hover:bg-gray-100 transition-colors`}
                  >
                    <td className="p-4 text-gray-700 font-medium">
                      {inventory.Product?.product_name || "Unkown Product"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {inventory.Product?.Category?.category_name}
                    </td>
                    <td className="p-4 text-gray-600">
                      {inventory.discounted_price
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0, // Ensures no decimals like "Rp. 35.000"
                          }).format(Number(inventory.discounted_price))
                        : "N/A"}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        inventory.stock < 10 ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      {inventory.stock}
                    </td>
                    <td className="p-4 text-gray-600">
                      {inventory.user_stock}
                    </td>
                    <td className="p-4 text-gray-600">
                      {inventory.items_sold}
                    </td>
                    <td>
                      {new Date(inventory.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default StoreInventory;
