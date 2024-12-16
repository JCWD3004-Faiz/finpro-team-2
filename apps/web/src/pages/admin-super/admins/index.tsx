import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CgSpinner } from 'react-icons/cg';
import { MdDelete, MdSaveAs } from 'react-icons/md';
import { fetchAllStores, fetchStoreAdmins, assignStoreAdmin, deleteStoreAdmin } from '@/redux/slices/superAdminSlice';
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';
import { StoreAdmin, User } from '@/utils/adminInterface';
import { setEditId, setEditAdminData, setStoreSuggestions, setSuggestionsPosition, resetEditState } from '@/redux/slices/superAdminSlice';
import { FaUserEdit } from 'react-icons/fa';

function ManageAdmins() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [isTableRendered, setIsTableRendered] = useState(false);

  useEffect(() => {
    if (tableRef.current) {setIsTableRendered(true)}
  }, []);

  const { storeAdmins, loading, isSidebarOpen, editId, suggestionsPosition, editAdminData, storeSuggestions, allStores } = useSelector(
    (state: RootState) => state.superAdmin
  )

  useEffect(() => {
    dispatch(fetchStoreAdmins());
    dispatch(fetchAllStores());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        dispatch(resetEditState())
        dispatch(setStoreSuggestions([]));
      }}
    if (isTableRendered) {document.addEventListener('mousedown', handleClickOutside)}
    return () => {document.removeEventListener('mousedown', handleClickOutside)}
  }, [dispatch, isTableRendered]);

  const toggleSidebar = () => {
    dispatch({ type: 'superAdmin/toggleSidebar' });
  };

  const handleEditClick = (admin: User) => {
    if (editId === admin.user_id) {
      if (isValidStoreName(editAdminData.storeName)) {
        const assignedStoreId = editAdminData.storeId !== 0 ? editAdminData.storeId : admin.store_id;
        const assignPayload: any = { user_id: admin.user_id, store_id: assignedStoreId};
        dispatch(assignStoreAdmin(assignPayload));
        dispatch(resetEditState());
      } else {
        alert('Please select a valid store.');
      }
    } else {
      dispatch(setEditId(admin.user_id));
      dispatch(setEditAdminData({ storeName: admin.store_name, storeId: admin.store_id}));
    }
  };

  const handleDeleteAdmin = (user_id: number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {dispatch(deleteStoreAdmin(user_id))}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    dispatch(setEditAdminData({...editAdminData, [field]: value}));
    if (field === 'storeName') {
      const filteredSuggestions = getStoreSuggestions(value);
      dispatch(setStoreSuggestions(filteredSuggestions));
      const rect = e.target.getBoundingClientRect();
      dispatch(setSuggestionsPosition({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX}));
    }
  };

  const handleSuggestionClick = (suggestion: { store_name: string, store_id: number }) => {
    dispatch(setEditAdminData({ ...editAdminData, storeName: suggestion.store_name, storeId: suggestion.store_id}));
    dispatch(setStoreSuggestions([]));
  };

  const getStoreSuggestions = (input: string) => {
    return allStores.filter((store) => store.store_name.toLowerCase().includes(input.toLowerCase()));
  };

  const isValidStoreName = (storeName: string) => {
    return allStores.some((store) => store.store_name.toLowerCase() === storeName.toLowerCase());
  };
  
  return (
    <div className="bg-slate-100 w-screen h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64`}>
        <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10 tracking-wide">
          Employee of the Month
        </h1>
        <div className="md:ml-6 ml-1 mb-2">
          <button onClick={() => router.push({ pathname: '/admin-super/admins/register' })}
          className="bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-8 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform">
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
              <table ref={tableRef} className="min-w-full bg-white text-sm">
                <thead>
                  <tr className="bg-slate-200 text-gray-700">
                    <th className="py-3 px-10 text-center">Username</th>
                    <th className="py-3 px-6 text-center">Email</th>
                    <th className="py-3 px-10 text-center">Assigned Store</th>
                    <th className="py-3 px-10 text-center">Register Date</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storeAdmins.map((admin:StoreAdmin, key:number) => (
                    <tr key={key} className="text-gray-700 bg-white">
                      <td className="py-3 px-1 text-center border-b-2 border-zinc-50">{admin.username}</td>
                      <td className="py-3 px-1 text-center border-b-2 border-zinc-50">{admin.email}</td>
                      <td className="py-3 px-1 text-center border-b-2 border-zinc-50">
                      {editId === admin.user_id ? (
                          <div className="relative">
                            <input type="text" value={editAdminData.storeName} onChange={(e) => handleChange(e, 'storeName')}
                              className="text-center border-b-2 border-indigo-600 focus:outline-none"
                            />
                          </div>
                        ) : ( admin.store_name )
                      }
                      </td>
                      <td className="py-3 px-1 text-center border-b-2 border-zinc-50">{new Date(admin.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-2 text-center whitespace-nowrap border-b-2 border-zinc-50">
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(admin)}}
                        className="mx-2 py-2 px-2 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform">
                          {editId === admin.user_id ? ( <MdSaveAs className="text-2xl" /> ) : ( <FaUserEdit className="text-2xl" /> )}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteAdmin(admin.user_id)}}
                        className="mx-2 py-2 px-2 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-colors transform">
                          <MdDelete className="text-2xl"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {storeSuggestions.length > 0 && (
                  <div className="absolute z-50 bg-white border border-gray-300 shadow-md rounded-lg max-h-40 overflow-auto"
                  style={{ top: `${suggestionsPosition.top}px`, left: `${suggestionsPosition.left}px`, width: '200px',}}>
                    {storeSuggestions.map((suggestion, index) => (
                      <div key={index} onClick={() => handleSuggestionClick(suggestion)} 
                      className={`px-4 py-2 cursor-pointer hover:bg-indigo-100 ${suggestion.store_admin === 'Unassigned' ? 'bg-gray-100' : ''}`}
                      >
                        {suggestion.store_name}
                      </div>
                    ))}
                  </div>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageAdmins;
