import axios from 'axios';
import Cookies from 'js-cookie';

// Create a new axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const access_token = Cookies.get('access_token');
    if (access_token) {
      config.headers['Authorization'] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired access tokens and refresh them
api.interceptors.response.use(
  (response) => response, // Return the response if no errors
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop

      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh-token', { refreshToken });
          const newAccessToken = data.data.refreshToken;
          Cookies.set('access_token', newAccessToken, { expires: 1 }); // Adjust expiration time

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Retry the original request
        } catch (refreshError) {
          console.error('Failed to refresh access token', refreshError);
          Cookies.remove('access_token');
          Cookies.remove('refreshToken');
          alert('Your session has expired. Please log in again.');
          window.location.href = '/auth/login-page'; // Redirect to login page
        }
      } else {
        // No refresh token, show alert and redirect to login
        alert('Your session has expired. Please log in again.');
        window.location.href = '/auth/login-page'; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default api;
