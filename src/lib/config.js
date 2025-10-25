// lib/config.js - Updated with withdrawal endpoints
export const API_CONFIG = {
    BASE_URL: "https://tamil-opt-healthy-will.trycloudflare.com",
    ENDPOINTS: {
        // ==================== AUTHENTICATION ====================
        ADMIN_LOGIN: "/api/accounts/login/",

         // ==================== PASSWORD MANAGEMENT ====================
    PASSWORD_RESET_REQUEST: "/api/accounts/password/reset-request/",
    PASSWORD_RESET_VERIFY_OTP: "/api/accounts/password/reset-verify-otp/",
    PASSWORD_RESET_CONFIRM: "/api/accounts/password/reset-confirm/",
    PASSWORD_CHANGE: "/api/accounts/password/change/",
    RESEND_OTP: "/api/accounts/resend-otp/",
    VERIFY_OTP: "/api/accounts/verify-otp/",
        
        // ==================== ADMIN - USER MANAGEMENT ====================
        ADMIN_USERS_GET: "/api/dashboard/admin/users/",
        ADMIN_USERS_GET_DETAIL: (userId) => `/api/dashboard/admin/users/${userId}/`,
        ADMIN_USERS_ACTION: (userId) => `/api/dashboard/admin/users/${userId}/action/`,
        
        // ==================== ADMIN - DESIGNATIONS ====================
        ADMIN_DESIGNATIONS_GET: "/api/dashboard/admin/designations/",
        ADMIN_DESIGNATIONS_CREATE: "/api/dashboard/admin/designations/",
        ADMIN_DESIGNATIONS_UPDATE: (designationId) => `/api/dashboard/admin/designations/${designationId}/`,
        ADMIN_DESIGNATIONS_DELETE: (designationId) => `/api/dashboard/admin/designations/${designationId}/`,
        
        // ==================== ADMIN - PROMOTIONS ====================
        ADMIN_PROMOTIONS_GET: "/api/dashboard/admin/promotions/all",
        ADMIN_PROMOTIONS_PENDING: "/api/dashboard/admin/promotions/pending/",
        ADMIN_PROMOTIONS_GET_DETAIL: (promotionId) => `/api/dashboard/admin/promotions/${promotionId}/`,
        ADMIN_PROMOTIONS_APPROVE: (promotionId) => `/api/dashboard/admin/promotions/${promotionId}/approve/`,
        ADMIN_PROMOTIONS_REJECT: (promotionId) => `/api/dashboard/admin/promotions/${promotionId}/reject/`,
        
        // ==================== ADMIN - BANNERS ====================
        ADMIN_BANNERS_GET: "/api/dashboard/admin/banners/all",
        ADMIN_BANNERS_PENDING: "/api/dashboard/admin/banners/pending/",
        ADMIN_BANNERS_GET_DETAIL: (bannerId) => `/api/dashboard/admin/banners/${bannerId}/`,
        ADMIN_BANNERS_APPROVE: (bannerId) => `/api/dashboard/admin/banners/${bannerId}/approve/`,
        ADMIN_BANNERS_REJECT: (bannerId) => `/api/dashboard/admin/banners/${bannerId}/reject/`,
        
        // ==================== ADMIN - SUPPORT TICKETS ====================
        ADMIN_TICKETS_GET: "/api/core/tickets/",
        ADMIN_TICKETS_GET_DETAIL: (ticketId) => `/api/core/tickets/${ticketId}/`,
        ADMIN_TICKETS_UPDATE_STATUS: (ticketId) => `/api/core/tickets/${ticketId}/`,
        ADMIN_TICKETS_DELETE: (ticketId) => `/api/core/tickets/${ticketId}/`,
        
        // ==================== ADMIN - REGISTRATIONS ====================
        ADMIN_REGISTRATIONS_GET: "/api/dashboard/admin/registrations/",
        ADMIN_REGISTRATIONS_GET_DETAIL: (registrationId) => `/api/dashboard/admin/registrations/${registrationId}/`,
        ADMIN_REGISTRATIONS_ACTION: (registrationId) => `/api/dashboard/admin/registrations/${registrationId}/action/`,
        ADMIN_REGISTRATIONS_DELETE: (registrationId) => `/api/dashboard/admin/registrations/${registrationId}/`,
        ADMIN_REGISTRATIONS_UPDATE: (registrationId) => `/api/dashboard/admin/registrations/${registrationId}/`,
        
        // ==================== ADMIN - WITHDRAWALS ====================
        ADMIN_WITHDRAWALS_GET_ALL: "/api/dashboard/admin/withdrawals/1/",
        ADMIN_WITHDRAWALS_PENDING: "/api/dashboard/admin/withdrawals/pending/",
        ADMIN_WITHDRAWALS_GET_DETAIL: (withdrawalId) => `/api/dashboard/admin/withdrawals/${withdrawalId}/`,
        ADMIN_WITHDRAWALS_APPROVE: (withdrawalId) => `/api/dashboard/admin/withdrawals/${withdrawalId}/approve/`,
        ADMIN_WITHDRAWALS_REJECT: (withdrawalId) => `/api/dashboard/admin/withdrawals/${withdrawalId}/approve/`,
        ADMIN_WITHDRAWALS_PROCESSING: (withdrawalId) => `/api/dashboard/admin/withdrawals/${withdrawalId}/processing/`,
        
        // ==================== ADMIN - SETTINGS ====================
        ADMIN_SETTINGS_GET: "/api/core/settings/",
        ADMIN_SETTINGS_GET_DETAIL: (settingType) => `/api/core/settings/${settingType}/`,
        ADMIN_SETTINGS_CREATE: "/api/core/settings/",
        ADMIN_SETTINGS_UPDATE: (settingType) => `/api/core/settings/${settingType}/`,
        ADMIN_SETTINGS_DELETE: (settingType) => `/api/core/settings/${settingType}/`,
        
        // ==================== ADMIN - FAQs ====================
        ADMIN_FAQS_GET: "/api/core/faqs/",
        ADMIN_FAQS_GET_DETAIL: (faqId) => `/api/core/faqs/${faqId}/`,
        ADMIN_FAQS_CREATE: "/api/core/faqs/create/",
        ADMIN_FAQS_UPDATE: (faqId) => `/api/core/faqs/${faqId}/`,
        ADMIN_FAQS_DELETE: (faqId) => `/api/core/faqs/${faqId}/delete/`,


        

    ADMIN_PROFILE_UPDATE: "/api/hospitality/profile-management/update/",
    
    // Password Management
    PASSWORD_CHANGE: "/api/accounts/password/change/",



        // ==================== NOTIFICATIONS ====================
        NOTIFICATION_LIST: "/api/notification/list/",
        NOTIFICATION_DETAIL: (notificationId) => `/api/notification/list/${notificationId}/`,
        NOTIFICATION_MARK_READ: (notificationId) => `/api/notification/list/${notificationId}/mark_read/`,
        NOTIFICATION_MARK_UNREAD: (notificationId) => `/api/notification/list/${notificationId}/mark_unread/`,
        NOTIFICATION_MARK_ALL_READ: "/api/notification/list/mark_all_read/",
        NOTIFICATION_UNREAD_COUNT: "/api/notification/list/unread_count/",
        NOTIFICATION_DELETE: (notificationId) => `/api/notification/list/${notificationId}/`,
        NOTIFICATION_CLEAR_ALL: "/api/notification/list/clear_all/",

        
    }
};

// Get full API URL
export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to validate URL structure
export const validateEndpoint = (endpoint) => {
    if (typeof endpoint !== 'string' || !endpoint.startsWith('/')) {
        console.error('Invalid endpoint format:', endpoint);
        return false;
    }
    return true;
};