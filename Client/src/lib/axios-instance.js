import axios from 'axios';
import { toast } from 'sonner';


//todo-add the url in env
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true, // sends the refreshToken HttpOnly cookie automatically
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Attach the accessToken to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 — try refresh, else redirect to login
axiosInstance.interceptors.response.use(
  (response) => {
    //todo-remove that
    console.log("Response received:", response);
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
        console.log("error", error);
    
    if (originalRequest.url.includes('/auth/')) {
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true; // prevent infinite loop

      try {
        console.log("Access token expired, attempting refresh...");
        const res = await axiosInstance.post('/auth/refresh');

        localStorage.setItem('accessToken', res.data.data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${res.data.data.accessToken}`;
        console.log("String",res);
        return axiosInstance(originalRequest); // retry original request

      } catch (err) {

        localStorage.removeItem('accessToken');
        toast.error("Please login first")
        window.location.href = 'http://localhost:5173/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

