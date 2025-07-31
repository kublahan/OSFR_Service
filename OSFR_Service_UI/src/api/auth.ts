import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const loginAdmin = async (username: string, password: string) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};
