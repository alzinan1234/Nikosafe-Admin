// lib/registrationService.js - Registration Management API Service
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

export const registrationService = {
  // Get all registrations with filters and pagination
  getAllRegistrations: async (params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.subscription_type) queryParams.append('subscription_type', params.subscription_type);
      if (params.is_verified !== undefined) queryParams.append('is_verified', params.is_verified);
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
      if (params.is_blocked !== undefined) queryParams.append('is_blocked', params.is_blocked);
      if (params.status) queryParams.append('status', params.status);

      const endpoint = `${API_CONFIG.ENDPOINTS.ADMIN_REGISTRATIONS_GET}?${queryParams.toString()}`;
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.results || [],
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
        message: data.message || 'Registrations retrieved successfully'
      };
    } catch (error) {
      console.error('getAllRegistrations error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve registrations'
      };
    }
  },

  // Get single registration details by ID
  getRegistrationDetail: async (registrationId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_REGISTRATIONS_GET_DETAIL(registrationId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Registration details retrieved successfully'
      };
    } catch (error) {
      console.error('getRegistrationDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve registration details'
      };
    }
  },

  // Approve/Reject/Block registration
  updateRegistrationStatus: async (registrationId, action, reason = null) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_REGISTRATIONS_ACTION(registrationId);
      
      const body = { action };
      if (reason) {
        body.reason = reason;
      }

      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || `Registration ${action}d successfully`
      };
    } catch (error) {
      console.error('updateRegistrationStatus error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update registration status'
      };
    }
  },

  // Delete registration
  deleteRegistration: async (registrationId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_REGISTRATIONS_DELETE(registrationId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Registration deleted successfully'
      };
    } catch (error) {
      console.error('deleteRegistration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete registration'
      };
    }
  },

  // Update registration (for edit functionality)
  updateRegistration: async (registrationId, updateData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_REGISTRATIONS_UPDATE(registrationId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Registration updated successfully'
      };
    } catch (error) {
      console.error('updateRegistration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update registration'
      };
    }
  }
};