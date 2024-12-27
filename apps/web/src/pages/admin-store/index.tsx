import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { CgSpinner } from 'react-icons/cg';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchStoreByUserId, fetchAdminById } from '@/redux/slices/storeAdminSlice';
import Cookies from 'js-cookie';
import useAuth from '@/hooks/useAuth';

function StoreDashboardGate() {
  const user = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { storeName, adminName, loading, error } = useSelector((state: RootState) => state.storeAdmin);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchStoreByUserId(user.id));
      dispatch(fetchAdminById(user.id));
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    Cookies.remove('access_token');
    router.push('/');
  };


  return (
    <div className="bg-slate-100 w-screen h-screen text-gray-800 flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <CgSpinner className="animate-spin text-6xl  text-teal-500"/>
        </div>
      ) : (
        <div className="md:min-w-[700px] bg-white p-8 shadow-xl rounded-lg flex flex-col items-center justify-between">
          {error ? (
            <>
              <div className="flex items-center mb-4 space-x-3">
                <h2 className="text-2xl font-semibold text-teal-600">Welcome, {adminName}</h2>
              </div>
              <h2 className="text-xl font-semibold text-rose-600">You are currently not assigned to a store.</h2>
              <p className="text-gray-700 my-3 text-center">Please logout and contact the super admin.</p>
              <button 
                onClick={handleLogout}
                className="mt-3 bg-white text-teal-600 font-semibold border-2 border-teal-600 py-3 px-8 rounded-full hover:bg-teal-600 hover:text-white transition-colors transform">
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center mb-4 space-x-3">
                <h2 className="text-2xl font-semibold text-teal-600">Welcome, {adminName}</h2>
              </div>
              <p className="text-gray-700 my-3 text-center">Your assigned store is:</p>
              <div className="flex items-center mb-4 space-x-3">
                <h2 className="text-2xl font-semibold text-teal-600">{storeName}</h2>
              </div>
              <Link href="/admin-store/dashboard">
                <button className="mt-3 bg-white text-teal-600 font-semibold border-2 border-teal-600 py-3 px-8 rounded-full hover:bg-teal-600 hover:text-white transition-colors transform">
                  Continue to Dashboard
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default StoreDashboardGate;
