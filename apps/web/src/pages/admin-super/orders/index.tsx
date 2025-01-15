import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/redux/store";
import SuperSidebar from "@/components/SuperSidebar";
import { fetchAllOrders, setCurrentPage, setSortField, setOrderStatus, fetchStoreNames, setStoreName } from '@/redux/slices/superAdminSlice';
import { setSortOrder } from '@/redux/slices/storeAdminSlice';
import SearchField from '@/components/searchField';
import useDebounce from '@/hooks/useDebounce';
import { FaSort } from 'react-icons/fa';
import { Order } from '@/utils/adminInterface';
import LoadingVignette from '@/components/LoadingVignette';
import Pagination from '@/components/pagination';
import SelectFilter from '@/components/selectFilter';

function AllOrders() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen, storeNames, storeName, allOrders, loading, orderStatus, currentPage, sortFieldOrder, totalPages } = useSelector((state: RootState) => state.superAdmin);
  const { sortOrder } = useSelector((state: RootState) => state.storeAdmin);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const toggleSidebar = () => { dispatch({ type: 'storeAdmin/toggleSidebar' }); };

  useEffect(() => {
    dispatch(fetchStoreNames());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllOrders({
      page: currentPage, 
      sortFieldOrder, 
      sortOrder, 
      search: debouncedQuery, 
      orderStatus,
      storeName
    }));
  }, [dispatch, currentPage, sortFieldOrder, sortOrder, debouncedQuery, orderStatus, storeName]);

  const handlePageChange = (page: number) => { 
    if (page > 0 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleSort = (field: string) => {
    const updatedSortOrder =
      sortFieldOrder === field && sortOrder === "asc" ? "desc" : "asc";
    if (sortFieldOrder === field) {
      dispatch(setSortOrder(updatedSortOrder));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder("asc"));
    }
    dispatch(fetchAllOrders({ page: 1, sortFieldOrder: field, sortOrder: updatedSortOrder, orderStatus, storeName }));
  };

  const handleRowClick = (url: string) => { router.push(url); };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 'bg-yellow-500';
      case 'AWAITING_CONFIRMATION': return 'bg-blue-500';
      case 'PROCESSING': return 'bg-orange-500';
      case 'SENT': return 'bg-green-500';
      case 'ORDER_CONFIRMED': return 'bg-emerald-600';
      case 'CANCELLED': return 'bg-red-500';
      default : return 'bg-gray-500';
    }
  };

  const formatStatus = (status: string) => { return status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()); };

  const handleOrderStatusChange = (status: string) => {
    dispatch(setOrderStatus(status));
    dispatch(fetchAllOrders({
      page: 1,
      sortFieldOrder,
      sortOrder,
      search: debouncedQuery,
      orderStatus: status,
      storeName,
    }));
  };

  const handleStoreChange = (store: string) => {
    dispatch(setStoreName(store));
    dispatch(fetchAllOrders({
      page: 1,
      sortFieldOrder,
      sortOrder,
      search: debouncedQuery,
      orderStatus,
      storeName: store,
    }));
  };

  const orderStatusOptions = [
    { value: "PENDING_PAYMENT", label: "Pending Payment" },
    { value: "AWAITING_CONFIRMATION", label: "Awaiting Confirmation" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SENT", label: "Sent" },
    { value: "ORDER_CONFIRMED", label: "Order Confirmed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const storeOptions = storeNames.map((store:any) => ({
    value: store, 
    label: store
  }));


  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {loading && <LoadingVignette />}
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6 relative`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          View All Orders
        </h1>
        <div className="flex gap-6">
            <div>
                <label className="mr-2 text-sm font-semibold">Store:</label>
                <SelectFilter label="All Stores" value={storeName} options={storeOptions} onChange={handleStoreChange} />
            </div>
            <div>
                <label className="mr-2 text-sm font-semibold">Order Status:</label>
                <SelectFilter label="All Statuses" value={orderStatus} options={orderStatusOptions} onChange={handleOrderStatusChange} />
            </div>
        </div>
        <div className="my-5 flex w-full items-center">
          <SearchField searchTerm={searchQuery} onSearchChange={setSearchQuery} className="flex-grow" placeholder="Search order recipients..." />
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-xs shadow-2xl rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white uppercase text-xs">
                  <th className="p-4 text-left">Recipient</th>
                  <th className="p-4 text-left">Store</th>
                  <th className="p-4 text-left">Address</th>
                  <th className="p-4 text-left">Cart Price</th>
                  <th className="p-4 text-left">Shipping Price</th>
                  <th onClick={() => handleSort("created_at")} className="p-4 cursor-pointer">
                    <div className="flex items-center">
                      Date
                      <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                      {sortFieldOrder === "created_at"}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {(allOrders && Array.isArray(allOrders) && allOrders.length > 0) ? 
                  (allOrders.map((order: Order, index) => {
                    const isPendingPayment = order.order_status === "PENDING_PAYMENT";
                    return (
                      <tr key={order.order_id} onClick={(e) => {
                        if (isPendingPayment) {e.preventDefault()}
                        else { handleRowClick(`/admin-super/orders/payment/${order.payment_id}`)}
                      }} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} 
                        ${isPendingPayment ? "hover:bg-gray-100 cursor-default" : "hover:bg-gray-200 hover:cursor-pointer"} 
                        border-b transition-colors`} title={isPendingPayment ? "Order is pending payment" : "Click to view payment details"}>
                        <td className="p-4">{order.username}</td>
                        <td className="p-4">{order.store_name}</td>
                        <td className="p-4">{order.address}, {order.city_name}</td>
                        <td className="p-4">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(order.cart_price))}</td>
                        <td className="p-4">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(order.shipping_price))}</td>
                        <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          <div className={`${getStatusColor(order.order_status)} font-bold py-2 rounded-full text-white`}>
                            {formatStatus(order.order_status)}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}

export default AllOrders;
