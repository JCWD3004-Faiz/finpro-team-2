import React, { useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { access_token, refreshToken } = response.data.data;

      const decodedToken: any = jwtDecode(access_token);

      const { role } = decodedToken;

      if (access_token) {
        Cookies.set("access_token", access_token, { expires: 1 });
        Cookies.set("refreshToken", refreshToken, { expires: 7 });
      }

      let redirectUrl = "/";
      if (role === "SUPER_ADMIN") {
        redirectUrl = "/admin-super";
      } else if (role === "STORE_ADMIN") {
        redirectUrl = "/admin-store";
      } else {
        redirectUrl = "/";
      }

      alert("Successfully logged in");
      window.location.href = redirectUrl;

    } catch (error) {
      alert("Failed to log in. Please check your email and password");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
