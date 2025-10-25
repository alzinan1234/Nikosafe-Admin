// lib/notificationService.js

import { tokenManager } from "./authService";
import { API_CONFIG, getApiUrl } from "./config";


// Token Manager (integrate with your auth service)
// export const tokenManager = {
//     getToken: () => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
//         }
//         return null;
//     },
//     removeToken: () => {
//         if (typeof window !== 'undefined') {
//             localStorage.removeItem('authToken');
//             sessionStorage.removeItem('authToken');
//         }
//     }
// };

// Get Headers with Authorization
const getHeaders = () => {
    const token = tokenManager.getToken();
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Handle API Response
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
        throw new Error(data.message || data.detail || `HTTP error! status: ${response.status}`);
    }
    
    return data;
};

export const notificationService = {
    /**
     * Fetches a list of notifications with dynamic filtering
     * @param {Object} filters - Optional filters: is_read, page, limit, search, etc.
     */
    getNotifications: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                    queryParams.append(key, filters[key]);
                }
            });

            const baseUrl = getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATION_LIST);
            const url = queryParams.toString() 
                ? `${baseUrl}?${queryParams.toString()}`
                : baseUrl;

            console.log('Fetching notifications from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                data: data.results || data.data || [],
                message: data.message,
                count: data.count || data.data?.length || 0,
                next: data.next || null,
                previous: data.previous || null,
            };
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: [],
                count: 0,
            };
        }
    },

    /**
     * Fetches unread notification count
     */
    getUnreadCount: async () => {
        try {
            const url = getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATION_UNREAD_COUNT);
            console.log('Fetching unread count from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                unreadCount: data.data?.unread_count || data.unread_count || 0,
                message: data.message,
            };
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                unreadCount: 0,
            };
        }
    },

    /**
     * Fetches details for a single notification
     */
    getNotificationDetails: async (notificationId) => {
        try {
            if (!notificationId) {
                throw new Error('Notification ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATION_DETAIL(notificationId));
            console.log('Fetching notification details from:', url);
            
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
            console.error('Error fetching notification details:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: null,
            };
        }
    },

    /**
     * Marks a single notification as read
     */
    markAsRead: async (notificationId) => {
        try {
            if (!notificationId) {
                throw new Error('Notification ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATION_MARK_READ(notificationId));
            console.log('Marking notification as read at:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({}),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Notification marked as read',
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Marks a notification as unread
     */
    markAsUnread: async (notificationId) => {
        try {
            if (!notificationId) {
                throw new Error('Notification ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATION_MARK_UNREAD(notificationId));
            console.log('Marking notification as unread at:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({}),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Notification marked as unread',
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error marking notification as unread:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Marks all notifications as read
     */
    markAllAsRead: async () => {
        try {
            const url = getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATION_MARK_ALL_READ);
            console.log('Marking all notifications as read at:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({}),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'All notifications marked as read',
                updatedCount: data.data?.updated_count || 0,
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Deletes a single notification
     */
    deleteNotification: async (notificationId) => {
        try {
            if (!notificationId) {
                throw new Error('Notification ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATION_DELETE(notificationId));
            console.log('Deleting notification at:', url);
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Notification deleted successfully',
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error deleting notification:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Clears all notifications
     */
    clearAllNotifications: async () => {
        try {
            const url = getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATION_CLEAR_ALL);
            console.log('Clearing all notifications at:', url);
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(),
                body: JSON.stringify({}),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'All notifications cleared successfully',
                deletedCount: data.data?.deleted_count || 0,
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error clearing all notifications:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },
};