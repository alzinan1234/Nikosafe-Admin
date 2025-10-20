// lib/bannerService.js
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

export const bannerService = {
    /**
     * Fetches a list of banners with dynamic filtering
     * @param {Object} filters - Optional filters: status, page, limit, search, etc.
     */
    getBanners: async (filters = {}) => {
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
            const baseUrl = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_BANNERS_GET);
            const url = queryParams.toString() 
                ? `${baseUrl}?${queryParams.toString()}`
                : baseUrl;

            console.log('Fetching banners from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                data: data.data?.banners || data.data || [],
                message: data.message,
                statistics: data.data?.statistics || null,
                total: data.data?.statistics?.total_pending || data.data?.banners?.length || 0,
            };
        } catch (error) {
            console.error('Error fetching banners:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: [],
                total: 0,
            };
        }
    },

    /**
     * Fetches banners with only status filter (backward compatibility)
     * @param {string} status - Status filter: 'pending', 'approved', 'rejected'
     */
    getBannersByStatus: async (status = '') => {
        return bannerService.getBanners({ status });
    },

    /**
     * Fetches pending banners specifically
     */
    getPendingBanners: async () => {
        return bannerService.getBanners({ status: 'pending' });
    },

    /**
     * Fetches details for a single banner
     * @param {number|string} bannerId - The ID of the banner
     */
    getBannerDetails: async (bannerId) => {
        try {
            if (!bannerId) {
                throw new Error('Banner ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_BANNERS_GET_DETAIL(bannerId));
            console.log('Fetching banner details from:', url);
            
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
            console.error('Error fetching banner details:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: null,
            };
        }
    },

    /**
     * Approves a banner
     * @param {number|string} bannerId - The ID of the banner
     */
    approveBanner: async (bannerId) => {
        try {
            if (!bannerId) {
                throw new Error('Banner ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_BANNERS_APPROVE(bannerId));
            console.log('Approving banner at:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({}),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Banner approved successfully',
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error approving banner:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Rejects a banner
     * @param {number|string} bannerId - The ID of the banner
     * @param {string} reason - Optional rejection reason
     */
    rejectBanner: async (bannerId, reason = '') => {
        try {
            if (!bannerId) {
                throw new Error('Banner ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_BANNERS_REJECT(bannerId));
            console.log('Rejecting banner at:', url);
            
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
                message: data.message || 'Banner rejected successfully',
                data: data.data || null,
            };
        } catch (error) {
            console.error('Error rejecting banner:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },
};