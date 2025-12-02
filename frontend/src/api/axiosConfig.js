// frontend/src/api/axiosConfig.js
import axios from 'axios';

// Vite exposes environment variables on the `import.meta.env` object
const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api';

const API = axios.create({
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
