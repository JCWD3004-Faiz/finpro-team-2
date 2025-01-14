import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import LoadingVignette from "@/components/LoadingVignette";
import SuccessModal from "@/components/modal-success";
import ErrorModal from "@/components/modal-error";
import { hideSuccess, showSuccess } from "@/redux/slices/successSlice";
import { hideError, showError } from "@/redux/slices/errorSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FaGoogle } from "react-icons/fa";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isRegisterClicked, setIsRegisterClicked] = useState(false); // State to trigger register click
  const [isLoginFaded, setIsLoginFaded] = useState(false); // State for fading effect
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.username,
        password: formData.password,
      });

      const { access_token, refreshToken } = response?.data?.data;
      const decodedToken: any = jwtDecode(access_token);
      const { role } = decodedToken;

      if (access_token) {
        Cookies.set("access_token", access_token, { expires: 1 }); // expires in 1 day
        Cookies.set("refreshToken", refreshToken, { expires: 7 }); // expires in 7 days
      }

      let redirectUrl = "/";
      if (role === "SUPER_ADMIN") {
        redirectUrl = "/admin-super";
      } else if (role === "STORE_ADMIN") {
        redirectUrl = "/admin-store";
      }

      dispatch(showSuccess("Welcome to FrugMart!"));
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage =
          typeof error.response.data?.detail === "string"
            ? error.response.data.detail
            : "An error occurred.";
        dispatch(showError(errorMessage));
      } else {
        dispatch(showError("An unexpected error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    window.location.href = "/auth/register";
  };

  const handleForgotPassClick = () => {
    window.location.href = "/auth/passwordReset";
  };

  const handleGoogleClick = () => {
    const googleLoginUrl = `${axios.defaults.baseURL}/auth/google`;
    window.location.href = googleLoginUrl;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-end text-gray-800 bg-black md:pl-4">
      {loading && <LoadingVignette />}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          dispatch(hideSuccess());
        }}
        successMessage={successMessage}
      />
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => {
          dispatch(hideError());
        }}
        errorMessage={errorMessage}
      />
      <div className="hidden md:flex flex-col justify-center items-center h-screen gap-6 px-5">
        <h1 className="text-white text-4xl lg:text-5xl font-bold text-end">
          Welcome to FRUGMART
        </h1>
        <h2 className="text-white text-3xl text-end w-full font-semibold">
          Smart Choices <br /> Bigger Savings!
        </h2>
      </div>

      <div className="bg-white p-8 w-screen md:w-3/6 h-screen shadow-md flex flex-col justify-center">
        {/* Header */}
        <h1 className="text-5xl font-bold mb-6">LOGIN</h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4 w-full md:max-w-96">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="username"
              name="username"
              type="email"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              required
            />
          </div>

          <div className="mb-6 w-full md:max-w-96">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
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

          <div className="flex flex-col w-full md:max-w-96">
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
            <button
              type="button"
              className="my-4 px-4 py-2 w-full rounded shadow border border-gray-300 hover:bg-gray-100"
              onClick={handleGoogleClick}
            >
              <div className="flex justify-center items-center gap-2">
                <div>Login with Google</div>
                <div>
                  <FaGoogle />
                </div>
              </div>
            </button>
            <p
              className="mt-4 text-sm text-gray-500 cursor-pointer hover:underline"
              onClick={() => (window.location.href = "/auth/passwordReset")}
            >
              Forgot password?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
