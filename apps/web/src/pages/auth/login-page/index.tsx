import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isRegisterClicked, setIsRegisterClicked] = useState(false); // State to trigger register click
  const [isLoginFaded, setIsLoginFaded] = useState(false); // State for fading effect

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

  const handleRegisterClick = () => {
    // Trigger the sliding effect
    setIsRegisterClicked(true);

    // Use setTimeout to fade the LOGIN header after the transition
    setTimeout(() => {
      setIsLoginFaded(true);
    }, 300); // Set the timeout slightly after the sliding effect starts
  };

  return (
    <div className="min-h-screen flex items-center justify-end bg-black">
      <div
        className={`bg-white p-8 w-3/6 h-screen shadow-md flex flex-col justify-center transform transition-transform duration-500 ${
          isRegisterClicked ? 'translate-x-negative' : ''
        }`}
      >
        {/* Header */}
        <h1
  className={`text-5xl font-bold mb-6 transform transition-transform duration-500 opacity-transition ${
    isRegisterClicked ? 'translate-x-positive' : ''
  } ${isLoginFaded ? 'opacity-0' : 'opacity-100'}`}
>
          LOGIN
        </h1>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col transform transition-transform duration-500 ${
            isRegisterClicked ? 'translate-x-positive' : ''
          }`}
        >
          <div className="mb-4 w-96">
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

          <div className="mb-6 w-96">
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

          <div className="flex flex-col w-96">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 w-full rounded shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Login
            </button>
            <button
              type="button"
              className="my-4 px-4 py-2 w-full rounded shadow border border-gray-300 hover:bg-gray-100"
              onClick={handleRegisterClick}
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
