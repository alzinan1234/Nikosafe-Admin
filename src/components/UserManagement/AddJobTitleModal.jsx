'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react'; // Using Lucide for icons
import Image from 'next/image'; // Assuming you might use Image component

export default function AddJobTitleModal({ onClose, onSave }) {
  const [jobTitle, setJobTitle] = useState('');

  const handleSave = () => {
    if (jobTitle.trim()) {
      onSave(jobTitle.trim());
      setJobTitle(''); // Clear input after saving
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-[#343434] rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onClose} className="text-[#00C1C9] bg-[#00C1C91A] rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">Add Designations</h2>
        </div>

        {/* Form */}
        <div className="mb-6">
          <label htmlFor="jobTitle" className="block text-gray-400 text-sm font-bold mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            className="w-full  border border-[#C3C3C3] rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9]"
            placeholder="Enter job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleSave}
            className="bg-[#00C1C9] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-opacity w-full "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
