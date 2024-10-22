import axios from 'axios';

const axiosServices = axios.create({ baseURL: 'https://smart-city-iwx8.onrender.com/api/' });
// ==============================|| AXIOS - FOR MOCK SERVICES ||========================= ===== //

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
