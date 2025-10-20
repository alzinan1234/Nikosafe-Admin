// components/SupportDetailsModal.js
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline"; // For the close button
import Image from "next/image";

const SupportDetailsModal = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  return (
    // The backdrop div:
    // - fixed inset-0: Covers the entire viewport
    // - bg-black bg-opacity-75: Creates a semi-transparent black overlay
    // - flex items-center justify-center: Centers the modal content
    // - z-50: Ensures the modal is on top of other content
    // - p-4: Adds some padding to prevent content from touching edges on small screens
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* The modal content div: */}
      {/* - bg-[#343434] border border-[#404040] rounded-lg shadow-xl: Your existing styling for the modal card */}
      {/* - w-full max-w-2xl mx-auto p-6 relative: Responsive width and centering */}
      <div className="bg-[#343434] border border-[#404040] w-[1120px] rounded-lg shadow-xl  mx-auto p-6 relative ">
         <div className="flex gap-6 items-center mb-6 ">
           <button
            onClick={onClose}
            className="text-[#B0B0B0] hover:text-white transition-colors duration-200  rounded-full p-[10px] py-[12px] bg-[#00C1C91A]"
            aria-label="Close"
          >
           <Image src="/icon/elements.svg" alt="Elements Icon" width={24} height={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">Support Details</h2>
         
        </div>
       <div className="px-20 py-[20px]">
         {/* Header with Close Button */}
       

        {/* User Info (from second screenshot) */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border border-[#404040]">
            <img
              src={ticket.avatar || "/avatars/user-avatar.png"} // Fallback avatar
              alt={ticket.submittedBy}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-white text-lg font-medium mb-1">
            Submitted By: {ticket.submittedBy}
          </p>
          <p className="text-[#B0B0B0] text-sm">
            Date Submitted: {ticket.dateSubmitted}
          </p>
          {/* Action icons below avatar in details page */}
          <div className="flex space-x-3 mt-4">
          
          
            <button className="p-2  rounded-full bg-[#F4B5491A] border border-[#F4B549] text-white flex items-center justify-center">
                 <Image  src="/icon/Union.svg" alt="Elements Icon" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Issue Title */}
        <div className="mb-6">
          <label className="block text-[#B0B0B0] text-sm mb-2">
            Issue Title
          </label>
          <input
            type="text"
            className="w-full p-3  border border-[#929292] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9155F7]"
            value={ticket.title}
            readOnly
          />
        </div>

        {/* User Description */}
        <div className="mb-6">
          <label className="block text-[#B0B0B0] text-sm mb-2">
            User Description
          </label>
          <textarea
            className="w-full p-3  border border-[#929292] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9155F7] min-h-[120px]"
            value={ticket.issueDescription}
            readOnly
          ></textarea>
        </div>

        {/* You can add more details here if needed */}
      </div>
       </div>
    </div>
  );
};

export default SupportDetailsModal;