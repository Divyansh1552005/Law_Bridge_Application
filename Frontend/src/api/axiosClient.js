import axios from "axios";
import {toast} from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
});


// GLOBAL RESPONSE INTERCEPTOR FOR HANDLING RATE LIMIT ERRORS
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Global handling for rate limit
    if (error.response?.status === 429) {
      const message = error.response.data?.message || "Too many requests! Try again after 10-15 minutes.";
      toast.error(message, {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          whiteSpace: 'pre-line',
          fontSize: '15px',
          fontWeight: '500'
        }
      });
      return Promise.reject({ ...error, message });
    }

    // Handle other global errors (optional)
    if (error.response?.status === 401) {
      return Promise.reject({ ...error, message: "Unauthorized! Please login again." });
    }

    return Promise.reject(error);
  }
);

export default api;
