// lib/withdrawalService.js - Withdrawal Management API Service
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';
import toast from 'react-hot-toast';

export const withdrawalService = {
  // Get all withdrawal requests with filters and pagination
  getAllWithdrawals: async (params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('No authentication token found. Please login.');
        throw new Error('No authentication token found. Please login.');
      }

      // Build query parameters dynamically
      const queryParams = new URLSearchParams();
      
      // Add page parameter
      if (params.page) queryParams.append('page', params.page);
      
      // Add page size parameter
      if (params.page_size) queryParams.append('page_size', params.page_size);
      
      // Add search parameter
      if (params.search) queryParams.append('search', params.search);
      
      // Add single status filter
      if (params.status) {
        queryParams.append('status', params.status);
      }
      
      // Add multiple status filters
      if (params.statuses && Array.isArray(params.statuses)) {
        params.statuses.forEach(status => {
          queryParams.append('status', status);
        });
      }

      // Add venue filter
      if (params.venue_id) queryParams.append('venue_id', params.venue_id);
      if (params.venue_name) queryParams.append('venue_name', params.venue_name);
      
      // Add date filters
      if (params.from_date) queryParams.append('from_date', params.from_date);
      if (params.to_date) queryParams.append('to_date', params.to_date);
      
      // Add amount filters
      if (params.min_amount) queryParams.append('min_amount', params.min_amount);
      if (params.max_amount) queryParams.append('max_amount', params.max_amount);
      
      // Add ordering
      if (params.ordering) queryParams.append('ordering', params.ordering);

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `${API_CONFIG.ENDPOINTS.ADMIN_WITHDRAWALS_GET_ALL}?${queryString}`
        : API_CONFIG.ENDPOINTS.ADMIN_WITHDRAWALS_GET_ALL;
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast.error('Server returned non-JSON response.');
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired. Please login again.');
        }
        const errorMsg = data.message || data.error || `HTTP error! status: ${response.status}`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Handle different response formats
      let withdrawalsData = [];
      if (data.data) {
        withdrawalsData = Array.isArray(data.data) ? data.data : [data.data];
      } else if (data.results) {
        withdrawalsData = Array.isArray(data.results) ? data.results : [data.results];
      } else if (Array.isArray(data)) {
        withdrawalsData = data;
      }

      return {
        success: true,
        data: withdrawalsData,
        count: data.count || withdrawalsData.length,
        next: data.next || null,
        previous: data.previous || null,
        message: data.message || 'Withdrawals retrieved successfully'
      };
    } catch (error) {
      console.error('getAllWithdrawals error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve withdrawals'
      };
    }
  },

  // Get pending withdrawal requests
  getPendingWithdrawals: async (params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('No authentication token found. Please login.');
        throw new Error('No authentication token found. Please login.');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.page_size) queryParams.append('page_size', params.page_size);

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `${API_CONFIG.ENDPOINTS.ADMIN_WITHDRAWALS_PENDING}?${queryString}`
        : API_CONFIG.ENDPOINTS.ADMIN_WITHDRAWALS_PENDING;
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast.error('Server returned non-JSON response.');
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired. Please login again.');
        }
        const errorMsg = data.message || data.error || `HTTP error! status: ${response.status}`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Handle different response formats
      let withdrawalsData = [];
      if (data.data) {
        withdrawalsData = Array.isArray(data.data) ? data.data : [data.data];
      } else if (data.results) {
        withdrawalsData = Array.isArray(data.results) ? data.results : [data.results];
      } else if (Array.isArray(data)) {
        withdrawalsData = data;
      }

      return {
        success: true,
        data: withdrawalsData,
        count: data.count || withdrawalsData.length,
        message: data.message || 'Pending withdrawals retrieved successfully'
      };
    } catch (error) {
      console.error('getPendingWithdrawals error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve pending withdrawals'
      };
    }
  },

  // Get single withdrawal details by ID
  getWithdrawalDetail: async (withdrawalId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('No authentication token found. Please login.');
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_WITHDRAWALS_GET_DETAIL(withdrawalId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast.error('Server returned non-JSON response.');
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired. Please login again.');
        }
        const errorMsg = data.message || data.error || `HTTP error! status: ${response.status}`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Withdrawal details retrieved successfully'
      };
    } catch (error) {
      console.error('getWithdrawalDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve withdrawal details'
      };
    }
  },

  // Approve withdrawal (mark as completed)
  approveWithdrawal: async (withdrawalId, params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('No authentication token found. Please login.');
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_WITHDRAWALS_APPROVE(withdrawalId);
      
      // Build query parameters for status transition
      const queryParams = new URLSearchParams();
      queryParams.append('status', params.current_status || 'processing');
      queryParams.append('status', params.new_status || 'completed');

      const fullEndpoint = `${endpoint}?${queryParams.toString()}`;
      
      const response = await fetch(getApiUrl(fullEndpoint), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          notes: params.notes || '',
          processed_by: params.processed_by || ''
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast.error('Server returned non-JSON response.');
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired. Please login again.');
        }
        const errorMsg = data.message || data.error || `HTTP error! status: ${response.status}`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      toast.success(data.message || 'Withdrawal approved successfully');
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Withdrawal approved successfully'
      };
    } catch (error) {
      console.error('approveWithdrawal error:', error);
      toast.error(error.message || 'Failed to approve withdrawal');
      return {
        success: false,
        error: error.message || 'Failed to approve withdrawal'
      };
    }
  },

  // Reject withdrawal
  rejectWithdrawal: async (withdrawalId, params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('No authentication token found. Please login.');
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_WITHDRAWALS_REJECT(withdrawalId);
      
      // Build query parameters for status transition
      const queryParams = new URLSearchParams();
      queryParams.append('status', params.current_status || 'processing');
      queryParams.append('status', params.new_status || 'rejected');

      const fullEndpoint = `${endpoint}?${queryParams.toString()}`;
      
      const response = await fetch(getApiUrl(fullEndpoint), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: params.reason || '',
          notes: params.notes || '',
          processed_by: params.processed_by || ''
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast.error('Server returned non-JSON response.');
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired. Please login again.');
        }
        const errorMsg = data.message || data.error || `HTTP error! status: ${response.status}`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      toast.success(data.message || 'Withdrawal rejected successfully');
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Withdrawal rejected successfully'
      };
    } catch (error) {
      console.error('rejectWithdrawal error:', error);
      toast.error(error.message || 'Failed to reject withdrawal');
      return {
        success: false,
        error: error.message || 'Failed to reject withdrawal'
      };
    }
  },

  // Mark withdrawal as processing
  markAsProcessing: async (withdrawalId, params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('No authentication token found. Please login.');
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = API_CONFIG.ENDPOINTS.ADMIN_WITHDRAWALS_PROCESSING(withdrawalId);
      
      // Build query parameters for status transition
      const queryParams = new URLSearchParams();
      queryParams.append('status', params.current_status || 'pending');
      queryParams.append('status', params.new_status || 'processing');

      const fullEndpoint = `${endpoint}?${queryParams.toString()}`;
      
      const response = await fetch(getApiUrl(fullEndpoint), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          notes: params.notes || '',
          processed_by: params.processed_by || ''
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast.error('Server returned non-JSON response.');
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired. Please login again.');
        }
        const errorMsg = data.message || data.error || `HTTP error! status: ${response.status}`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      toast.success(data.message || 'Withdrawal marked as processing');
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Withdrawal marked as processing'
      };
    } catch (error) {
      console.error('markAsProcessing error:', error);
      toast.error(error.message || 'Failed to mark withdrawal as processing');
      return {
        success: false,
        error: error.message || 'Failed to mark withdrawal as processing'
      };
    }
  }
};

export default withdrawalService;