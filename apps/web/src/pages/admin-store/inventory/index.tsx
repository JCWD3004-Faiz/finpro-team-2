import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import StoreSidebar from "@/components/StoreSidebar";
import { AppDispatch, RootState } from "@/redux/store";

function StoreInventory() {
  const dispatch = useDispatch<AppDispatch>();

  const { isSidebarOpen } = useSelector(
    (state: RootState) => state.storeAdmin
  );

  const toggleSidebar = () => {
    dispatch({ type: 'storeAdmin/toggleSidebar' });
  };

  return (
    <div className="bg-slate-100 w-screen h-full text-gray-800">
      <StoreSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6 relative`}>
        StoreInventory
      </div>
    </div>
  )
}

export default StoreInventory