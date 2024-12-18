import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { MdDelete, MdSaveAs } from 'react-icons/md';
import { fetchAllStores, fetchStoreAdmins, assignStoreAdmin, deleteStoreAdmin } from '@/redux/slices/superAdminSlice';
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';
import { StoreAdmin, User } from '@/utils/adminInterface';
import { setSortFieldAdmin, setEditId, setEditAdminData, setStoreSuggestions, setSuggestionsPosition, resetEditState } from '@/redux/slices/superAdminSlice';
import { FaUserEdit, FaUserPlus } from 'react-icons/fa';
import { setSortOrder, setCurrentPage } from '@/redux/slices/manageInventorySlice';
import { FaSort } from 'react-icons/fa';
import SearchField from '@/components/searchField';
import useDebounce from '@/hooks/useDebounce';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import LoadingVignette from '@/components/LoadingVignette';
import SuccessModal from '@/components/modal-success';
import ErrorModal from '@/components/modal-error';
import { showError, hideError } from "@/redux/slices/errorSlice";
import { showSuccess, hideSuccess } from "@/redux/slices/successSlice";

function ManageAdmins() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [isTableRendered, setIsTableRendered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (tableRef.current) {setIsTableRendered(true)}
  }, []);

  const { totalPages, sortFieldAdmin, storeAdmins, loading, isSidebarOpen, editId, suggestionsPosition, editAdminData, storeSuggestions, allStores } = useSelector(
    (state: RootState) => state.superAdmin
  )
  const { sortOrder, currentPage } = useSelector((state: RootState) => state.manageInventory);

  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );
  

  useEffect(() => {
    dispatch(fetchStoreAdmins({ page: currentPage, sortFieldAdmin, sortOrder, search: debouncedQuery }));
    dispatch(fetchAllStores({} as any));
  }, [dispatch, currentPage, sortFieldAdmin, sortOrder, debouncedQuery]);

  const handlePageChange = (page: number) => { if (page > 0 && page <= totalPages) {dispatch(setCurrentPage(page))}};
  
  const handleSort = (field: string) => {
    const updatedSortOrder =
      sortFieldAdmin === field && sortOrder === "asc" ? "desc" : "asc";
    if (sortFieldAdmin === field) {
      dispatch(setSortOrder(updatedSortOrder));
    } else {
      dispatch(setSortFieldAdmin(field));
      dispatch(setSortOrder("asc"));
    }
    dispatch(fetchStoreAdmins({ page: 1, sortFieldAdmin: field, sortOrder: updatedSortOrder }));
  };  

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
        dispatch(showSuccess("Store admin successfully assigned"));
      } else {
        dispatch(showError('Please select a valid store.'));        
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
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {loading && <LoadingVignette />}
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => dispatch(hideError())}
        errorMessage={errorMessage}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {dispatch(hideSuccess()); window.location.reload()}}        
        successMessage={successMessage}
      />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Manage Store Admins
        </h1>
        <div className="ml-1 mb-2">
          <Button size="default" onClick={() => router.push({ pathname: '/admin-super/admins/register' })}>
            <FaUserPlus/>
            Register Admin
          </Button>
        </div>
        <div className="my-5">
            <SearchField searchTerm={searchQuery} onSearchChange={setSearchQuery} />
        </div>
        <div>
            <div className="overflow-x-auto">
              <table ref={tableRef} className="min-w-full bg-white text-sm shadow-2xl rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-800 text-white uppercase text-xs">
                    <th className="p-4 text-left">Username</th>
                    <th className="p-4 text-left">Email</th>
                    <th onClick={() => handleSort("store")} className="p-4 cursor-pointer">
                      <div className='flex items-center'>
                        Assigned Store
                        <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                        {sortFieldAdmin === "store"}
                      </div>
                    </th>
                    <th onClick={() => handleSort("created_at")} className="p-4 cursor-pointer">
                      <div className='flex items-center'>
                        Register Date
                        <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                        {sortFieldAdmin === "created_at"}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storeAdmins.map((admin:StoreAdmin, key:number) => (
                    <tr key={key} className={`${key % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b hover:bg-gray-100 transition-colors`}>
                      <td className="p-4">{admin.username}</td>
                      <td className="p-4">{admin.email}</td>
                      <td className="p-4">
                      {editId === admin.user_id ? (
                          <div className="relative">
                            <input type="text" value={editAdminData.storeName} onChange={(e) => handleChange(e, 'storeName')}
                              className="border-b-2 border-indigo-600 focus:outline-none"
                            />
                          </div>
                        ) : ( admin.store_name )
                      }
                      </td>
                      <td className="p-4">{new Date(admin.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <button title="Assign store admin" onClick={(e) => { e.stopPropagation(); handleEditClick(admin)}}
                        className="mx-2 py-2 px-2 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform">
                          {editId === admin.user_id ? ( <MdSaveAs className="text-2xl" /> ) : ( <FaUserEdit className="text-2xl" /> )}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteAdmin(admin.user_id)}}
                        className="mx-2 py-2 px-2 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-colors transform"
                        title="Delete store admin">
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
                      className={`px-4 py-2 cursor-pointer hover:bg-indigo-100 ${suggestion.store_admin === '-' ? 'bg-gray-100' : ''}`}
                      >
                        {suggestion.store_name}
                      </div>
                    ))}
                  </div>
                )}
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
        </div>
      </div>
    </div>
  );
}

export default ManageAdmins;
