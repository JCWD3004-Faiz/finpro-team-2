import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CgSpinner } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import { fetchStoreAdmins } from '@/redux/slices/superAdminSlice'; // Import the thunk
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';
import { StoreAdmin } from '@/utils/adminInterface';

function ManageAdmins() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { storeAdmins, loading, isSidebarOpen } = useSelector(
    (state: RootState) => state.superAdmin
  );

  useEffect(() => {
    dispatch(fetchStoreAdmins());
  }, [dispatch]);

  const toggleSidebar = () => {
    dispatch({ type: 'superAdmin/toggleSidebar' });
  };

  return (
    <div className="bg-slate-100 w-screen h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64`}>
        <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10 tracking-wide">
          Employee of the Month
        </h1>
        <div className="md:ml-6 ml-1 mb-2">
          <button
            onClick={() => router.push({ pathname: '/admin-super/admins/register' })}
            className="bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-8 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
          >
            Register Admin
          </button>
        </div>
        <div className="md:px-5">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <CgSpinner className="animate-spin text-6xl text-indigo-500" />
            </div>
          ) : (
            <div className="flex overflow-x-auto max-w-[343px] min-w-full shadow-xl rounded-md">
              <table className="min-w-full bg-white text-sm">
                <thead>
                  <tr className="bg-slate-200 text-gray-700">
                    <th className="py-3 px-10 text-center">Username</th>
                    <th className="py-3 px-6 text-center">Email</th>
                    <th className="py-3 px-10 text-center">Assigned Store</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storeAdmins.map((admin:StoreAdmin, key:number) => (
                    <tr key={key} className="text-gray-700 bg-white">
                      <td className="py-3 px-1 text-center border-b-2 border-zinc-50">{admin.username}</td>
                      <td className="py-3 px-1 text-center border-b-2 border-zinc-50">{admin.email}</td>
                      <td className="py-3 px-1 text-center border-b-2 border-zinc-50">{admin.store_name}</td>
                      <td className="py-3 px-2 text-center whitespace-nowrap border-b-2 border-zinc-50">
                      <button className="mx-2 py-2 px-2 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-colors transform">
                          <MdDelete className="text-2xl"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageAdmins;
