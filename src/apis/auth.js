import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/auth`;

const login = async (data) => {
  const res = await axios.post(`${BASE_URL}/login`, data);
  return res.data;
};

export { login };
