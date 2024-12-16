"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchStoreByStoreId,
  fetchInventoriesByStoreId,
  createStockJournal,
  setCurrentPage,
  setSortField,
  setSortOrder,
  toggleSelectedItem,
  selectAllItems,
  deselectAllItems,
} from "@/redux/slices/manageInventorySlice";
import { showError, hideError } from "@/redux/slices/errorSlice";
import { showSuccess, hideSuccess } from "@/redux/slices/successSlice";
import { FaLocationDot, FaStore, FaSort } from "react-icons/fa6";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LuPackage } from "react-icons/lu";
import useDebounce from "@/hooks/useDebounce";
import SuperSidebar from "@/components/SuperSidebar";
import Pagination from "@/components/pagination";
import SearchField from "@/components/searchField";
import BulkAction from "@/components/Bulk-action";
import StockJournalModal from "@/components/modal-stock";
import ErrorModal from "@/components/modal-error";
import SuccessModal from "@/components/modal-success";
import LoadingVignette from "@/components/LoadingVignette";
import { Checkbox } from "@/components/ui/checkbox";

function ManageInventory() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const store_id = Number(params?.store_id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const {
    store,
    inventories,
    selectedItems,
    sortField,
    sortOrder,
    currentPage,
    totalPages,
    totalItems,
    loading,
    error,
  } = useSelector((state: RootState) => state.manageInventory);

  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);

  const toggleSidebar = () => {
    dispatch({ type: "superAdmin/toggleSidebar" });
  };

  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );

  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCheckboxChange = (inventory: {
    inventory_id: number;
    product_name: string;
  }) => {
    dispatch(toggleSelectedItem(inventory));
  };

  const handleConfirm = (inventories: {
    inventoryIds: number[];
    stockChange: number;
  }) => {
    dispatch(
      createStockJournal({
        storeId: store_id,
        inventoryIds: inventories.inventoryIds,
        stockChange: inventories.stockChange,
      })
    )
      .unwrap()
      .then((message) => {
        dispatch(showSuccess(message || "Stock journal created successfully"));
        closeModal();
        setTimeout(() => {
          router.push("/admin-super");
        }, 3000);
      })
      .catch((error) => {
        console.error("Failed to create stock journal: ", error);
        dispatch(showError(error));
      });
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
        storeId: store_id,
        page: 1,
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

  useEffect(() => {
    if (error) {
      dispatch(showError(error));
    }
  }, [error]);

  useEffect(() => {
    if (store_id) {
      dispatch(fetchStoreByStoreId(store_id));
      dispatch(
        fetchInventoriesByStoreId({
          storeId: store_id,
          page: currentPage,
          sortField,
          sortOrder,
          search: debouncedQuery,
        })
      );
    }
  }, [store_id, currentPage, sortField, sortOrder, debouncedQuery, dispatch]);
  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {loading && <LoadingVignette />}
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => dispatch(hideError())}
        errorMessage={errorMessage}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => dispatch(hideSuccess())}
        successMessage={successMessage}
      />
      <div className={`ml-0 ${isSidebarOpen ? "md:ml-64" : ""} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Inventory Management
        </h1>
        <div>
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <div>
              <h2 className=" flex items-center text-xl mb-2 text-gray-700 tracking-wide">
                <FaStore className="flex items-center mr-2" />
                {store?.store_name}
              </h2>
              <h3 className="text-sm text-gray-700 flex items-center mb-2 tracking-wide">
                <FaLocationDot className="flex items-center mr-2" />
                {store?.store_location}
              </h3>
              <h3 className="text-sm text-gray-700 flex items-center tracking-wide">
                <MdOutlineAccountCircle className="flex items-center mr-2" />
                {store?.User?.username}
              </h3>
            </div>
            <div className="w-full mt-2 sm:w-1/2 lg:w-1/4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-gray-700 text-sm font-medium ">
                    Total Products
                  </CardTitle>
                  <LuPackage className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="my-5">
            <SearchField
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <BulkAction
            selectedProducts={selectedItems}
            onUpdateStock={openModal}
          />
        </div>

        {/* table section */}
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full bg-white shadow-2xl rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-left text-xs uppercase font-semibold">
                <th className="p-4">
                  <Checkbox
                    className="bg-white cursor-pointer rounded-sm"
                    checked={
                      inventories.length > 0 &&
                      selectedItems.length === inventories.length
                    }
                    onCheckedChange={(isChecked) => {
                      if (isChecked) {
                        dispatch(selectAllItems());
                      } else {
                        dispatch(deselectAllItems());
                      }
                    }}
                  />
                </th>
                <th
                  className="p-4 cursor-pointer flex items-center"
                  onClick={() => handleSort("product_name")}
                >
                  Product Name
                  <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                  {sortField === "product_name"}
                </th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th
                  className="p-4 cursor-pointer flex items-center"
                  onClick={() => handleSort("stock")}
                >
                  Stock
                  <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                  {sortField === "stock"}
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
                  <td className="p-4">
                    <Checkbox
                      className="cursor-pointer"
                      checked={selectedItems.some(
                        (item) => item.inventory_id === inventory.inventory_id
                      )}
                      onCheckedChange={(isChecked) =>
                        handleCheckboxChange({
                          inventory_id: inventory.inventory_id,
                          product_name:
                            inventory.Product?.product_name ||
                            "Unknown Product",
                        })
                      }
                    />
                  </td>
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
                  <td>{new Date(inventory.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* StockJournalModal Component */}
        <StockJournalModal
          isOpen={isModalOpen}
          onClose={closeModal}
          inventories={selectedItems}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}

export default ManageInventory;
