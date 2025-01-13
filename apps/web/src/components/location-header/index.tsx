import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, fetchClosestStore, fetchClosestStoreById } from '@/redux/slices/landingSlice';
import { RootState, AppDispatch } from '@/redux/store';
import useAuth from '@/hooks/useAuth';
import { fetchAddresses } from '@/redux/slices/userProfileSlice';
import Cookies from 'js-cookie';
import { MdLocationOff, MdLocationOn, MdStore } from 'react-icons/md';

const LocationHeader: React.FC = () => {
  const access_token = Cookies.get('access_token');
  const user = useAuth();
  const user_id = Number(user?.id);
  const dispatch = useDispatch<AppDispatch>();
  const { closestStore, error } = useSelector((state: RootState) => state.landing);
  const { addresses } = useSelector((state: RootState) => state.userProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const defaultStore = {
    store_id: 28,
    store_name: "Default Store",
    store_location: "Fetching location...",
  };

  const getGeolocation = () => {
    return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            resolve({ lat, lon });
          },
          () => reject() 
        );
      } else {
        reject();
      }
    });
  };

  useEffect(() => {
    if (user_id) {
      dispatch(fetchAddresses(user_id));
    } else if (!access_token) {
      getGeolocation()
        .then(({ lat, lon }) => {
          dispatch(setLocation({ lat, lon }));
          dispatch(fetchClosestStore({ lat, lon }));
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, user_id, access_token]);

  useEffect(() => {
    if (addresses.length > 0) {
      setIsLoading(false);
    }
  }, [addresses]);

  useEffect(() => {
    if (isLoading) return;

    if (user_id) {
      if (addresses.length > 0) {
        dispatch(fetchClosestStoreById(user_id));
      } else {
        setIsLoading(false);
      }
    } else {
      getGeolocation()
        .then(({ lat, lon }) => {
          dispatch(setLocation({ lat, lon }));
          dispatch(fetchClosestStore({ lat, lon }));
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, user_id, addresses, isLoading]);

  useEffect(() => {
    if (closestStore) {
      setIsLoading(false);
    }
  }, [closestStore]);

  const storeToDisplay = closestStore || defaultStore;

  useEffect(() => {
    Cookies.set('current_store_id', storeToDisplay.store_id.toString());
  }, [storeToDisplay]);

  // Conditional error message
  const distanceLimitError = error === "No stores found within 50 km.";

  return (
    <header className="fixed top-0 left-0 border-b border-black w-full h-[3vh] bg-white text-gray-800 z-50 flex items-center">
      <div className="w-full flex items-center absolute left-0 right-0 text-xs md:text-sm md:static">
        <div className="flex items-center absolute left-0 md:pl-2 md:flex-row md:static">
          {distanceLimitError ? (
            <>
              <MdLocationOff />
              <p>{distanceLimitError ? "No stores found. Please adjust your location." : storeToDisplay.store_location}</p>
            </>
          ) : (
            <>
              {user_id && addresses.length > 0 ? (
                <>
                  <MdLocationOn />
                  <p>{storeToDisplay.store_location}</p>
                </>
              ) : (
                <>
                  <MdLocationOff />
                  {user_id ? (
                    <p>Please set an address to start shopping</p>
                  ) : (
                    <p>Please log in to set an address</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center absolute right-0 md:pl-4 md:flex-row md:static">
          <MdStore />
          <p>{storeToDisplay.store_name}</p>
        </div>
      </div>
    </header>
  );
};

export default LocationHeader;
