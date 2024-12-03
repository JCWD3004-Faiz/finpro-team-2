import React, {useState} from 'react'
import SuperSidebar from '@/components/SuperSidebar';

function ManageAdmins() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-slate-50 w-screen h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className={`ml-0 ${isSidebarOpen ? 'ml-64' : ''} md:ml-64`}>
        <div className="text-3xl font-semibold rounded-sm shadow-md border bg-white p-2 mx-5">
          <h1>Employee of the Month</h1>
        </div>

      </div>
    </div>
  )
}

export default ManageAdmins