import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

if (API_URL === 'http://localhost:5000/api') {
  console.warn('VITE_API_URL is not set. Falling back to default localhost URL.');
}

const API = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Remove user info from local storage
      localStorage.removeItem('userInfo');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;