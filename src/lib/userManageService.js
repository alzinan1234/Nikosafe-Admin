// services/userManageService.js

import { tokenManager } from './authService';
import { API_CONFIG, getApiUrl } from './config';

/**
 * Get auth token from tokenManager
 * @returns {string|null} Access token
 */
const getAuthToken = () => {
  return tokenManager.getToken();
};

/**
 * Create request headers with authorization
 * @returns {Object} Headers object
 */
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Handle API response
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} Parsed response data
 */
const handleResponse = async (response) => {
  // Check for unauthorized
  if (response.status === 401) {
    tokenManager.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    throw new Error('Session expired. Please login again.');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return { success: true, message: 'Operation completed successfully' };
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// ==================== USER MANAGEMENT SERVICES ====================

/**
 * Get all users with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {string} params.search - Search term
 * @param {string} params.user_type - Filter by user type (Basic User, Service Provider)
 * @param {boolean} params.is_active - Filter by active status
 * @param {boolean} params.is_blocked - Filter by blocked status
 * @returns {Promise<Object>} Users list with pagination
 */
export const getAllUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.search) queryParams.append('search', params.search);
    if (params.user_type) queryParams.append('user_type', params.user_type);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
    if (params.is_blocked !== undefined) queryParams.append('is_blocked', params.is_blocked);
    
    const url = `${getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_USERS_GET)}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user details by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User details
 */
export const getUserDetails = async (userId) => {
  try {
    const url = getApiUrl(`/api/dashboard/admin/users/${userId}/`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching user details for ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Perform user action (block/unblock/delete/verify)
 * @param {number} userId - User ID
 * @param {string} action - Action type: 'block', 'unblock', 'delete', 'verify', 'unverify'
 * @param {string} reason - Reason for the action (optional)
 * @returns {Promise<Object>} Action result
 */
export const performUserAction = async (userId, action, reason = '') => {
  try {
    const url = getApiUrl(`/api/dashboard/admin/users/${userId}/action/`);
    
    const body = { action };
    if (reason) {
      body.reason = reason;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error performing action ${action} on user ${userId}:`, error);
    throw error;
  }
};

/**
 * Block a user
 * @param {number} userId - User ID
 * @param {string} reason - Reason for blocking
 * @returns {Promise<Object>} Block result
 */
export const blockUser = async (userId, reason = 'Violation of terms and conditions') => {
  return performUserAction(userId, 'block', reason);
};

/**
 * Unblock a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Unblock result
 */
export const unblockUser = async (userId) => {
  return performUserAction(userId, 'unblock');
};

/**
 * Verify a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Verify result
 */
export const verifyUser = async (userId) => {
  return performUserAction(userId, 'verify');
};

/**
 * Unverify a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Unverify result
 */
export const unverifyUser = async (userId) => {
  return performUserAction(userId, 'unverify');
};

/**
 * Delete a user
 * @param {number} userId - User ID
 * @param {string} reason - Reason for deletion
 * @returns {Promise<Object>} Delete result
 */
export const deleteUser = async (userId, reason = 'User requested account deletion') => {
  return performUserAction(userId, 'delete', reason);
};

// ==================== JOB TITLE/DESIGNATION SERVICES ====================

/**
 * Get all service provider designations
 * @returns {Promise<Object>} Designations list
 */
export const getDesignations = async () => {
  try {
    const url = getApiUrl('/api/dashboard/admin/designations/');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching designations:', error);
    throw error;
  }
};

/**
 * Create a new designation
 * @param {string} title - Designation title
 * @returns {Promise<Object>} Created designation
 */
export const createDesignation = async (title) => {
  try {
    const url = getApiUrl('/api/dashboard/admin/designations/');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating designation:', error);
    throw error;
  }
};

/**
 * Update a designation
 * @param {number} designationId - Designation ID
 * @param {string} title - New designation title
 * @returns {Promise<Object>} Updated designation
 */
export const updateDesignation = async (designationId, title) => {
  try {
    const url = getApiUrl(`/api/dashboard/admin/designations/${designationId}/`);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ title }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating designation ${designationId}:`, error);
    throw error;
  }
};

/**
 * Delete a designation
 * @param {number} designationId - Designation ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteDesignation = async (designationId) => {
  try {
    const url = getApiUrl(`/api/dashboard/admin/designations/${designationId}/`);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (response.status === 204) {
      return { success: true, message: 'Designation deleted successfully' };
    }
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting designation ${designationId}:`, error);
    throw error;
  }
};

// ==================== EXPORT DEFAULT ====================
export default {
  getAllUsers,
  getUserDetails,
  performUserAction,
  blockUser,
  unblockUser,
  verifyUser,
  unverifyUser,
  deleteUser,
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
};