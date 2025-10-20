// lib/config.js - Updated with banner endpoints
export const API_CONFIG = {
    BASE_URL: "https://luke-stat-forming-kinase.trycloudflare.com",
    ENDPOINTS: {
        // ==================== AUTHENTICATION ====================
        ADMIN_LOGIN: "/api/accounts/login/",

        // ==================== ADMIN - PROMOTIONS ====================
        ADMIN_PROMOTIONS_GET: "/api/dashboard/admin/promotions/all",
        ADMIN_PROMOTIONS_PENDING: "/api/dashboard/admin/promotions/pending/",
        ADMIN_PROMOTIONS_GET_DETAIL: (promotionId) => `/api/dashboard/admin/promotions/${promotionId}/`,
        ADMIN_PROMOTIONS_APPROVE: (promotionId) => `/api/dashboard/admin/promotions/${promotionId}/approve/`,
        ADMIN_PROMOTIONS_REJECT: (promotionId) => `/api/dashboard/admin/promotions/${promotionId}/reject/`,

        // ==================== ADMIN - BANNERS (NEW) ====================
        // Get all banners with status filter
        ADMIN_BANNERS_GET: "/api/dashboard/admin/banners/all",
        // Get pending banners only
        ADMIN_BANNERS_PENDING: "/api/dashboard/admin/banners/pending/",
        // Get banner detail
        ADMIN_BANNERS_GET_DETAIL: (bannerId) => `/api/dashboard/admin/banners/${bannerId}/`,
        // Approve banner
        ADMIN_BANNERS_APPROVE: (bannerId) => `/api/dashboard/admin/banners/${bannerId}/approve/`,
        // Reject banner
        ADMIN_BANNERS_REJECT: (bannerId) => `/api/dashboard/admin/banners/${bannerId}/reject/`,

        // ==================== ADMIN - REGISTRATIONS ====================
        ADMIN_REGISTRATIONS_GET: "/api/dashboard/admin/registrations/",
        ADMIN_REGISTRATIONS_GET_DETAIL: (registrationId) => `/api/dashboard/admin/registrations/${registrationId}/`,
        ADMIN_REGISTRATIONS_ACTION: (registrationId) => `/api/dashboard/admin/registrations/${registrationId}/action/`,
        ADMIN_REGISTRATIONS_DELETE: (registrationId) => `/api/dashboard/admin/registrations/${registrationId}/`,
        ADMIN_REGISTRATIONS_UPDATE: (registrationId) => `/api/dashboard/admin/registrations/${registrationId}/`,

        // ==================== ADMIN - SETTINGS ====================
        ADMIN_SETTINGS_GET: "/api/core/settings/",
        ADMIN_SETTINGS_GET_DETAIL: (settingType) => `/api/core/settings/${settingType}/`,
        ADMIN_SETTINGS_CREATE: "/api/core/settings/",
        ADMIN_SETTINGS_UPDATE: (settingType) => `/api/core/settings/${settingType}/`,
        ADMIN_SETTINGS_DELETE: (settingType) => `/api/core/settings/${settingType}/`,

        // ==================== ADMIN - FAQs ====================
        ADMIN_FAQS_GET: "/api/core/faqs/",
        ADMIN_FAQS_GET_DETAIL: (faqId) => `/api/core/faqs/${faqId}/`,
        ADMIN_FAQS_CREATE: "/api/core/faqs/",
        ADMIN_FAQS_UPDATE: (faqId) => `/api/core/faqs/${faqId}/`,
        ADMIN_FAQS_DELETE: (faqId) => `/api/core/faqs/${faqId}/`,
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