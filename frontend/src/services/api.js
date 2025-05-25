import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`HTTP ${status}:`, data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const opportunitiesAPI = {
  // Fetch opportunities by category
  getOpportunities: async (category) => {
    try {
      const response = await api.get(`/opportunities/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch ${category} opportunities: ${error.message}`);
    }
  },

  // Search opportunities (if backend supports it)
  searchOpportunities: async (category, query) => {
    try {
      const response = await api.get(`/opportunities/${category}`, {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search ${category} opportunities: ${error.message}`);
    }
  }
};

export default api;
