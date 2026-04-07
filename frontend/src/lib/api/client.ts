import axios from 'axios';

const ODOO_BASE_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:8069';

export const apiClient = axios.create({
  baseURL: `${ODOO_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to unwrap the { status, data } envelope
apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.status === 'success') {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
