import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FaChartLine, FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import { BiSolidDiscount } from 'react-icons/bi';
import { CgSpinner } from 'react-icons/cg';
import StoreSidebar from "@/components/StoreSidebar";
import { AppDispatch, RootState } from "@/redux/store"; 
import { fetchStoreByStoreId } from "@/redux/slices/storeAdminSlice";
import Cookies from 'js-cookie';

function StoreDashboard() {
  const storeId = Cookies.get("storeId");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { storeName, storeLocation, loading, error, isSidebarOpen } = useSelector((state: RootState) => state.storeAdmin);

  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreByStoreId(parseInt(storeId)));
    }
  }, [dispatch, storeId]);

  const toggleSidebar = () => {
    dispatch({ type: 'storeAdmin/toggleSidebar' });
  };

  const handleContainerClick = (url: string) => {
    router.push(url);
  };

  const handleButtonClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.location.href=url;
  };

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <StoreSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6 relative`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 h-[82vh]">
            <CgSpinner className="animate-spin text-6xl text-teal-500"/>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div> // Display error message if any
        ) : (
          <>
            <h1 className="text-4xl font-semibold text-gray-900">{storeName} Dashboard</h1>
            <h1 className="text-xl font-semibold text-gray-900 mb-10">Location: {storeLocation}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div onClick={() => handleContainerClick('/admin-store/inventory')}
                className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
              >
                <div className="flex items-center mb-4 space-x-3">
                  <FaBoxOpen className="text-teal-600 text-3xl" />
                  <h2 className="text-2xl font-semibold text-teal-600">Inventory</h2>
                </div>
                <p className="text-gray-700 my-10 text-center">Manage your store inventory from here.</p>
              </div>
              <div onClick={() => handleContainerClick('/admin-store/orders')}
                className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
              >
                <div className="flex items-center mb-4 space-x-3">
                  <FaClipboardList className="text-teal-600 text-3xl" />
                  <h2 className="text-2xl font-semibold text-teal-600">Orders</h2>
                </div>
                <p className="text-gray-700 my-10 text-center">Manage store orders here.</p>
              </div>
              <div onClick={() => handleContainerClick('/admin-store/discounts')}
                className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
              >
                <div className="flex items-center mb-4 space-x-3">
                  <BiSolidDiscount className="text-teal-600 text-3xl" />
                  <h2 className="text-2xl font-semibold text-teal-600">Discounts</h2>
                </div>
                <p className="text-gray-700 my-3 text-center">Manage your store discounts here.</p>
                <button onClick={(e) => handleButtonClick('/admin-store/discounts/create-discount', e)}
                  className="mt-3 bg-white text-teal-600 font-semibold border-2 border-teal-600 py-3 px-8 rounded-full hover:bg-teal-600 hover:text-white transition-colors transform"
                >
                  Create Discount
                </button>
              </div>
              <div onClick={() => handleContainerClick('/admin-store/reports')}
                className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
              >
                <div className="flex items-center mb-4 space-x-3">
                  <FaChartLine className="text-teal-600 text-3xl" />
                  <h2 className="text-2xl font-semibold text-teal-600">Reports</h2>
                </div>
                <p className="text-gray-700 my-10 text-center">View store sales reports here.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StoreDashboard;
