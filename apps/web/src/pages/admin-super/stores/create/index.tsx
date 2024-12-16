import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';
import { setLocationSuggestions, setSuggestionsPosition, createStore } from '@/redux/slices/superAdminSlice';
import { fetchCities } from '@/redux/slices/globalSlice';

function CreateStore() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);
  const { cities } = useSelector((state: RootState) => state.global);
  const { locationSuggestions, suggestionsPosition } = useSelector((state: RootState) => state.superAdmin);

  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [cityId, setCityId] = useState<number | null>(null);

  React.useEffect(() => {
    if (cities.length === 0) {
      dispatch(fetchCities());
    }
  }, [dispatch, cities.length]);
  const isValidLocation = (location: string) => {
    return cities.some((city) => city.city_name.toLowerCase() === location.toLowerCase());
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidLocation(storeLocation)) {
      alert('Please select a valid location.');
      return;
    }
    const storeData = {
      store_name: storeName,
      store_location: storeLocation,
      city_id: Number(cityId),
    };

    dispatch(createStore(storeData))
      .then(() => {
        alert('Store created successfully!');
        router.push('/admin-super/stores');
      })
      .catch((error) => {
        alert('Failed to create store: ' + error.message);
      });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStoreLocation(value);
    const filteredSuggestions = getLocationSuggestions(value);
    dispatch(setLocationSuggestions(filteredSuggestions));
    const rect = e.target.getBoundingClientRect();
    dispatch(setSuggestionsPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    }));
  };

  const getLocationSuggestions = (input: string) => {
    return cities.filter((city) =>
      city.city_name.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleSuggestionClick = (suggestion: { city_name: string, city_id: number }) => {
    setStoreLocation(suggestion.city_name);
    setCityId(suggestion.city_id);
    dispatch(setLocationSuggestions([]));
  };

  return (
    <div className="bg-slate-100 w-screen h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => dispatch({ type: 'superAdmin/toggleSidebar' })} />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10 tracking-wide">Create Store</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-xl">
          <div className="mb-4">
            <label htmlFor="store_name" className="block text-gray-700 font-semibold mb-2">
              Store Name
            </label>
            <input
              id="store_name"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter store name"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="store_location" className="block text-gray-700 font-semibold mb-2">
              Store Location
            </label>
            <input
              id="store_location"
              type="text"
              value={storeLocation}
              onChange={handleLocationChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter store location"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-20 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
              >
              Submit
            </button>
          </div>
          {locationSuggestions.length > 0 && (
            <div
              className="absolute z-50 bg-white border border-gray-300 shadow-md rounded-lg max-h-40 overflow-auto"
              style={{
                top: `${suggestionsPosition.top}px`,
                left: `${suggestionsPosition.left}px`,
                width: `${suggestionsPosition.width}px`,
              }}
            >
              {locationSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {suggestion.city_name}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateStore;
