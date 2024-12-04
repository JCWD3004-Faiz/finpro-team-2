import React, { useState } from 'react';
import axios from 'axios';
import { registerAdminSchema } from '@/utils/registerAdminSchema';
import SuperSidebar from '@/components/SuperSidebar';

interface Register {
  username: string;
  email: string;
  password_hash: string;
}

function RegisterAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [credentials, setCredentials] = useState<Register>({
    username: "",
    email: "",
    password_hash: "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password_hash?: string;
    register_code?: string;
  }>({});

  async function submitRegister(e: any) {
    e.preventDefault(); setErrors({});
    try {
      registerAdminSchema.parse(credentials);
      const response = await axios.post("/api/admin-auth/register", {...credentials, role: "STORE_ADMIN"});
      if (response) {
        alert("Register success"); window.location.href = "/admin-super/admins";
      }
    } catch (error: any) {
      const newErrors = error.errors?.reduce((acc: any, err: any) => {
        acc[err.path[0]] = err.message; return acc }, {}) || {};
      setErrors(newErrors);
      if (!Object.keys(newErrors).length) alert("Failed to register");
    }
  }
  
  return (
    <div className="bg-slate-50 w-screen h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64`}>
      <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10 tracking-wide">
        Help Wanted
      </h1>
        <div className="flex flex-col justify-center items-center md:px-0 px-4">
          <form
            onSubmit={submitRegister}
            className="md:w-1/2 w-full h-auto rounded-md bg-white shadow-xl text-slate-700"
          >
            <div className="w-full h-full flex flex-col p-5 justify-center items-center space-y-5">
              <div className="flex flex-col space-y-3">
                <label className="font-semibold">Username</label>
                <input
                  className="w-full h-10 p-3 text-slate-700 border"
                  onChange={(e: any) =>
                    setCredentials({
                      username: e.target.value,
                      email: credentials.email,
                      password_hash: credentials.password_hash,
                    })
                  }
                />
                <div
                className={`min-h-[20px] text-red-600 text-xs ${
                  errors.username ? "opacity-100" : "opacity-0"
                }`}
                >
                  {errors.username}
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <label className="font-semibold">Email</label>
                <input
                  className="w-full h-10 p-3 text-slate-700 border"
                  onChange={(e: any) =>
                    setCredentials({
                      username: credentials.username,
                      email: e.target.value,
                      password_hash: credentials.password_hash,
                    })
                  }
                />
                <div
                className={`min-h-[20px] text-red-600 text-xs ${
                  errors.email ? "opacity-100" : "opacity-0"
                }`}
                >
                  {errors.email}
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <label className="font-semibold">Password</label>
                <input
                type="password"
                  className="w-full h-10 p-3 text-slate-700 border"
                  onChange={(e: any) =>
                    setCredentials({
                      username: credentials.username,
                      email: credentials.email,
                      password_hash: e.target.value,
                    })
                  }
                />
                <div
                className={`min-h-[20px] text-red-600 text-xs ${
                  errors.password_hash ? "opacity-100" : "opacity-0"
                }`}
                >
                  {errors.password_hash}
                </div>
              </div>
              <button
                type="submit"
                className="bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-20 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterAdmin;