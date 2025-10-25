'use client';

import { useState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './admin.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import NotificationPage from '@/components/Notification/NotificationPage';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

    // State to control whether NotificationPage is shown
  const [showNotifications, setShowNotifications] = useState(false);

  // Function to toggle notification page visibility
  const handleBellClick = () => {
    setShowNotifications(true);
  };

  // Function to go back from NotificationPage (e.g., from the back arrow)
  const handleGoBack = () => {
    setShowNotifications(false);
  };




  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Toaster 
          position="top"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#4CAF50',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#F44336',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="flex bg-black text-white min-h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

          <main
            className={`transition-all duration-300 ease-in-out flex-1 flex flex-col ${
              isOpen ? 'ml-64' : 'ml-0'
            }`}
          >
         {/* Topbar always visible */}
      <Topbar onBellClick={handleBellClick} />

      

      {/* Conditionally render NotificationPage or MainContent */}
      {showNotifications ? (
        <div className='p-6'>
          <NotificationPage onBackClick={handleGoBack} />
        </div> // Pass handler to NotificationPage
      ) : (
        <div className="p-4">{children}</div>
      )}
            
          </main>
        </div>
      </body>
    </html>
  );
}
