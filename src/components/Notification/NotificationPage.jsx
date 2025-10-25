'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  BellIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { notificationService } from '@/lib/notificationService';



const NotificationPage = ({ onBackClick }) => {
  // State Management
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'unread', 'read'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null); // Track individual actions
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const now = useMemo(() => new Date(), []);

  // ==================== LIFECYCLE HOOKS ====================
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ==================== FETCH FUNCTIONS ====================
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications();
      
      if (response.success) {
        const notifs = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched notifications:', notifs);
        setNotifications(notifs);
        filterAndSortNotifications(notifs, searchTerm, filterMode, sortOrder);
      } else {
        setError(response.error || 'Failed to load notifications');
        setNotifications([]);
        setFilteredNotifications([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An error occurred while fetching notifications');
      setNotifications([]);
      setFilteredNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterMode, sortOrder]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  // ==================== FILTERING & SORTING ====================
  const filterAndSortNotifications = useCallback((notifs, search, filter, sort) => {
    if (!Array.isArray(notifs)) {
      setFilteredNotifications([]);
      return;
    }

    let filtered = [...notifs];

    // Apply search filter
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(notif =>
        (notif.title?.toLowerCase().includes(lowerSearch)) ||
        (notif.message?.toLowerCase().includes(lowerSearch)) ||
        (notif.description?.toLowerCase().includes(lowerSearch)) ||
        (notif.body?.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply read/unread filter
    if (filter === 'unread') {
      filtered = filtered.filter(notif => !notif.is_read);
    } else if (filter === 'read') {
      filtered = filtered.filter(notif => notif.is_read);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || a.timestamp || 0).getTime();
      const dateB = new Date(b.created_at || b.timestamp || 0).getTime();
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotifications(filtered);
  }, []);

  // ==================== EVENT HANDLERS ====================
  const handleSearchChange = useCallback((e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterAndSortNotifications(notifications, term, filterMode, sortOrder);
  }, [notifications, filterMode, sortOrder, filterAndSortNotifications]);

  const handleFilterChange = useCallback((mode) => {
    setFilterMode(mode);
    filterAndSortNotifications(notifications, searchTerm, mode, sortOrder);
  }, [notifications, searchTerm, sortOrder, filterAndSortNotifications]);

  const handleSortChange = useCallback(() => {
    const newSort = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(newSort);
    filterAndSortNotifications(notifications, searchTerm, filterMode, newSort);
  }, [notifications, searchTerm, filterMode, filterAndSortNotifications]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchNotifications();
      await fetchUnreadCount();
      setSuccessMessage('Notifications refreshed');
    } catch (err) {
      setError('Failed to refresh notifications');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchNotifications, fetchUnreadCount]);

  // ==================== NOTIFICATION ACTIONS ====================
  const handleToggleRead = useCallback(async (notificationId, isCurrentlyRead) => {
    setActionInProgress(notificationId);
    try {
      const response = isCurrentlyRead
        ? await notificationService.markAsUnread(notificationId)
        : await notificationService.markAsRead(notificationId);

      if (response.success) {
        // Update local state
        const updatedNotifs = notifications.map(notif =>
          notif.id === notificationId
            ? { ...notif, is_read: !isCurrentlyRead }
            : notif
        );
        setNotifications(updatedNotifs);
        filterAndSortNotifications(updatedNotifs, searchTerm, filterMode, sortOrder);
        await fetchUnreadCount();
        setSuccessMessage(isCurrentlyRead ? 'Marked as unread' : 'Marked as read');
      } else {
        setError(response.error || 'Failed to update notification');
      }
    } catch (err) {
      setError(err.message || 'Error updating notification');
    } finally {
      setActionInProgress(null);
    }
  }, [notifications, searchTerm, filterMode, sortOrder, filterAndSortNotifications, fetchUnreadCount]);

  const handleDelete = useCallback(async (notificationId) => {
    setActionInProgress(notificationId);
    try {
      const response = await notificationService.deleteNotification(notificationId);
      
      if (response.success) {
        const updatedNotifs = notifications.filter(notif => notif.id !== notificationId);
        setNotifications(updatedNotifs);
        filterAndSortNotifications(updatedNotifs, searchTerm, filterMode, sortOrder);
        setShowDeleteConfirm(null);
        await fetchUnreadCount();
        setSuccessMessage('Notification deleted');
      } else {
        setError(response.error || 'Failed to delete notification');
      }
    } catch (err) {
      setError(err.message || 'Error deleting notification');
    } finally {
      setActionInProgress(null);
    }
  }, [notifications, searchTerm, filterMode, sortOrder, filterAndSortNotifications, fetchUnreadCount]);

  const handleClearAll = useCallback(async () => {
    setIsClearingAll(true);
    setShowClearAllConfirm(false);
    try {
      const response = await notificationService.clearAllNotifications();
      
      if (response.success) {
        setNotifications([]);
        setFilteredNotifications([]);
        setError(null);
        await fetchUnreadCount();
        setSuccessMessage('All notifications cleared');
      } else {
        setError(response.error || 'Failed to clear notifications');
      }
    } catch (err) {
      setError(err.message || 'Error clearing notifications');
    } finally {
      setIsClearingAll(false);
    }
  }, [fetchUnreadCount]);

  const handleMarkAllRead = useCallback(async () => {
    setIsMarkingAllRead(true);
    try {
      const response = await notificationService.markAllAsRead();
      
      if (response.success) {
        const updatedNotifs = notifications.map(notif => ({
          ...notif,
          is_read: true
        }));
        setNotifications(updatedNotifs);
        filterAndSortNotifications(updatedNotifs, searchTerm, filterMode, sortOrder);
        await fetchUnreadCount();
        setSuccessMessage(`${response.updatedCount || notifications.length} notification(s) marked as read`);
      } else {
        setError(response.error || 'Failed to mark all as read');
      }
    } catch (err) {
      setError(err.message || 'Error marking all as read');
    } finally {
      setIsMarkingAllRead(false);
    }
  }, [notifications, searchTerm, filterMode, sortOrder, filterAndSortNotifications, fetchUnreadCount]);

  // ==================== UTILITY FUNCTIONS ====================
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    try {
      const notificationDate = new Date(timestamp);
      if (isNaN(notificationDate.getTime())) return 'Unknown';

      const diffMillis = now.getTime() - notificationDate.getTime();
      const diffMinutes = Math.round(diffMillis / (1000 * 60));
      const diffHours = Math.round(diffMinutes / 60);
      const diffDays = Math.round(diffHours / 24);

      if (diffMinutes < 1) {
        return 'Just now';
      } else if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else if (diffDays < 30) {
        return `${Math.round(diffDays / 7)}w ago`;
      } else {
        return notificationDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch (err) {
      return 'Unknown';
    }
  };

  // ==================== GROUPING NOTIFICATIONS ====================
  const groupedNotifications = useMemo(() => {
    const today = [];
    const yesterday = [];
    const older = [];

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    filteredNotifications.forEach(notif => {
      try {
        const notifDate = new Date(notif.created_at || notif.timestamp);
        if (isNaN(notifDate.getTime())) {
          older.push(notif);
          return;
        }

        if (notifDate >= startOfToday) {
          today.push(notif);
        } else if (notifDate >= startOfYesterday) {
          yesterday.push(notif);
        } else {
          older.push(notif);
        }
      } catch (err) {
        older.push(notif);
      }
    });

    return { today, yesterday, older };
  }, [filteredNotifications, now]);

  // ==================== NOTIFICATION ITEM COMPONENT ====================
  const NotificationItem = ({ notification }) => {
    const isRead = notification.is_read;
    const statusClasses = isRead ? 'text-[#B0B0B0]' : 'text-white';
    const isActionInProgress = actionInProgress === notification.id;

    return (
      <div className="flex items-center justify-between p-4 hover:bg-[#3a3a3a] transition-colors duration-200 group">
        {/* Left Side - Content */}
        <div className="flex-grow pr-4 min-w-0">
          <p className={`text-base font-semibold ${statusClasses} truncate`}>
            {notification.title || 'Notification'}
          </p>
          <p className={`text-sm ${statusClasses} line-clamp-2 mt-1`}>
            {notification.message || notification.description || notification.body || 'No message'}
          </p>
          {!isRead && (
            <div className="mt-2">
              <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded">
                Unread
              </span>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
          {/* Time */}
          <span className="text-xs text-[#B0B0B0] whitespace-nowrap">
            {getRelativeTime(notification.created_at || notification.timestamp)}
          </span>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {/* Mark as Read/Unread Button */}
            <button
              onClick={() => handleToggleRead(notification.id, isRead)}
              disabled={isActionInProgress}
              className={`${
                isRead ? 'text-blue-400' : 'text-purple-600'
              } hover:opacity-75 p-1 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isActionInProgress ? 'animate-pulse' : ''
              }`}
              aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
              title={isRead ? 'Mark as unread' : 'Mark as read'}
            >
              {isActionInProgress ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : isRead ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteConfirm(notification.id)}
              disabled={isActionInProgress}
              className="text-[#FF0000] hover:text-red-400 p-1 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete notification"
              title="Delete notification"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm === notification.id && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#343434] rounded-lg p-6 border border-[#FFFFFF4D] max-w-sm w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-500/20 rounded-full p-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete Notification?</h3>
              </div>
              <p className="text-[#B0B0B0] mb-6">
                This action cannot be undone. Are you sure you want to delete this notification?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(notification.id)}
                  disabled={actionInProgress}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                >
                  {actionInProgress ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={actionInProgress}
                  className="flex-1 bg-[#2A2A2A] hover:bg-[#3a3a3a] disabled:bg-[#2A2A2A]/50 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="bg-[#343434] rounded-2xl text-white p-6 sm:p-6 lg:p-8 min-h-screen">
      {/* ==================== HEADER ====================*/}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Left Side - Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackClick}
            className="text-[#FFFFFF] bg-[#FFFFFF1A] rounded-full p-[10px] hover:bg-[#FFFFFF2A] transition-all duration-200 flex-shrink-0"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-[28px] font-semibold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-[#71F50C] font-medium mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
            {unreadCount === 0 && notifications.length > 0 && (
              <p className="text-sm text-[#B0B0B0] mt-1">All caught up!</p>
            )}
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="bg-[#2A2A2A] hover:bg-[#3a3a3a] disabled:bg-[#2A2A2A]/50 p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            aria-label="Refresh notifications"
            title="Refresh notifications"
          >
            <ArrowPathIcon 
              className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </button>

          {/* Sort Button */}
          <button
            onClick={handleSortChange}
            className="bg-[#2A2A2A] hover:bg-[#3a3a3a] p-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            aria-label="Sort notifications"
            title={`Sort: ${sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}`}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span className="text-xs hidden sm:inline">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* ==================== ERROR MESSAGE ====================*/}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-300 hover:text-red-200 transition-colors flex-shrink-0"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ==================== SUCCESS MESSAGE ====================*/}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded-lg mb-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckIcon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* ==================== SEARCH & FILTERS ====================*/}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications by title or message..."
            className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] rounded-lg border border-[#FFFFFF1A] focus:border-[#71F50C] text-sm focus:outline-none focus:ring-1 focus:ring-[#71F50C]/20 transition-all duration-200"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Filter Mode Buttons */}
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
              filterMode === 'all'
                ? 'bg-[#71F50C] text-black shadow-lg shadow-[#71F50C]/30'
                : 'bg-[#2A2A2A] text-white hover:bg-[#3a3a3a] border border-[#FFFFFF1A]'
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() => handleFilterChange('unread')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
              filterMode === 'unread'
                ? 'bg-[#71F50C] text-black shadow-lg shadow-[#71F50C]/30'
                : 'bg-[#2A2A2A] text-white hover:bg-[#3a3a3a] border border-[#FFFFFF1A]'
            }`}
          >
            Unread ({notifications.filter(n => !n.is_read).length})
          </button>

          <button
            onClick={() => handleFilterChange('read')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
              filterMode === 'read'
                ? 'bg-[#71F50C] text-black shadow-lg shadow-[#71F50C]/30'
                : 'bg-[#2A2A2A] text-white hover:bg-[#3a3a3a] border border-[#FFFFFF1A]'
            }`}
          >
            Read ({notifications.filter(n => n.is_read).length})
          </button>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <>
              <div className="flex-grow" />
              
              <button
                onClick={handleMarkAllRead}
                disabled={isMarkingAllRead || notifications.every(n => n.is_read)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-all duration-200 font-medium text-sm disabled:cursor-not-allowed"
              >
                {isMarkingAllRead ? 'Marking...' : 'Mark all as read'}
              </button>

              <button
                onClick={() => setShowClearAllConfirm(true)}
                disabled={isClearingAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg transition-all duration-200 font-medium text-sm disabled:cursor-not-allowed"
              >
                {isClearingAll ? 'Clearing...' : 'Clear all'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ==================== CLEAR ALL CONFIRMATION ====================*/}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#343434] rounded-lg p-6 border border-[#FFFFFF4D] max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 rounded-full p-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Clear All Notifications?</h3>
            </div>
            <p className="text-[#B0B0B0] mb-6">
              This will permanently delete all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearAll}
                disabled={isClearingAll}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
              >
                {isClearingAll ? 'Clearing...' : 'Clear All'}
              </button>
              <button
                onClick={() => setShowClearAllConfirm(false)}
                disabled={isClearingAll}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#3a3a3a] disabled:bg-[#2A2A2A]/50 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== LOADING STATE ====================*/}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 border-4 border-[#2A2A2A] rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-[#71F50C] rounded-full animate-spin" />
          </div>
          <p className="text-[#B0B0B0]">Loading notifications...</p>
        </div>
      )}

      {/* ==================== NOTIFICATIONS LIST ====================*/}
      {!isLoading && (
        <div className="space-y-6">
          {/* Today Section */}
          {groupedNotifications.today.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <h2 className="text-lg font-semibold text-white">Today</h2>
                <span className="text-[#71F50C] bg-[#71F50C1A] rounded-full text-xs px-3 py-1 font-semibold">
                  {groupedNotifications.today.length}
                </span>
              </div>
              <div className="space-y-2">
                {groupedNotifications.today.map(notif => (
                  <div 
                    key={notif.id} 
                    className="border border-[#FFFFFF4D] rounded-lg hover:border-[#71F50C] hover:bg-[#3a3a3a]/50 transition-all duration-200"
                  >
                    <NotificationItem notification={notif} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Yesterday Section */}
          {groupedNotifications.yesterday.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <h2 className="text-lg font-semibold text-white">Yesterday</h2>
                <span className="text-[#71F50C] bg-[#71F50C1A] rounded-full text-xs px-3 py-1 font-semibold">
                  {groupedNotifications.yesterday.length}
                </span>
              </div>
              <div className="space-y-2">
                {groupedNotifications.yesterday.map(notif => (
                  <div 
                    key={notif.id} 
                    className="border border-[#FFFFFF4D] rounded-lg hover:border-[#71F50C] hover:bg-[#3a3a3a]/50 transition-all duration-200"
                  >
                    <NotificationItem notification={notif} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Older Section */}
          {groupedNotifications.older.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <h2 className="text-lg font-semibold text-white">Older</h2>
                <span className="text-[#71F50C] bg-[#71F50C1A] rounded-full text-xs px-3 py-1 font-semibold">
                  {groupedNotifications.older.length}
                </span>
              </div>
              <div className="space-y-2">
                {groupedNotifications.older.map(notif => (
                  <div 
                    key={notif.id} 
                    className="border border-[#FFFFFF4D] rounded-lg hover:border-[#71F50C] hover:bg-[#3a3a3a]/50 transition-all duration-200"
                  >
                    <NotificationItem notification={notif} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredNotifications.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-[#2A2A2A] rounded-full p-6 mb-4">
                <BellIcon className="h-12 w-12 text-[#B0B0B0] opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchTerm ? 'No notifications found' : notifications.length === 0 ? 'No notifications yet' : 'No matching notifications'}
              </h3>
              <p className="text-[#B0B0B0] text-center text-sm max-w-sm">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : filterMode === 'unread'
                  ? 'All notifications have been read. Great job!'
                  : filterMode === 'read'
                  ? 'No read notifications'
                  : 'You are all caught up!'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    handleFilterChange('all');
                  }}
                  className="mt-4 text-[#71F50C] hover:text-[#71F50C]/80 transition-colors font-medium text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== FOOTER ====================*/}
      {!isLoading && filteredNotifications.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#FFFFFF1A] flex items-center justify-between">
          <div className="text-sm text-[#B0B0B0]">
            Showing <span className="font-semibold text-white">{filteredNotifications.length}</span> of <span className="font-semibold text-white">{notifications.length}</span> notification{filteredNotifications.length !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-[#B0B0B0]">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}

      {/* ==================== NO NOTIFICATIONS ====================*/}
      {!isLoading && notifications.length === 0 && (
        <div className="mt-6 pt-6 border-t border-[#FFFFFF1A] text-center text-xs text-[#B0B0B0]">
          Start interacting with notifications when they arrive
        </div>
      )}
    </div>
  );
};

export default NotificationPage;