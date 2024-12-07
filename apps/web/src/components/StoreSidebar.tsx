import React from 'react';
import Cookies from 'js-cookie';
import { FaChartLine, FaBars, FaTimes, FaTh, FaSignOutAlt, FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import { BiSolidDiscount } from 'react-icons/bi';

interface StoreSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

function StoreSidebar ({ isSidebarOpen, toggleSidebar }: StoreSidebarProps) {

  function logOut() {
    Cookies.remove("access_token");
    Cookies.remove("storeId");
    window.location.href = "/";
  }

  return (
    <div className="flex">
      <div
        className={`fixed left-0 top-0 h-full bg-gray-800 text-white w-64 transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:block z-30`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold">Store Admin Panel</h2>
          <button
            className="text-white md:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <ul className="space-y-4 mt-8">
          <li>
            <a href="/admin-store/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded">
              <FaTh className="mr-3" />
              Dashboard
            </a>
          </li>
          <li>
            <a href="/admin-store/inventory" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded">
              <FaBoxOpen className="mr-3" />
              Inventory
            </a>
          </li>
          <li>
            <a href="/admin-store/orders" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded">
              <FaClipboardList className="mr-3" />
              Orders
            </a>
          </li>
          <li>
            <a href="/admin-store/discounts" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded">
              <BiSolidDiscount className="mr-3" />
              Discounts
            </a>
          </li>
          <li>
            <a href="/admin-store/reports" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded">
              <FaChartLine className="mr-3" />
              Reports
            </a>
          </li>
        </ul>
      </div>

      <div className="flex-1 md:ml-0">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <button
              className="text-white md:hidden"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <button onClick={logOut}
            className="md:hidden hover:bg-gray-700 rounded ml-56 flex items-center">
              <FaSignOutAlt className="mr-3"/>
              Log Out
            </button>
          </div>

          <div className="hidden md:flex space-x-6">
            <button onClick={logOut}
            className="hover:bg-gray-700 px-3 rounded flex items-center">
              <FaSignOutAlt className="mr-3"/>
              Log Out
            </button>
          </div>
        </div>

        <div className="p-2">
        </div>
      </div>
    </div>
  );
};

export default StoreSidebar;