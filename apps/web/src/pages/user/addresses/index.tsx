import React, { useEffect } from 'react';
import { UserSidebar } from '@/components/UserSideBar';
import { AddressList } from '@/components/address-list';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, addAddress, deleteAddress, setDefaultAddress } from '@/redux/slices/userProfileSlice';
import { RootState, AppDispatch } from '@/redux/store';
import LoadingVignette from '@/components/LoadingVignette';
import useAuth from '@/hooks/useAuth';

function ManageAddress() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAuth();
  const user_id = Number(user?.id);
  const { addresses, loading } = useSelector((state: RootState) => state.userProfile);

  useEffect(() => {
    if (user_id) {
      dispatch(fetchAddresses(user_id));
    }
  }, [dispatch, user_id]);

  const handleAddAddress = (address: string, city_name: string, city_id: number) => {
    if (user_id) {
      dispatch(addAddress({ user_id, address, city_name, city_id }));
    }
  };

  const handleDeleteAddress = (address_id: number) => {
    if (user_id) {
      dispatch(deleteAddress({ user_id, address_id }));
    }
  };

  const handleSetDefault = (address_id: number) => {
    if (user_id) {
      dispatch(setDefaultAddress({ user_id, address_id }));
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white mt-[11vh] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <UserSidebar />
          <main className="flex-1">
            <div>
              <h1 className="text-2xl text-gray-800 font-semibold">Addresses</h1>
              <p className="text-muted-foreground">Manage your delivery addresses</p>
            </div>
            <div className="mx-auto py-8 max-w-4xl">
              {loading ? (
                <LoadingVignette />
              ) : (
                <AddressList
                  addresses={addresses}
                  onAddAddress={handleAddAddress}
                  onDeleteAddress={handleDeleteAddress}
                  onSetDefault={handleSetDefault}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ManageAddress;
