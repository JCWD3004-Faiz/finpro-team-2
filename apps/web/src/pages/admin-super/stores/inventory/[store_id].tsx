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
import SuperSidebar from "@/components/SuperSidebar";
import Pagination from "@/components/pagination";
import StockJournalModal from "@/components/modal-stock";
import ErrorModal from "@/components/modal-error";
import SuccessModal from "@/components/modal-success";
import LoadingVignette from "@/components/LoadingVignette";

type Params = {
  store_id: string;
};

function ManageInventory() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const store_id = Number(params?.store_id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    store,
    inventories,
    selectedItems,
    sortField,
    sortOrder,
    currentPage,
    totalPages,
    loading,
    error,
  } = useSelector((state: RootState) => state.manageInventory);

  const {isErrorOpen, errorMessage} = useSelector(
    (state: RootState) => state.error
  );

  const {isSuccessOpen, successMessage} = useSelector(
    (state: RootState) => state.success
  )

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCheckboxChange = (inventory: {
    inventory_id: number;
    product_name: string;
  }) => {
    dispatch(toggleSelectedItem(inventory));
  };

  const handleConfirm = (inventories: {inventoryIds: number[]; stockChange: number}) => {
    dispatch(
      createStockJournal({
        storeId: store_id,
        inventoryIds: inventories.inventoryIds,
        stockChange: inventories.stockChange,
      })
    ).unwrap()
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
      })
  }

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
        })
      );
    }
  }, [store_id, currentPage, sortField, sortOrder, dispatch]);

  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);

  const toggleSidebar = () => {
    dispatch({ type: "superAdmin/toggleSidebar" });
  };
  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {loading && <LoadingVignette/>}
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
          <h2 className=" flex items-center text-xl font-semibold mb-2 text-gray-900 tracking-wide">
            <FaStore className="mr-2" />
            {store?.store_name}
          </h2>
          <h3 className="text-lg text-gray-700 flex items-center mb-2 tracking-wide">
            <FaLocationDot className="mr-2" />
            {store?.store_location}
          </h3>
          <h3 className="text-lg text-gray-700 flex items-center mb-10 tracking-wide">
            <MdOutlineAccountCircle className="mx-1" />
            {store?.User?.username}
          </h3>
        </div>

        {/* table section */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-2xl rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-left text-xs uppercase font-semibold">
                <th className="p-4">
                  <input
                    type="checkbox"
                    className="accent-gray-500 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch(selectAllItems());
                      } else {
                        dispatch(deselectAllItems());
                      }
                    }}
                    checked={
                      inventories.length > 0 &&
                      selectedItems.length === inventories.length
                    }
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
                <th className="p-4">Price</th>
                <th
                  className="p-4 cursor-pointer flex items-center"
                  onClick={() => handleSort("stock")}
                >
                  Stock
                  <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                  {sortField === "stock"}
                </th>
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
                    <input
                      type="checkbox"
                      className="accent-gray-500 cursor-pointer"
                      checked={selectedItems.some(
                        (item) => item.inventory_id === inventory.inventory_id
                      )}
                      onChange={() =>
                        handleCheckboxChange({
                          inventory_id: inventory.inventory_id,
                          product_name:
                            inventory.Product?.product_name || "Unkown Product",
                        })
                      }
                    />
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                    {inventory.Product?.product_name || "Unkown Product"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {inventory.discounted_price
                      ? `Rp. ${inventory.discounted_price}`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-gray-600">{inventory.stock}</td>
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
        <div className="w-full flex justify-center md:justify-start">
          <button
            className="bg-gray-800 text-white mt-10 px-4 py-2 rounded-md"
            onClick={openModal}
          >
            Create Journal
          </button>
        </div>

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
