import React, { useState } from "react";
//import axios from "@/utils/interceptor";
import axios from "axios";
import LoadingVignette from "@/components/LoadingVignette";
import SuccessModal from "@/components/modal-success";
import ErrorModal from "@/components/modal-error";
import { hideSuccess, showSuccess } from "@/redux/slices/successSlice";
import { hideError, showError } from "@/redux/slices/errorSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    if (!formData.username) {
      dispatch(showError("Username is required."));
      return false;
    } else if (formData.username.length > 50) {
      dispatch(showError("Username must not exceed 50 characters."));
      return false;
    }

    if (!formData.email) {
      dispatch(showError("Email is required."));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      dispatch(showError("Email is not valid."));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/pending-register", formData);
      setLoading(false);
      dispatch(showSuccess("An email has been sent to set your password"));
    } catch (err: any) {
      console.error("Error:", err);
      dispatch(
        showError(
          err.response?.data?.message || "An error occurred. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-start bg-black text-gray-800">
      {loading && <LoadingVignette />}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          dispatch(hideSuccess());
          window.location.href = "/auth/login-page";
        }}
        successMessage={successMessage}
      />
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => dispatch(hideError())}
        errorMessage={errorMessage}
      />
      <div className="bg-white p-8 w-screen md:w-3/6 h-screen shadow-md flex flex-col justify-center">
        {/* Header */}
        <h1 className="text-5xl font-bold text-right mb-6">REGISTER</h1>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-end" // Align form elements to the right
        >
          <div className="mb-4 w-full md:max-w-96">
            {" "}
            {/* Limit input width */}
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
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

          <div className="mb-6 w-full md:max-w-96">
            {" "}
            {/* Limit input width */}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
          <div className="flex flex-col w-full md:max-w-96 items-end">
            {" "}
            {/* Limit button width and align to the right */}
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 w-full rounded shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Register
            </button>
            <p
              className="mt-4 text-sm text-gray-500 cursor-pointer hover:underline"
              onClick={() => (window.location.href = "/auth/login-page")}
            >
              Already have an account? Go to login page
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
