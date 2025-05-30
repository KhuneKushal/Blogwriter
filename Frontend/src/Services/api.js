import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const blogAPI = {
  getAllBlogs: () => api.get('/blogs'),
  getBlog: (id) => api.get(`/blogs/${id}`),
  saveDraft: (blogData) => api.post('/blogs/save-draft', blogData),
  publishBlog: (blogData) => api.post('/blogs/publish', blogData),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
};

export default api;