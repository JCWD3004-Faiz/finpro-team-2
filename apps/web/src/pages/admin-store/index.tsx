import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { CgSpinner } from 'react-icons/cg';

function StoreDashboardGate() {
  const user = useAuth();
  const access_token = Cookies.get("access_token");
  const [storeName, setStoreName] = useState<string>("");
  const [adminName, setAdminName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const router = useRouter();

  async function fetchStoreByUserId() {
    try {
      const response = await axios.get(`/api/store-admin/assigned-store/${user?.id}`, {
        headers: { Authorization: `Bearer ${access_token}`},
      });
      if (response && response.data) {
        setStoreName(response.data.data.store_name);
        Cookies.set('storeId', response.data.data.store_id, { expires: 7, path: '/admin-store' });
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setError('Store not found for your account.');
      }
    }
  }

  async function fetchAdminById() {
    try {
      const response = await axios.get(`/api/store-admin/admin/${user?.id}`, {
        headers: {Authorization: `Bearer ${access_token}`},
      });
      if (response && response.data) {
        setAdminName(response.data.data.username);
      }
    } catch (err: any) {
      if (err.response) {
        setError('An error occurred while fetching admin data.');
      }
    }
  }

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('storeId');
    router.push('/');
  };

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        await Promise.all([fetchStoreByUserId(), fetchAdminById()]);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

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
