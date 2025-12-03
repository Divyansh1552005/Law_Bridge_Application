import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 

});


// GLOBAL RESPONSE INTERCEPTOR FOR HANDLING RATE LIMIT ERRORS
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Global handling for rate limit
    if (error.response?.status === 429) {
      const message = error.response.data?.message || "Too many requests! Try again later.";
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
