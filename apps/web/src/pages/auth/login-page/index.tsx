import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.username,
        password: formData.password,
      });

      const { access_token, refreshToken } = response.data.data;
      const decodedToken: any = jwtDecode(access_token);
      const { role } = decodedToken;

      if (access_token) {
        Cookies.set('access_token', access_token, { expires: 1 }); // expires in 1 day
        Cookies.set('refreshToken', refreshToken, { expires: 7 }); // expires in 7 days
      }

     
      let redirectUrl = '/';
      if (role === 'SUPER_ADMIN') {
        redirectUrl = '/admin-super';
      } else if (role === 'STORE_ADMIN') {
        redirectUrl = '/admin-store';
      }

      alert('Successfully logged in');
      window.location.href = redirectUrl;

    } catch (error) {
      alert('Failed to log in. Please check your email and password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 w-96">
        {/* Header */}
        <h1 className="text-5xl font-bold text-center mb-6">FRUGGER</h1>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1 block w-full px-4 py-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              required
            />
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 w-full rounded shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Login
            </button>
            <button
              type="button"
              className="my-4"
              onClick={() => window.location.href = '/auth/register'
                
              }
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
