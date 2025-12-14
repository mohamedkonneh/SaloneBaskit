import axios from 'axios';

const BACKEND_URL = 'https://salonebaskit-993d.onrender.com/api';

const publicApi = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export default publicApi;
