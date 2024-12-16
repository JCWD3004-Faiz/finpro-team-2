import React from 'react';
import { useDispatch,useSelector  } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { FaStore, FaShoppingBag, FaUsers, FaChartLine, FaTicketAlt, FaClipboardList } from 'react-icons/fa';
import SuperSidebar from '@/components/SuperSidebar';

function SuperDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isSidebarOpen } = useSelector(
    (state: RootState) => state.superAdmin
  );

  const toggleSidebar = () => {
    dispatch({ type: 'superAdmin/toggleSidebar' });
  };

  const handleContainerClick = (url: string) => {
    router.push(url);
  };

  const handleButtonClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(url);
  };

  return (
    <div className="bg-slate-100 w-screen h-full text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10 tracking-wide">
          People Order Our Patties
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div onClick={() => handleContainerClick('/admin-super/stores')}
            className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
          >
            <div className="flex items-center mb-4 space-x-3">
              <FaStore className="text-indigo-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-indigo-600">Stores</h2>
            </div>
            <p className="text-gray-700 my-3 text-center">Manage your stores from here.</p>
            <button onClick={(e) => handleButtonClick('/admin-super/stores/create', e)}
              className="mt-3 bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-8 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
            >
              Create Store
            </button>
          </div>
          <div onClick={() => handleContainerClick('/admin-super/products')}
            className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
          >
            <div className="flex items-center mb-4 space-x-3">
              <FaShoppingBag className="text-indigo-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-indigo-600">Products</h2>
            </div>
            <p className="text-gray-700 my-3 text-center">Manage your products here.</p>
            <button onClick={(e) => handleButtonClick('/admin-super/products/create', e)}
              className="mt-3 bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-8 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
            >
              Create Product
            </button>
          </div>
          <div onClick={() => handleContainerClick('/admin-super/admins')}
            className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
          >
            <div className="flex items-center mb-4 space-x-3">
              <FaUsers className="text-indigo-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-indigo-600">Admins</h2>
            </div>
            <p className="text-gray-700 my-3 text-center">Manage your store admins here.</p>
            <button onClick={(e) => handleButtonClick('/admin-super/admins/register', e)}
              className="mt-3 bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-8 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
            >
              Register Admin
            </button>
          </div>
          <div onClick={() => handleContainerClick('/admin-super/vouchers')}
            className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
          >
            <div className="flex items-center mb-4 space-x-3">
              <FaTicketAlt className="text-indigo-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-indigo-600">Vouchers</h2>
            </div>
            <p className="text-gray-700 my-3 text-center">Manage your vouchers here.</p>
            <button onClick={(e) => handleButtonClick('/admin-super/admins/register', e)}
              className="mt-3 bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-8 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
            >
              Create Voucher
            </button>
          </div>
          <div onClick={() => handleContainerClick('/admin-super/orders')}
            className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
          >
            <div className="flex items-center mb-4 space-x-3">
              <FaClipboardList className="text-indigo-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-indigo-600">Orders</h2>
            </div>
            <p className="text-gray-700 mb-10 text-center">Manage customer orders here.</p>
          </div>
          <div onClick={() => handleContainerClick('/admin-super/reports')}
            className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between"
          >
            <div className="flex items-center mb-4 space-x-3">
              <FaChartLine className="text-indigo-600 text-3xl" />
              <h2 className="text-2xl font-semibold text-indigo-600">Reports</h2>
            </div>
            <p className="text-gray-700 mb-10 text-center">View sales reports here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperDashboard;