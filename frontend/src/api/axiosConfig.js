// frontend/src/api/axiosConfig.js
import axios from 'axios';

// Vite exposes environment variables on the `import.meta.env` object
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const API = axios.create({
  // The base URL for all API requests. The '/api' part will be in the specific calls.
  // Example: API.get('/api/products')
  baseURL: baseURL, 
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  if (userInfo && userInfo.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return req;
});

export default API;
