// lib/supportService.js
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

export const supportService = {
    /**
     * Fetches a list of support tickets with dynamic filtering
     * @param {Object} filters - Optional filters: status, priority, page, search, user_email, etc.
     */
    getTickets: async (filters = {}) => {
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
            const baseUrl = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_TICKETS_GET);
            const url = queryParams.toString() 
                ? `${baseUrl}?${queryParams.toString()}`
                : baseUrl;

            console.log('Fetching tickets from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                data: data.results || data.data || [],
                message: data.message,
                count: data.count || 0,
                next: data.next || null,
                previous: data.previous || null,
                total: data.count || data.results?.length || 0,
            };
        } catch (error) {
            console.error('Error fetching tickets:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: [],
                total: 0,
            };
        }
    },

    /**
     * Fetches tickets by status (backward compatibility)
     * @param {string} status - Status filter: 'open', 'in_progress', 'resolved', 'closed'
     */
    getTicketsByStatus: async (status = '') => {
        return supportService.getTickets({ status });
    },

    /**
     * Fetches tickets by priority
     * @param {string} priority - Priority filter: 'low', 'medium', 'high', 'urgent'
     */
    getTicketsByPriority: async (priority = '') => {
        return supportService.getTickets({ priority });
    },

    /**
     * Search tickets by term
     * @param {string} searchTerm - Search term for subject, description, or user email
     */
    searchTickets: async (searchTerm = '') => {
        return supportService.getTickets({ search: searchTerm });
    },

    /**
     * Fetches details for a single ticket
     * @param {number|string} ticketId - The ID of the ticket
     */
    getTicketDetails: async (ticketId) => {
        try {
            if (!ticketId) {
                throw new Error('Ticket ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_TICKETS_GET_DETAIL(ticketId));
            console.log('Fetching ticket details from:', url);
            
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
            console.error('Error fetching ticket details:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: null,
            };
        }
    },

    /**
     * Updates ticket status
     * @param {number|string} ticketId - The ID of the ticket
     * @param {string} status - New status: 'open', 'in_progress', 'resolved', 'closed'
     * @param {string} adminNotes - Optional admin notes
     */
    updateTicketStatus: async (ticketId, status, adminNotes = '') => {
        try {
            if (!ticketId) {
                throw new Error('Ticket ID is required');
            }
            if (!status) {
                throw new Error('Status is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_TICKETS_UPDATE_STATUS(ticketId));
            console.log('Updating ticket status at:', url);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ 
                    status,
                    admin_notes: adminNotes 
                }),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Ticket status updated successfully',
                data: data.data || data,
            };
        } catch (error) {
            console.error('Error updating ticket status:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Updates ticket priority
     * @param {number|string} ticketId - The ID of the ticket
     * @param {string} priority - New priority: 'low', 'medium', 'high', 'urgent'
     */
    updateTicketPriority: async (ticketId, priority) => {
        try {
            if (!ticketId) {
                throw new Error('Ticket ID is required');
            }
            if (!priority) {
                throw new Error('Priority is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_TICKETS_UPDATE_STATUS(ticketId));
            console.log('Updating ticket priority at:', url);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ priority }),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Ticket priority updated successfully',
                data: data.data || data,
            };
        } catch (error) {
            console.error('Error updating ticket priority:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

    /**
     * Resolves a ticket (shorthand for updating status to 'resolved')
     * @param {number|string} ticketId - The ID of the ticket
     * @param {string} resolutionNotes - Resolution notes
     */
    resolveTicket: async (ticketId, resolutionNotes = '') => {
        return supportService.updateTicketStatus(ticketId, 'resolved', resolutionNotes);
    },

    /**
     * Closes a ticket (shorthand for updating status to 'closed')
     * @param {number|string} ticketId - The ID of the ticket
     * @param {string} closureNotes - Closure notes
     */
    closeTicket: async (ticketId, closureNotes = '') => {
        return supportService.updateTicketStatus(ticketId, 'closed', closureNotes);
    },

    /**
     * Deletes a ticket
     * @param {number|string} ticketId - The ID of the ticket
     */
    deleteTicket: async (ticketId) => {
        try {
            if (!ticketId) {
                throw new Error('Ticket ID is required');
            }

            const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_TICKETS_DELETE(ticketId));
            console.log('Deleting ticket at:', url);
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            const data = await handleResponse(response);

            return {
                success: true,
                message: data.message || 'Ticket deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting ticket:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
            };
        }
    },

            /**
             * Create a reply for a ticket
             * @param {number|string} ticketId
             * @param {string} message
             */
            createReply: async (ticketId, message) => {
                try {
                    if (!ticketId) throw new Error('Ticket ID is required');
                    if (!message || typeof message !== 'string') throw new Error('Message is required');

                    // Endpoint based on backend convention: /api/core/tickets/{id}/replies/create/
                    const url = getApiUrl(`/api/core/tickets/${ticketId}/replies/create/`);
                    console.log('Creating reply at:', url);

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify({ ticket: ticketId, message }),
                    });

                    const data = await handleResponse(response);

                    return {
                        success: true,
                        message: data.message || 'Reply posted successfully',
                        data: data.data || data,
                    };
                } catch (error) {
                    console.error('Error creating reply:', error);
                    return {
                        success: false,
                        error: error.message || 'Failed to create reply',
                    };
                }
            },

    /**
     * Get ticket statistics
     * @returns {Object} Statistics about tickets
     */
    getTicketStatistics: async () => {
        try {
            const result = await supportService.getTickets();
            
            if (result.success) {
                const tickets = result.data;
                
                // Calculate statistics
                const stats = {
                    total: tickets.length,
                    open: tickets.filter(t => t.status === 'open').length,
                    in_progress: tickets.filter(t => t.status === 'in_progress').length,
                    resolved: tickets.filter(t => t.status === 'resolved').length,
                    closed: tickets.filter(t => t.status === 'closed').length,
                    high_priority: tickets.filter(t => t.priority === 'high').length,
                    urgent: tickets.filter(t => t.priority === 'urgent').length,
                };

                return {
                    success: true,
                    data: stats,
                };
            }

            return result;
        } catch (error) {
            console.error('Error fetching ticket statistics:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred',
                data: null,
            };
        }
    },
};