import axios from 'axios';

// When running with Vite proxy or localtunnel, relative URL ensures calls work from all devices
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const api = {
  // 1. Event Requirements
  analyzeEvent: async (data) => {
    const response = await apiClient.post('/api/events/analyze', data);
    return response.data;
  },

  getEventPlan: async (eventId, params = {}) => {
    const response = await apiClient.get(`/api/events/${eventId}/plan`, { params });
    return response.data;
  },

  // 2. Venues
  getAllVenues: async (params = {}) => {
    const response = await apiClient.get('/api/venues', { params });
    return response.data;
  },

  getVenueDetails: async (venueId) => {
    const response = await apiClient.get(`/api/venues/${venueId}`);
    return response.data;
  },

  searchVenues: async (filters) => {
    const response = await apiClient.post('/api/venues/search', filters);
    return response.data;
  },

  compareVenues: async (compareData) => {
    const response = await apiClient.post('/api/venues/compare', compareData);
    return response.data;
  },

  saveVenue: async (venueId, notes = 'Saved from Venue Explorer') => {
    const response = await apiClient.post('/api/venues/save', { venue_id: venueId, notes });
    return response.data;
  },

  getSavedVenues: async () => {
    const response = await apiClient.get('/api/venues/saved');
    return response.data;
  },

  removeSavedVenue: async (venueId) => {
    const response = await apiClient.delete(`/api/venues/saved/${venueId}`);
    return response.data;
  },

  // 3. Agentic AI Pipeline
  executeAgentWorkflow: async (requirementData) => {
    const response = await apiClient.post('/api/agent/recommend', requirementData);
    return response.data;
  },

  generatePreviewLayout: async (requirementData, venueId = 1) => {
    const response = await apiClient.post(`/api/agent/preview-layout?venue_id=${venueId}`, requirementData);
    return response.data;
  },

  // 4. Search History
  getSearchHistory: async () => {
    const response = await apiClient.get('/api/search-history');
    return response.data;
  },
};

export default api;
