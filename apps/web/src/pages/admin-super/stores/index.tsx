import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';
import { CgSpinner } from 'react-icons/cg';
import { MdDelete, MdEditSquare, MdSaveAs } from 'react-icons/md';
import { Store } from '@/utils/adminInterface';
import { fetchAllStores, deleteStore, updateStore } from '@/redux/slices/superAdminSlice';
import { fetchCities } from '@/redux/slices/globalSlice';
import { setEditId, setEditStoreData, setLocationSuggestions, setSuggestionsPosition, resetEditState } from '@/redux/slices/superAdminSlice';

function ManageStores() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen, loading, allStores, editId, editStoreData, locationSuggestions, suggestionsPosition } = useSelector((state: RootState) => state.superAdmin);
  const { cities } = useSelector((state: RootState) => state.global);
  const tableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    dispatch(fetchAllStores());
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        dispatch(resetEditState())
      }};
    document.addEventListener('mousedown', handleClickOutside);
    return () => {document.removeEventListener('mousedown', handleClickOutside)};
  }, [dispatch]);

  const toggleSidebar = () => {dispatch({ type: 'superAdmin/toggleSidebar' })};

  const handleRowClick = (url: string) => {
    if (editId === null) {router.push(url);
    }
  };

  const handleEditClick = (store: Store) => {
    if (editId === store.store_id) {
      if (isValidLocation(editStoreData.locationName)) {
        const updatedCityId = editStoreData.cityId !== 0 ? editStoreData.cityId : store.city_id;
        const updatePayload: any = { store_id: store.store_id, store_name: editStoreData.storeName, 
          store_location: editStoreData.locationName, city_id: updatedCityId};
        dispatch(updateStore(updatePayload));
        dispatch(resetEditState());
      } else {
        alert('Please select a valid location.');
      }
    } else {
      dispatch(setEditId(store.store_id));
      dispatch(setEditStoreData({ storeName: store.store_name, locationName: store.store_location, cityId: store.city_id,
      }));
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
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64`}>
        <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10 tracking-wide">
          Store Management
        </h1>
        <div className="md:ml-6 ml-1 mb-2">
          <button onClick={() => router.push({ pathname: '/admin-super/stores/create' })}
          className="bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-8 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform">
            Create New Store
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
                    <th className="py-3 px-12 text-center">Store Name</th>
                    <th className="py-3 px-12 text-center">Location</th>
                    <th className="py-3 px-10 text-center">Assigned Admin</th>
                    <th className="py-3 px-10 text-center">Created Date</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allStores.map((store: Store) => (
                    <tr key={store.store_id} onClick={() => handleRowClick(`/admin-super/inventory/${store.store_id}`)}
                      className="text-gray-700 bg-white hover:bg-indigo-50 hover:cursor-pointer transition-color transform">
                      <td className="py-3 px-1 text-center">
                        {editId === store.store_id ? (
                          <input type="text" value={editStoreData.storeName} onChange={(e) => handleChange(e, 'storeName')}
                            className="text-center border-b-2 border-indigo-600 focus:outline-none"/>
                        ) : ( store.store_name )}
                      </td>
                      <td className="py-3 px-1 text-center">
                        {editId === store.store_id ? (
                          <div className="relative">
                            <input type="text" value={editStoreData.locationName} onChange={(e) => handleChange(e, 'locationName')}
                              className="text-center border-b-2 border-indigo-600 focus:outline-none"/>
                          </div> 
                        ) : ( store.store_location )}
                      </td>
                      <td className="py-3 px-1 text-center">{store.store_admin}</td>
                      <td className="py-3 px-1 text-center">{new Date(store.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(store)}}
                          className="mx-2 py-2 px-2 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform">
                          {editId === store.store_id ? ( <MdSaveAs className="text-2xl" /> ) : ( <MdEditSquare className="text-2xl" /> )}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteStore(store.store_id)}}
                        className="mx-2 py-2 px-2 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-colors transform">
                          <MdDelete className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {locationSuggestions.length > 0 && (
                  <div className="absolute z-50 bg-white border border-gray-300 shadow-md rounded-lg max-h-40 overflow-auto"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageStores;
