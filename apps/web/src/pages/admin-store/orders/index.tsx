import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/redux/store";
import StoreSidebar from "@/components/StoreSidebar";
import { fetchStoreByStoreId, fetchStoreOrders, setCurrentPage, setSortField, setOrderStatus, setSortOrder } from '@/redux/slices/storeAdminSlice';
import Cookies from 'js-cookie';
import SearchField from '@/components/searchField';
import useDebounce from '@/hooks/useDebounce';
import { FaSort } from 'react-icons/fa';
import { Order } from '@/utils/adminInterface';
import LoadingVignette from '@/components/LoadingVignette';
import Pagination from '@/components/pagination';
import SelectFilter from '@/components/selectFilter';

function StoreOrders() {
  const router = useRouter();
  const store_id = Cookies.get("storeId");
  const storeId = Number(store_id);
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen, storeName, storeOrders, loading, orderStatus, currentPage, sortField, totalPages, sortOrder } = useSelector((state: RootState) => state.storeAdmin);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const toggleSidebar = () => {dispatch({ type: 'storeAdmin/toggleSidebar' });};

  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreByStoreId(storeId));
      dispatch(fetchStoreOrders({
        storeId, 
        page: currentPage, 
        sortField, 
        sortOrder, 
        search: debouncedQuery, 
        orderStatus
      }));
    }
  }, [dispatch, storeId, currentPage, sortField, sortOrder, debouncedQuery, orderStatus]);

  const handlePageChange = (page: number) => { 
    if (page > 0 && page <= totalPages) {
      dispatch(setCurrentPage(page))
    }
  };

  const handleSort = (field: string) => {
    const updatedSortOrder =
      sortField === field && sortOrder === "desc" ? "asc" : "desc";
    if (sortField === field) {
      dispatch(setSortOrder(updatedSortOrder));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder("desc"));
    }
    dispatch(fetchStoreOrders({ storeId, page: 1, sortField: field, sortOrder: updatedSortOrder, orderStatus }));
  };

  const handleRowClick = (url: string) => {router.push(url)};

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

  const formatStatus = (status: string) => {return status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())};

  const handleOrderStatusChange = (status: string) => {
    dispatch(setOrderStatus(status));
    dispatch(fetchStoreOrders({
      storeId,
      page: 1,
      sortField,
      sortOrder,
      search: debouncedQuery,
      orderStatus: status
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

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <StoreSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {loading && <LoadingVignette />}
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6 relative`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          {storeName} Orders
        </h1>
        <div className="my-5 flex w-full items-center">
          <SearchField searchTerm={searchQuery} onSearchChange={setSearchQuery} className="flex-grow" placeholder="Search order recipients..."/>
          <div className="ml-5">
            <label className="mr-2 text-sm font-semibold">Order Status:</label>
            <SelectFilter label="All Statuses" value={orderStatus} options={orderStatusOptions} onChange={handleOrderStatusChange}/>
          </div>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm shadow-2xl rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white uppercase text-xs">
                  <th className="p-4 text-left">Order Recipient</th>
                  <th className="p-4 text-left">Destination Address</th>
                  <th className="p-4 text-left">Cart Price</th>
                  <th className="p-4 text-left">Shipping Price</th>
                  <th  onClick={() => handleSort("created_at")} className="p-4 cursor-pointer">
                    <div className='flex items-center'>
                      Order Date
                      <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                      {sortField === "created_at"}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {(storeOrders && Array.isArray(storeOrders) && storeOrders.length > 0) ? 
                (storeOrders.map((order: Order, index) => { const isPendingPayment = order.order_status === "PENDING_PAYMENT" && "CANCELLED";
                  return (
                  <tr key={order.order_id} onClick={(e) => { if (isPendingPayment) {e.preventDefault() 
                  } else { handleRowClick(`/admin-store/orders/payment/${order.payment_id}`)}}}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} 
                  ${isPendingPayment ? "hover:bg-gray-100 cursor-default" : "hover:bg-gray-200 hover:cursor-pointer"} 
                  border-b transition-colors`} title={isPendingPayment ? "Payment unavailable" : "Click to view payment details"}
                  >
                    <td className="p-4">{order.username}</td>
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

export default StoreOrders;
