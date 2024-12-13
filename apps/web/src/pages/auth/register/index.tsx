import React, { useState } from 'react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted data:', formData);
    alert("An email has been sent to set your password");
    // Add your submit logic here (e.g., API call)
  };

  return (
    <div className="min-h-screen flex items-center justify-start bg-black">
      <div className="bg-white p-8 w-3/6 h-screen shadow-md flex flex-col justify-center">
        {/* Header */}
        <h1 className="text-5xl font-bold text-right mb-6">FRUGGER</h1>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-end" // Align form elements to the right
        >
          <div className="mb-4 w-96"> {/* Limit input width */}
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

          <div className="mb-6 w-96"> {/* Limit input width */}
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              required
            />
          </div>

          {/* Button */}
          <div className="flex flex-col w-96 items-end"> {/* Limit button width and align to the right */}
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 w-full rounded shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
