import axios from 'axios';

// Configure axios to use the backend URL
const instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 seconds timeout
  withCredentials: false, // Changed to false as we're using token auth
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage if it exists
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login if unauthorized
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
