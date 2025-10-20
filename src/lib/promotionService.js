// lib/promotionService.js - Updated with dynamic filtering
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

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
        throw new Error(data.message || data.detail || `HTTP error! status: ${response.status}`);
    }
    
    return data;
};

export const promotionService = {
    /**
     * Fetches a list of promotions with dynamic filtering
     * @param {Object} filters - Optional filters: status, page, limit, search, etc.
     * @param {string} filters.status - Status filter: 'pending', 'approved', 'rejected'
     * @param {number} filters.page - Page number for pagination
     * @param {number} filters.limit - Number of items per page
     * @param {string} filters.search - Search term
     * @param {string} filters.sort - Sort field
     * @param {string} filters.order - Sort order: 'asc' or 'desc'
     */
    getPromotions: async (filters = {}) => {
        try {
            // Build query parameters dynamically
            const queryParams = new URLSearchParams();
            
            // Add all provided filters to query params
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                    queryParams.append(key, filters[key]);
                }
            });

            // Construct the URL with query parameters
            const baseUrl = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PROMOTIONS_GET);
            const url = queryParams.toString() 
                ? `${baseUrl}?${queryParams.toString()}`
                : baseUrl;

            console.log('Fetching promotions from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                data: data.data || [],
                message: data.message,
                pagination: data.pagination || null, // If API provides pagination info
                total: data.total || data.data?.length || 0,
            };
        } catch (error) {
            console.error('Error fetching promotions:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: [],
                total: 0,
            };
        }
    },

    /**
     * Fetches promotions with only status filter (backward compatibility)
     * @param {string} status - Status filter: 'pending', 'approved', 'rejected'
     */
    getPromotionsByStatus: async (status = '') => {
        return promotionService.getPromotions({ status });
    },

    /**
     * Fetches pending promotions specifically
     */
    getPendingPromotions: async () => {
        return promotionService.getPromotions({ status: 'pending' });
    },

    /**
     * Fetches approved promotions specifically
     */
    getApprovedPromotions: async () => {
        return promotionService.getPromotions({ status: 'approved' });
    },

    /**
     * Fetches rejected promotions specifically
     */
    getRejectedPromotions: async () => {
        return promotionService.getPromotions({ status: 'rejected' });
    },

    /**
     * Fetches details for a single promotion
     * @param {number|string} promotionId - The ID of the promotion
     */
    getPromotionDetails: async (promotionId) => {
        try {
            if (!promotionId) {
                throw new Error('Promotion ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PROMOTIONS_GET_DETAIL(promotionId));
            console.log('Fetching promotion details from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                data: data.data,
                message: data.message,
            };
        } catch (error) {
            console.error('Error fetching promotion details:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: null,
            };
        }
    },

    /**
     * Approves a promotion
     * @param {number|string} promotionId - The ID of the promotion
     */
    approvePromotion: async (promotionId) => {
        try {
            if (!promotionId) {
                throw new Error('Promotion ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PROMOTIONS_APPROVE(promotionId));
            console.log('Approving promotion at:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({}),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Promotion approved successfully',
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error approving promotion:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Rejects a promotion
     * @param {number|string} promotionId - The ID of the promotion
     * @param {string} reason - Optional rejection reason
     */
    rejectPromotion: async (promotionId, reason = '') => {
        try {
            if (!promotionId) {
                throw new Error('Promotion ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PROMOTIONS_REJECT(promotionId));
            console.log('Rejecting promotion at:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ 
                    rejection_reason: reason || 'Rejected by administrator' 
                }),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Promotion rejected successfully',
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error rejecting promotion:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Search promotions by various criteria
     * @param {string} searchTerm - Search term
     * @param {string} status - Optional status filter
     */
    searchPromotions: async (searchTerm, status = '') => {
        const filters = {};
        
        if (searchTerm) {
            filters.search = searchTerm;
        }
        
        if (status) {
            filters.status = status;
        }

        return promotionService.getPromotions(filters);
    },
};