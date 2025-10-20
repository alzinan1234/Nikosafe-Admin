'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon, // For view
  TrashIcon, // For delete
  CheckCircleIcon, // For mark as read/unread
  EnvelopeIcon // Alternative for unread
} from '@heroicons/react/24/outline'; // Outline for action icons

// Corrected import path, assuming 'lib' is at the project root level
// relative to 'app/components' or 'src/components'
import { notifications as initialNotifications } from '../../components/lib/notificationData'; // Import mock data
import Image from 'next/image';

// NotificationPage now accepts an onBackClick prop
const NotificationPage = ({ onBackClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allNotifications, setAllNotifications] = useState(initialNotifications); // Use state to manage notifications for deletion/read status

  const now = useMemo(() => new Date(), []); // Memoize current time for grouping calculations

  const getRelativeTime = (timestamp) => {
    const notificationDate = new Date(timestamp);
    const diffMinutes = Math.round((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    const diffHours = Math.round(diffMinutes / 60);

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      // For simplicity, just return a formatted date for older items.
      // In a real app, you might differentiate days more clearly.
      return notificationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Group and filter notifications
  const groupedNotifications = useMemo(() => {
    const filtered = allNotifications.filter(notif =>
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const today = [];
    const yesterday = [];
    const older = [];

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    filtered.forEach(notif => {
      const notifDate = new Date(notif.timestamp);
      if (notifDate >= startOfToday) {
        today.push(notif);
      } else if (notifDate >= startOfYesterday) {
        yesterday.push(notif);
      } else {
        older.push(notif); // Or discard if only showing today/yesterday
      }
    });

    return { today, yesterday, older };
  }, [allNotifications, searchTerm, now]);

  const handleDeleteNotification = (id) => {
    setAllNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleToggleReadStatus = (id) => {
    setAllNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
      )
    );
  };

  const NotificationItem = ({ notification }) => {
    const statusClasses = notification.isRead
      ? 'text-[#B0B0B0]' // Read notifications can be slightly faded
      : 'text-white'; // Unread notifications stand out

    return (
    <div className='p-5'>
      <div className={`flex items-center justify-between   ${notification.isRead ? '' : ''} last:border-b-0 transition-colors duration-200`}>
        <div className="flex-grow">
          <p className={`text-base font-semibold ${statusClasses}`}>{notification.title}</p>
          <p className={`text-sm ${statusClasses}`}>{notification.description}</p>
        </div>
        <div className="flex items-center space-x-4 ml-4">
          <span className="text-xs text-[#B0B0B0] whitespace-nowrap">
            {getRelativeTime(notification.timestamp)}
          </span>
          <div className="flex space-x-2">
            {/* Mark as Read/Unread Icon */}
            <button
              onClick={() => handleToggleReadStatus(notification.id)}
              className={`${notification.isRead ? 'text-blue-400' : 'text-purple-600'} hover:opacity-75 p-1 rounded-full transition-opacity duration-200`}
              aria-label={notification.isRead ? 'Mark as unread' : 'Mark as read'}
            >
              {notification.isRead ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            {/* Delete Icon */}
            <button
              onClick={() => handleDeleteNotification(notification.id)}
              className="text-[#FF0000] hover:text-red-400 p-1 rounded-full transition-colors duration-200"
              aria-label="Delete notification"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="bg-[#343434] rounded-2xl text-white p-6 sm:p-6 lg:p-8 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {/* Back button now calls onBackClick prop */}
          <button
            className="text-[#FFFFFF] bg-[#FFFFFF1A] rounded-[33px] p-[10px] hover:text-white transition-colors duration-200"
            onClick={onBackClick} // Add onClick handler
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-[24px]  font-medium">Notification</h1>
        </div>
        <div className="flex items-center">
          <div className="relative   ">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A]  text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
         <button className=" hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  d="M11 8.5L20 8.5"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M4 16.5L14 16.5"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <ellipse
                  cx="7"
                  cy="8.5"
                  rx="3"
                  ry="3"
                  transform="rotate(90 7 8.5)"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <ellipse
                  cx="17"
                  cy="16.5"
                  rx="3"
                  ry="3"
                  transform="rotate(90 17 16.5)"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
        </div>
      </div>

      {/* Notification List Container */}
      <div className="rounded-lg overflow-hidden ">
        {groupedNotifications.today.length > 0 && (
          <div className="py-2"> {/* Removed px-4 from here for full-width items */}
            <h2 className="text-lg font-semibold text-white px-4 py-4"> {/* Added padding for heading */}
              Today <span className="text-[#71F50C] bg-[#71F50C1A] rounded-full text-[12px] p-2 px-3 font-normal">{groupedNotifications.today.length}</span>
            </h2>
            {groupedNotifications.today.map(notif => (
              <div className='border border-[#FFFFFF4D] rounded  mt-2'>
                 <NotificationItem  key={notif.id} notification={notif} />
              </div>
            ))}
          </div>
        )}

        {groupedNotifications.yesterday.length > 0 && (
          <div className="py-2 "> {/* Changed from border-b to border-t for section separation */}
            <h2 className="text-lg font-semibold text-white px-4 py-4"> {/* Added padding for heading */}
              Yesterday <span className="text-[#71F50C] bg-[#71F50C1A] rounded-full text-[12px] p-2 px-3 font-normal">{groupedNotifications.yesterday.length}</span>
            </h2>
            {groupedNotifications.yesterday.map(notif => (
              <div className='border border-[#FFFFFF4D] rounded mt-2'>
                <NotificationItem key={notif.id} notification={notif} />
              </div>
            ))}
          </div>
        )}

        {/* You can add an "Older" section if you want to display them, otherwise, they are filtered out implicitly by the grouping */}
        {groupedNotifications.older.length > 0 && (
          <div className="py-2 "> {/* Added border-t for section separation */}
            <h2 className="text-lg font-semibold text-white px-4 py-4"> {/* Added padding for heading */}
              Older <span className="text-[#71F50C] bg-[#71F50C1A] rounded-full text-[12px] p-2 px-3 font-normal">{groupedNotifications.older.length}</span>
            </h2>
            {groupedNotifications.older.map(notif => (
            <div className='border border-[#FFFFFF4D] rounded mt-2'>
                  <NotificationItem key={notif.id} notification={notif} />
            </div>
            ))}
          </div>
        )}

        {groupedNotifications.today.length === 0 &&
          groupedNotifications.yesterday.length === 0 &&
          groupedNotifications.older.length === 0 && (
          <p className="p-4 text-center text-[#B0B0B0]">No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;