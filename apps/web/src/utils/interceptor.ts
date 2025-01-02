import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        try {
          const refreshResponse = await axiosInstance.post("/api/auth/refresh-token", {
            refreshToken: refreshToken,
          });
          const { accessToken } = refreshResponse.data.data.refreshToken;
          if (!accessToken) {
            throw new Error("No access token returned from refresh endpoint");
          }
          Cookies.set("access_token", accessToken, { expires: 1 });
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest); 
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          alert("Session expired. Please log in again.");
          Cookies.remove("access_token");
          Cookies.remove("refreshToken");
          window.location.href = "/auth/login-page";
          return Promise.reject(refreshError);
        }
      } else {
        console.error("No refresh token available");
        alert("No session found. Please log in again.");
        Cookies.remove("access_token");
        Cookies.remove("refreshToken");
        window.location.href = "/auth/login-page";
        return Promise.reject(error);
      }
    }
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
