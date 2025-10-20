// lib/settingsService.js - Settings Management API Service
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

export const settingsService = {
  // Get all settings
  getAllSettings: async () => {
    let response;
    try {
      const token = tokenManager.getToken();
      console.log('🔑 Token from manager:', token);
      
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_SETTINGS_GET;
      const fullUrl = getApiUrl(endpoint);
      console.log('🔗 Fetching from:', fullUrl);
      
      response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Settings data:', data);
      
      return {
        success: true,
        data: data.results || data || [],
        message: data.message || 'Settings retrieved successfully'
      };
    } catch (error) {
      console.error('❌ getAllSettings error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve settings',
        data: []
      };
    }
  },

  // Get single setting by type
  getSettingByType: async (settingType) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_SETTINGS_GET_DETAIL(settingType);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Setting retrieved successfully'
      };
    } catch (error) {
      console.error('getSettingByType error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve setting'
      };
    }
  },

  // Create new setting
  createSetting: async (settingData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_SETTINGS_CREATE;
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settingData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Setting created successfully'
      };
    } catch (error) {
      console.error('createSetting error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create setting'
      };
    }
  },

  // Update setting
  updateSetting: async (settingType, updateData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_SETTINGS_UPDATE(settingType);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Setting updated successfully'
      };
    } catch (error) {
      console.error('updateSetting error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update setting'
      };
    }
  },

  // Delete setting
  deleteSetting: async (settingType) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_SETTINGS_DELETE(settingType);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Setting deleted successfully'
      };
    } catch (error) {
      console.error('deleteSetting error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete setting'
      };
    }
  },

  // Get all FAQs
  getAllFaqs: async (params = {}) => {
    let response;
    try {
      const token = tokenManager.getToken();
      console.log('🔑 Token from manager:', token);
      
      if (!token) throw new Error('No authentication token found. Please login.');

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.search) queryParams.append('search', params.search);

      const endpoint = `${API_CONFIG.ENDPOINTS.ADMIN_FAQS_GET}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const fullUrl = getApiUrl(endpoint);
      console.log('🔗 Fetching FAQs from:', fullUrl);
      
      response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ FAQs data:', data);
      
      const results = data.results || data || [];

      return {
        success: true,
        data: Array.isArray(results) ? results : [],
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
        message: data.message || 'FAQs retrieved successfully'
      };
    } catch (error) {
      console.error('❌ getAllFaqs error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve FAQs',
        data: []
      };
    }
  },

  // Get single FAQ
  getFaqDetail: async (faqId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_FAQS_GET_DETAIL(faqId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'FAQ retrieved successfully'
      };
    } catch (error) {
      console.error('getFaqDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve FAQ'
      };
    }
  },

  // Create new FAQ
  createFaq: async (faqData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_FAQS_CREATE;
      
      const payload = {
        question: faqData.question || '',
        answer: faqData.answer || '',
        is_active: faqData.is_active !== undefined ? faqData.is_active : true,
        order: faqData.order || 0,
      };

      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'FAQ created successfully'
      };
    } catch (error) {
      console.error('createFaq error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create FAQ'
      };
    }
  },

  // Update FAQ
  updateFaq: async (faqId, updateData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_FAQS_UPDATE(faqId);
      
      const payload = {
        question: updateData.question || '',
        answer: updateData.answer || '',
        is_active: updateData.is_active !== undefined ? updateData.is_active : true,
        order: updateData.order !== undefined ? updateData.order : 0,
      };

      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'FAQ updated successfully'
      };
    } catch (error) {
      console.error('updateFaq error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update FAQ'
      };
    }
  },

  // Delete FAQ
  deleteFaq: async (faqId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_FAQS_DELETE(faqId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'FAQ deleted successfully'
      };
    } catch (error) {
      console.error('deleteFaq error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete FAQ'
      };
    }
  }
};