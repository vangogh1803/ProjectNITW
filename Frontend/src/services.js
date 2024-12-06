import axios from "axios";

const API_URL = "http://localhost:5001/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response?.data || error.message);
    throw error;
  }
};
axios.get('http://localhost:5001/auth/user', { withCredentials: true });
axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error;
  }
};
