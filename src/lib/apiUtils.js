// lib/apiUtils.js - Generic API Request Utility for Admin Panel
import { tokenManager, adminUserManager } from './authService';
import { getApiUrl } from './config';

// Generic API request function with token management
export const apiRequest = async (endpoint, options = {}) => {
  const token = tokenManager.getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(getApiUrl(endpoint), config);
    
    // Check content type before parsing
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      data = { message: text || 'Non-JSON response received' };
    }

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        tokenManager.removeToken();
        adminUserManager.removeUser();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message || 'Request successful',
      status: response.status
    };
  } catch (error) {
    console.error('API Request error:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred',
      status: error.status || 500
    };
  }
};

// HTTP Methods helpers
export const api = {
  // GET request
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
  
  // POST request
  post: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  // PUT request
  put: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  // PATCH request
  patch: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  
  // DELETE request
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

// File upload helper (for multipart/form-data)
export const uploadFile = async (endpoint, formData) => {
  const token = tokenManager.getToken();
  
  const headers = {
    'Accept': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(getApiUrl(endpoint), {
      method: 'POST',
      headers: headers,
      body: formData // Don't set Content-Type for FormData
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || 'Non-JSON response received' };
    }

    if (!response.ok) {
      if (response.status === 401) {
        tokenManager.removeToken();
        adminUserManager.removeUser();
        window.location.href = '/admin/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message || 'File uploaded successfully',
      status: response.status
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file',
      status: error.status || 500
    };
  }
};

// Query params builder helper
export const buildQueryParams = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  return queryParams.toString();
};

// Error handler helper
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error) {
    return error.error;
  }
  
  return defaultMessage;
};