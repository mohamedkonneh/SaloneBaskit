import axios from 'axios';

// Use the environment variable provided by Vite for the backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  // All requests will be prefixed with the backend URL and '/api'
  baseURL: `${API_BASE_URL}/api`,
});

export default api;