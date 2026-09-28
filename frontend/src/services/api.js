import axios from 'axios';

// Create configured axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true, // Crucial for receiving and sending HTTP-only refreshToken/accessToken cookies
  headers: {
    'Accept': 'application/json',
  }
});

// In-memory token storage (with localStorage sync for page reloads)
let inMemoryToken = localStorage.getItem('mediahub_access_token') || null;

export const setAccessToken = (token) => {
  inMemoryToken = token;
  if (token) {
    localStorage.setItem('mediahub_access_token', token);
  } else {
    localStorage.removeItem('mediahub_access_token');
  }
};

export const getAccessToken = () => inMemoryToken;

// Request Interceptor: Attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Dual-Token Automatic Rotation
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop on auth endpoints themselves
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/users/login') &&
      !originalRequest.url.includes('/users/register') &&
      !originalRequest.url.includes('/users/refresh-token')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token refresh using HTTP-only cookie
        const res = await axios.post(
          `${api.defaults.baseURL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessToken(null);
        window.dispatchEvent(new CustomEvent('mediahub:session-expired'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// High-level API Methods
export const authService = {
  async register(formData) {
    const res = await api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/users/login', credentials);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/users/logout');
    } finally {
      setAccessToken(null);
    }
  },

  async getCurrentUser() {
    const res = await api.get('/users/current-user');
    return res.data;
  },

  async updateAccountDetails(data) {
    const res = await api.patch('/users/update-account', data);
    return res.data;
  },

  async updateAvatar(formData) {
    const res = await api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async updateCoverImage(formData) {
    const res = await api.patch('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async changePassword(data) {
    const res = await api.post('/users/change-password', data);
    return res.data;
  },

  async getUserChannel(username) {
    const res = await api.get(`/users/c/${username}`);
    return res.data;
  },

  async getWatchHistory() {
    const res = await api.get('/users/history');
    return res.data;
  }
};
