import React from 'react'
import { useDispatch,useSelector  } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';

function CreateStore() {
  const dispatch = useDispatch<AppDispatch>();


  const { isSidebarOpen } = useSelector(
    (state: RootState) => state.superAdmin
  );

  const toggleSidebar = () => {
    dispatch({ type: 'superAdmin/toggleSidebar' });
  };

  return (
    <div className="bg-slate-100 w-screen h-full text-gray-800">
    <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6`}>
      <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10 tracking-wide">
        Create Store
      </h1>
      
    </div>
  </div>
  )
}

export default CreateStore