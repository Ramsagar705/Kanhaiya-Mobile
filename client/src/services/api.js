import axios from 'axios';

const configuredApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const apiBaseUrl = configuredApiUrl?.endsWith('/api')
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  console.debug('[API request]', `${config.baseURL || ''}${config.url || ''}`);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
    console.error('[API request failed]', {
      requestedUrl: requestUrl,
      status: error.response?.status,
      backendResponse: error.response?.data,
      message: error.message,
    });
    const url = error.config?.url || '';
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
