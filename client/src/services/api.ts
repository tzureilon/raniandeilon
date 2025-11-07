import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Properties Service
export const propertiesService = {
  getAll: () => api.get('/properties'),
  getById: (id: number) => api.get(`/properties/${id}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: number, data: any) => api.put(`/properties/${id}`, data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/properties/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/properties/${id}`),
};

// Dashboard Service
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getHotLeads: (limit = 20) => api.get(`/dashboard/hot-leads?limit=${limit}`),
  getGroupPerformance: () => api.get('/dashboard/group-performance'),
  getPropertyPerformance: () => api.get('/dashboard/property-performance'),
  getWeeklyReport: () => api.get('/dashboard/weekly-report'),
  getRecommendations: () => api.get('/dashboard/recommendations'),
  getTrends: () => api.get('/dashboard/trends'),
};

// Leads Service
export const leadsService = {
  getAll: (status?: string) =>
    api.get('/leads', { params: status ? { status } : {} }),
  updateStatus: (id: number, status: string) =>
    api.patch(`/leads/${id}/status`, { status }),
  reply: (id: number, replyText: string) =>
    api.post(`/leads/${id}/reply`, { replyText }),
};

export default api;
