import axios from 'axios';

const axiosServices = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'https://smart-city-iwx8.onrender.com/api/' });
// const axiosServices = axios.create({ baseURL: 'http://localhost:5000/api' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/health')) {
      window.location.pathname = '/health';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;
