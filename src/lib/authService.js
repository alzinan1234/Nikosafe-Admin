// lib/authService.js - Admin Authentication Service
import { API_CONFIG, getApiUrl } from './config';

// Token management functions
export const tokenManager = {
  // Set token in cookie and localStorage
  setToken: (token, rememberMe = false) => {
    localStorage.setItem('adminAuthToken', token);
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day
    document.cookie = `adminToken=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  },

  // Get token from cookie
  getToken: () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; adminToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return localStorage.getItem('adminAuthToken');
  },

  // Remove token
  removeToken: () => {
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('adminAuthToken');
  }
};

// Admin user management
export const adminUserManager = {
  // Set admin user data
  setUser: (userData) => {
    localStorage.setItem('adminUser', JSON.stringify(userData));
  },

  // Get admin user data
  getUser: () => {
    const userData = localStorage.getItem('adminUser');
    return userData ? JSON.parse(userData) : null;
  },

  // Remove admin user data
  removeUser: () => {
    localStorage.removeItem('adminUser');
  }
};

// API Service for admin authentication
export const authService = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      console.log(data)

      return {
        success: true,
        data: data.data || data,
        token: data?.data?.access,
        refresh: data?.data?.refresh || null,
        user: data?.data?.user || data.data?.user || null,
        message: data.message || 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  },

  // Verify Email/OTP
  verifyEmail: async (email, otp) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_EMAIL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'OTP verification failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Email verified successfully'
      };
    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify email'
      };
    }
  },

  // Resend OTP
  resendOtp: async (email, purpose = 'verification') => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.RESEND_OTP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, purpose })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to resend OTP');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Resend OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to resend OTP'
      };
    }
  },

  // Set Password (First time or after verification)
  setPassword: async (email, password, password2) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SET_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password, password2 })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to set password');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Password set successfully'
      };
    } catch (error) {
      console.error('Set password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to set password'
      };
    }
  },

  // Password Reset - Verify OTP
  passwordResetVerifyOtp: async (email, otp) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_RESET_VERIFY_OTP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'OTP verification failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'OTP verified successfully'
      };
    } catch (error) {
      console.error('Password reset verify OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify OTP'
      };
    }
  },

  // Password Reset - Confirm New Password
  passwordResetConfirm: async (email, otp, newPassword, newPassword2) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_RESET_CONFIRM), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp, 
          new_password: newPassword, 
          new_password2: newPassword2 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Password reset failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Password reset successfully'
      };
    } catch (error) {
      console.error('Password reset confirm error:', error);
      return {
        success: false,
        error: error.message || 'Failed to reset password'
      };
    }
  },

  // Change Password (Authenticated user)
  changePassword: async (oldPassword, newPassword, newPassword2) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_CHANGE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          old_password: oldPassword, 
          new_password: newPassword, 
          new_password2: newPassword2 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          adminUserManager.removeUser();
          window.location.href = '/admin/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || 'Password change failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to change password'
      };
    }
  },

  // Logout function
  logout: async () => {
    try {
      // If you have a logout endpoint, call it here
      // const token = tokenManager.getToken();
      // const response = await fetch(getApiUrl('/api/admin/logout'), {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   }
      // });

      // Clear local token and user data
      tokenManager.removeToken();
      adminUserManager.removeUser();
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    return tokenManager.getToken() !== null;
  },

  // Get current admin user
  getCurrentUser: () => {
    return adminUserManager.getUser();
  }
};