import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';
import { MdAddBusiness, MdDelete, MdEditSquare, MdSaveAs } from 'react-icons/md';
import { Store } from '@/utils/adminInterface';
import { fetchAllStores, deleteStore, updateStore } from '@/redux/slices/superAdminSlice';
import { fetchCities } from '@/redux/slices/globalSlice';
import Pagination from '@/components/pagination';
import { setSortField, setEditId, setEditStoreData, setLocationSuggestions, setSuggestionsPosition, resetEditState } from '@/redux/slices/superAdminSlice';
import { setSortOrder, setCurrentPage } from '@/redux/slices/manageInventorySlice';
import { FaSort } from 'react-icons/fa';
import SearchField from '@/components/searchField';
import useDebounce from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import LoadingVignette from '@/components/LoadingVignette';
import SuccessModal from '@/components/modal-success';
import ErrorModal from '@/components/modal-error';
import { showError, hideError } from "@/redux/slices/errorSlice";
import { showSuccess, hideSuccess } from "@/redux/slices/successSlice";

function ManageStores() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { sortField, isSidebarOpen, loading, allStores, editId, editStoreData, locationSuggestions, suggestionsPosition } = useSelector((state: RootState) => state.superAdmin);
  const { sortOrder, currentPage, totalPages } = useSelector((state: RootState) => state.manageInventory);
  const { cities } = useSelector((state: RootState) => state.global);

  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );

  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );

  useEffect(() => {
    dispatch(fetchAllStores({ page: currentPage, sortField, sortOrder, search: debouncedQuery }));
    dispatch(fetchCities());
  }, [dispatch, currentPage, sortField, sortOrder, debouncedQuery]);

  const handlePageChange = (page: number) => { if (page > 0 && page <= totalPages) {dispatch(setCurrentPage(page))}};

  const handleSort = (field: string) => {
    const updatedSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    if (sortField === field) {
      dispatch(setSortOrder(updatedSortOrder));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder("asc"));
    }
    dispatch(fetchAllStores({ page: 1, sortField: field, sortOrder: updatedSortOrder }));
  };  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        dispatch(resetEditState())
      }};
    document.addEventListener('mousedown', handleClickOutside);
    return () => {document.removeEventListener('mousedown', handleClickOutside)};
  }, [dispatch]);

  const toggleSidebar = () => {dispatch({ type: 'superAdmin/toggleSidebar' })};

  const handleRowClick = (url: string) => {if (editId === null) {router.push(url)}};

  const handleEditClick = (store: Store) => {
    if (editId === store.store_id) {
      if (isValidLocation(editStoreData.locationName)) {
        const updatedCityId = editStoreData.cityId !== 0 ? editStoreData.cityId : store.city_id;
        const updatePayload: any = { store_id: store.store_id, store_name: editStoreData.storeName, 
          store_location: editStoreData.locationName, city_id: updatedCityId};
        dispatch(updateStore(updatePayload));
        dispatch(resetEditState());
        dispatch(showSuccess("Store successfully edited"));
      } else {
        dispatch(showError('Please select a valid location.'));        
      }
    } else {
      dispatch(setEditId(store.store_id));
      dispatch(setEditStoreData({ storeName: store.store_name, locationName: store.store_location, cityId: store.city_id}));
    }
  };

  const handleDeleteStore = (store_id: number) => {
    if (window.confirm('Are you sure you want to delete this store?')) {dispatch(deleteStore(store_id))}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    dispatch(setEditStoreData({...editStoreData, [field]: value}));
    if (field === 'locationName') {
      const filteredSuggestions = getLocationSuggestions(value);
      dispatch(setLocationSuggestions(filteredSuggestions));
      const rect = e.target.getBoundingClientRect();
      dispatch(setSuggestionsPosition({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX}));
    }
  };

  const handleSuggestionClick = (suggestion: { city_name: string, city_id: number }) => {
    dispatch(setEditStoreData({...editStoreData, locationName: suggestion.city_name, cityId: Number(suggestion.city_id)}));
    dispatch(setLocationSuggestions([]));
  };

  const getLocationSuggestions = (input: string) => {
    return cities.filter((city) => city.city_name.toLowerCase().includes(input.toLowerCase()));
  };

  const isValidLocation = (location: string) => {
    return cities.some((city) => city.city_name.toLowerCase() === location.toLowerCase());
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
          Store Management
        </h1>
        <div className="ml-1 mb-2">
          <Button size="default" onClick={() => router.push({ pathname: '/admin-super/stores/create' })}>
            <MdAddBusiness/>
            Create New Store
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
                    <th className="p-4 text-left">Store Name</th>
                    <th className="p-4 text-left">Location</th>
                    <th onClick={() => handleSort("admin")} className="p-4 cursor-pointer">
                      <div className='flex items-center'>
                        Assigned Admin
                      <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                      {sortField === "admin"}
                      </div>
                    </th>
                    <th onClick={() => handleSort("created_at")} className="p-4 cursor-pointer">
                      <div className='flex items-center'>
                      Created Date
                      <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                      {sortField === "created_at"}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allStores.map((store: Store, index) => (
                    <tr key={store.store_id} onClick={() => handleRowClick(`/admin-super/stores/inventory/${store.store_id}`)}
                      className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b hover:bg-gray-200 hover:cursor-pointer transition-colors`}
                      title="Click to manage store inventory">
                      <td className="p-4">
                        {editId === store.store_id ? (
                          <input type="text" value={editStoreData.storeName} onChange={(e) => handleChange(e, 'storeName')}
                            className="border-b-2 border-indigo-600 focus:outline-none"/>
                        ) : ( store.store_name )}
                      </td>
                      <td className="p-4">
                        {editId === store.store_id ? (
                          <div className="relative">
                            <input type="text" value={editStoreData.locationName} onChange={(e) => handleChange(e, 'locationName')}
                              className="border-b-2 border-indigo-600 focus:outline-none"/>
                          </div> 
                        ) : ( store.store_location )}
                      </td>
                      <td className="p-4">{store.store_admin}</td>
                      <td className="p-4">{new Date(store.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <button title="Edit store" onClick={(e) => { e.stopPropagation(); handleEditClick(store)}}
                          className="mx-2 py-2 px-2 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform">
                          {editId === store.store_id ? ( <MdSaveAs className="text-2xl" /> ) : ( <MdEditSquare className="text-2xl" /> )}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteStore(store.store_id)}}
                        className="mx-2 py-2 px-2 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-colors transform"
                        title="Delete store">
                          <MdDelete className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {locationSuggestions.length > 0 && (
                  <div className="absolute z-10 bg-white border border-gray-300 shadow-md rounded-lg max-h-40 overflow-auto"
                  style={{ top: `${suggestionsPosition.top}px`, left: `${suggestionsPosition.left}px`, width: '200px',}}>
                    {locationSuggestions.map((suggestion, index) => (
                      <div key={index} onClick={() => handleSuggestionClick(suggestion)} className="px-4 py-2 hover:bg-indigo-100 cursor-pointer">
                        {suggestion.city_name}
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

export default ManageStores;
