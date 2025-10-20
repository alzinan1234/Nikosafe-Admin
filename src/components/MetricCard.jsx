// components/MetricCard.js
"use client";

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';

export default function MetricCard({ title, value, percentageChange, percentageDirection = 'up', timePeriodData }) {
  const [selectedPeriod, setSelectedPeriod] = useState('January'); // Default value
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Determine icon based on percentageDirection
  const ChangeIcon = percentageDirection === 'up' ? ChevronUpIcon : ChevronDownIcon;
  const changeColor = percentageDirection === 'up' ? 'text-green-500' : 'text-red-500';
  const changeBg = percentageDirection === 'up' ? 'bg-green-500/10' : 'bg-red-500/10';

  return (
    <div className="w-full h-full bg-[#3F3F3F] p-4  bg-opacity-10 rounded-lg flex flex-col justify-between">
      {/* Header with Title and Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-base font-medium font-['Roboto']">{title}</h3>
        <div className="relative bg-[#292929] rounded-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 px-2 py-1  bg-opacity-10 rounded-full text-white text-sm font-semibold font-['DM Sans']"
          >
            <span>{selectedPeriod}</span>
            {isDropdownOpen ? (
              <ChevronUpIcon className="w-4 h-4 bg-[#3F3F3F] rounded-full" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 bg-[#3F3F3F] rounded-full" />
            )}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg z-10">
              {timePeriodData.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setIsDropdownOpen(false);
                    // In a real app, you'd trigger data fetching here
                    // onPeriodChange(period);
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600 text-sm"
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="text-white text-4xl font-bold font-['Roboto'] mb-2">
        {value.toLocaleString()}
      </div>

      {/* Percentage Change */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-1.5 py-0.5 ${changeBg} rounded-3xl`}>
          <ChangeIcon className={`w-3 h-3 ${changeColor}`} />
          <div className={`text-sm font-semibold font-['DM Sans'] ${changeColor}`}>
            {percentageChange}%
          </div>
        </div>
        <span className="text-gray-400 text-sm font-normal font-['Roboto']">From the last month</span>
      </div>
    </div>
  );
}