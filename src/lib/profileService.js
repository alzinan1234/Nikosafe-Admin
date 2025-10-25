// lib/profileService.js
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

const getHeaders = (isFormData = false) => {
    const token = tokenManager.getToken();
    const headers = {
        'Accept': 'application/json',
    };
    
    // Don't set Content-Type for FormData, browser will set it automatically with boundary
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Helper to handle API responses and check for HTML errors
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    
    // Check if response is HTML (error page)
    if (contentType && contentType.includes('text/html')) {
        const htmlText = await response.text();
        console.error('HTML response received (likely error):', htmlText.substring(0, 200));
        
        if (response.status === 401) {
            tokenManager.removeToken();
            throw new Error('Authentication failed. Please login again.');
        } else if (response.status === 404) {
            throw new Error('API endpoint not found (404)');
        } else {
            throw new Error('Server returned HTML instead of JSON. Check API endpoint.');
        }
    }
    
    // Parse JSON response
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || data.detail || data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
};

export const profileService = {
    /**
     * Updates admin profile information
     * @param {Object} profileData - Profile data to update
     * @param {string} profileData.venue_name - Venue name
     * @param {string} profileData.hospitality_venue_type - Type of venue (restaurant, hotel, etc.)
     * @param {string} profileData.capacity - Venue capacity
     * @param {string} profileData.hours_of_operation - Operating hours
     * @param {string} profileData.location - Venue location
     * @param {string} profileData.mobile_number - Contact mobile number
     * @param {File} profileData.profile_picture - Profile picture file (optional)
     * @param {File} profileData.resume - Resume file (optional)
     */
    updateProfile: async (profileData) => {
        try {
            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PROFILE_UPDATE);
            console.log('Updating profile at:', url);

            // Create FormData for file upload
            const formData = new FormData();

            // Append text fields
            if (profileData.venue_name) {
                formData.append('venue_name', profileData.venue_name);
            }
            if (profileData.hospitality_venue_type) {
                formData.append('hospitality_venue_type', profileData.hospitality_venue_type);
            }
            if (profileData.capacity) {
                formData.append('capacity', profileData.capacity);
            }
            if (profileData.hours_of_operation) {
                formData.append('hours_of_operation', profileData.hours_of_operation);
            }
            if (profileData.location) {
                formData.append('location', profileData.location);
            }
            if (profileData.mobile_number) {
                formData.append('mobile_number', profileData.mobile_number);
            }

            // Append files if provided
            if (profileData.profile_picture instanceof File) {
                formData.append('profile_picture', profileData.profile_picture);
            }
            if (profileData.resume instanceof File) {
                formData.append('resume', profileData.resume);
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: getHeaders(true), // true indicates FormData
                body: formData,
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Profile updated successfully',
                data: data.data || data,
            };
        } catch (error) {
            console.error('Error updating profile:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: null,
            };
        }
    },

    /**
     * Changes user password
     * @param {Object} passwordData - Password change data
     * @param {string} passwordData.oldPassword - Current password (old_password)
     * @param {string} passwordData.newPassword - New password (new_password)
     * @param {string} passwordData.newPassword2 - Confirm new password (new_password2)
     */
    changePassword: async (passwordData) => {
        try {
            const url = getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_CHANGE);
            console.log('Changing password at:', url);

            // Validate password data
            if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.newPassword2) {
                throw new Error('All password fields are required');
            }

            if (passwordData.newPassword !== passwordData.newPassword2) {
                throw new Error('New passwords do not match');
            }

            if (passwordData.newPassword.length < 8) {
                throw new Error('New password must be at least 8 characters long');
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    old_password: passwordData.oldPassword,
                    new_password: passwordData.newPassword,
                    new_password2: passwordData.newPassword2,
                }),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Password changed successfully',
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error changing password:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Gets current admin profile information
     * Note: Add this endpoint to your config if available
     * GET /api/hospitality/profile-management/
     */
    getProfile: async () => {
        try {
            // Note: Add ADMIN_PROFILE_GET endpoint to your config if this route exists
            const url = getApiUrl('/api/hospitality/profile-management/');
            console.log('Fetching profile from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                data: data.data || data,
                message: data.message,
            };
        } catch (error) {
            console.error('Error fetching profile:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: null,
            };
        }
    },
};