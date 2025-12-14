import axios from 'axios';

// Always use the live Render backend URL for all environments.
const baseURL = 'https://salonebaskit-993d.onrender.com/api';

// Create a new Axios instance with a custom configuration
const api = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && userInfo.token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;