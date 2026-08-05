import axios from 'axios';

// One axios instance for the whole app. The base URL comes from .env
// (VITE_API_BASE_URL) so the same build can point at a different backend.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the access token to every request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoints that must never trigger a refresh attempt: a 401 from these means
// the credentials themselves are wrong, and retrying would loop forever.
const NO_RETRY = ['auth/login/', 'auth/token/refresh/'];

function clearSessionAndRedirect() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('shelfsense-user');
  localStorage.removeItem('shelfsense-business');
  if (window.location.pathname !== '/login') window.location.assign('/login');
}

// Access tokens expire after 30 minutes. On the first 401 for a request, spend
// the refresh token once and replay the original request with the new access
// token. `_retried` makes sure each request only ever tries this once.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isExpired = error.response
      && error.response.status === 401
      && request
      && !request._retried
      && !NO_RETRY.some((path) => request.url && request.url.includes(path));

    if (!isExpired) return Promise.reject(error);

    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    try {
      // A bare axios call, so this request does not pass back through these
      // interceptors and resend the expired access token.
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
        { refresh },
        { headers: { 'Content-Type': 'application/json' } },
      );
      localStorage.setItem('access_token', data.data.access);
      localStorage.setItem('refresh_token', data.data.refresh);

      request._retried = true;
      request.headers.Authorization = `Bearer ${data.data.access}`;
      return apiClient(request);
    } catch (refreshError) {
      // The refresh token is spent or expired: the session is genuinely over.
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
