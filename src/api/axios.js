import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mypackage.pixelplanet.in/api', // your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
