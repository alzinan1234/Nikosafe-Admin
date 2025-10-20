// components/EarningSummaryChart.js
"use client"; // Client component due to useState and chart rendering

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'; // For the arrow icon

// Dummy data for the Earning Summary chart
const earningData = [
  { name: 'Jan', revenue: 11500 },
  { name: 'Feb', revenue: 13000 },
  { name: 'Mar', revenue: 10500 },
  { name: 'Apr', revenue: 9800 },
  { name: 'May', revenue: 10500 },
  { name: 'Jun', revenue: 11000 },
  { name: 'Jul', revenue: 13500 },
  { name: 'Aug', revenue: 11000 },
  { name: 'Sep', revenue: 10200 },
  { name: 'Oct', revenue: 10000 }, // Added Oct as per image
  { name: 'Nov', revenue: 10200 }, // Added Nov as per image
  { name: 'Dec', revenue: 10100 }, // Added Dec as per image
];

const formatYAxisTick = (value) => {
  if (value === 0) return '00k';
  return `${value / 1000}k`;
};

export default function EarningSummaryChart() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const years = ['2024', '2023', '2022']; // Example years

  return (
    <div className="w-full h-full p-2.5 bg-[#3F3F3F] bg-opacity-10 rounded-lg flex flex-col justify-start items-center gap-5">
      <div className="w-full flex justify-between items-center">

       <div className="text-white text-base font-medium font-['Roboto']">Earning Summary</div>

   
           
          
          <div className="flex justify-center items-center gap-1">
            <div className="text-white text-sm font-medium font-['DM Sans']">Yearly Revenue</div>
            <div className="flex justify-center items-center gap-1 px-1.5 py-0.5  bg-opacity-10 rounded-3xl bg-[#4BB54B1A]">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
                <path d="M0.314151 5.97416C0.182048 6.10626 0.182048 6.32044 0.314151 6.45255C0.446254 6.58465 0.660435 6.58465 0.792538 6.45255L0.314151 5.97416ZM3.88996 4.01155L3.67865 4.2757L3.88996 4.01155ZM4.8459 4.7763L4.63458 5.04045H4.63458L4.8459 4.7763ZM6.08361 4.67121L5.83079 4.44647L5.83079 4.44648L6.08361 4.67121ZM9.37569 1.47679C9.49981 1.33716 9.48723 1.12334 9.3476 0.999226C9.20797 0.875109 8.99416 0.887686 8.87004 1.02732L9.37569 1.47679ZM5.50019 5.14102L5.52881 5.47808H5.52881L5.50019 5.14102ZM3.26804 3.66123L3.28675 3.99898H3.28675L3.26804 3.66123ZM7.76978 0.462755C7.58296 0.462755 7.43151 0.614204 7.43151 0.801025C7.43151 0.987847 7.58296 1.1393 7.76978 1.1393V0.462755ZM9.23562 2.60514C9.23562 2.79196 9.38707 2.94341 9.57389 2.94341C9.76071 2.94341 9.91216 2.79196 9.91216 2.60514H9.23562ZM9.44179 0.933128L9.68098 0.693935V0.693935L9.44179 0.933128ZM1.90643 1.36481C1.71961 1.36481 1.56816 1.51626 1.56816 1.70308C1.56816 1.8899 1.71961 2.04135 1.90643 2.04135V1.36481ZM4.61259 2.04135C4.79941 2.04135 4.95086 1.8899 4.95086 1.70308C4.95086 1.51626 4.79941 1.36481 4.61259 1.36481V2.04135ZM0.553345 6.21335L0.792538 6.45255L2.9278 4.31729L2.68861 4.07809L2.44941 3.8389L0.314151 5.97416L0.553345 6.21335ZM3.88996 4.01155L3.67865 4.2757L4.63458 5.04045L4.8459 4.7763L5.05722 4.51216L4.10128 3.74741L3.88996 4.01155ZM6.08361 4.67121L6.33644 4.89594L9.37569 1.47679L9.12286 1.25205L8.87004 1.02732L5.83079 4.44647L6.08361 4.67121ZM4.8459 4.7763L4.63458 5.04045C4.78564 5.16129 4.92443 5.27321 5.04948 5.34882C5.18289 5.42949 5.34004 5.4941 5.52881 5.47808L5.50019 5.14102L5.47157 4.80396C5.47129 4.80398 5.47127 4.80397 5.47142 4.80398C5.47158 4.80398 5.47166 4.80399 5.47157 4.80398C5.47155 4.80398 5.46964 4.80378 5.46524 4.80244C5.4555 4.79948 5.43523 4.79147 5.39955 4.76989C5.32145 4.72267 5.22279 4.64461 5.05722 4.51216L4.8459 4.7763ZM6.08361 4.67121L5.83079 4.44648C5.68992 4.60495 5.60583 4.69852 5.53681 4.75824C5.50528 4.78552 5.48665 4.79683 5.47755 4.8014C5.47343 4.80346 5.47159 4.80397 5.47157 4.80398C5.47148 4.804 5.47156 4.80398 5.47171 4.80395C5.47186 4.80392 5.47185 4.80394 5.47157 4.80396L5.50019 5.14102L5.52881 5.47808C5.71757 5.46205 5.86158 5.37186 5.97947 5.26986C6.08999 5.17424 6.20793 5.04052 6.33644 4.89594L6.08361 4.67121ZM2.68861 4.07809L2.9278 4.31729C3.06993 4.17515 3.15418 4.09182 3.22245 4.03907C3.25354 4.01505 3.27167 4.00523 3.28055 4.00128C3.28459 3.99948 3.28644 3.99903 3.28657 3.999C3.2866 3.99899 3.28645 3.999 3.28675 3.99898L3.26804 3.66123L3.24933 3.32348C3.06867 3.33348 2.92694 3.41243 2.80879 3.50373C2.69825 3.58914 2.57884 3.70947 2.44941 3.8389L2.68861 4.07809ZM3.88996 4.01155L4.10128 3.74741C3.95836 3.63307 3.82638 3.52666 3.70709 3.45398C3.57958 3.37628 3.43 3.31347 3.24933 3.32348L3.26804 3.66123L3.28675 3.99898C3.28704 3.99896 3.2869 3.99897 3.28693 3.99898C3.28706 3.99899 3.28895 3.99924 3.29316 4.00058C3.30242 4.00352 3.32153 4.01129 3.35508 4.03173C3.42875 4.07661 3.52169 4.15013 3.67865 4.2757L3.88996 4.01155ZM7.76978 0.801025V1.1393H8.67184V0.801025V0.462755H7.76978V0.801025ZM9.57389 1.70308H9.23562V2.60514H9.57389H9.91216V1.70308H9.57389ZM8.67184 0.801025V1.1393C8.89402 1.1393 9.02662 1.14001 9.12166 1.15279C9.16521 1.15865 9.18703 1.16554 9.19685 1.16959C9.19912 1.17052 9.20062 1.17125 9.20149 1.17171C9.20235 1.17216 9.20273 1.17241 9.20277 1.17243C9.2028 1.17245 9.20269 1.17238 9.20254 1.17225C9.20238 1.17213 9.20239 1.17212 9.2026 1.17232L9.44179 0.933128L9.68098 0.693935C9.5416 0.554557 9.37214 0.50384 9.21181 0.482284C9.06121 0.462036 8.87489 0.462755 8.67184 0.462755V0.801025ZM9.57389 1.70308H9.91216C9.91216 1.50003 9.91288 1.31371 9.89263 1.16311C9.87108 1.00278 9.82036 0.833313 9.68098 0.693935L9.44179 0.933128L9.2026 1.17232C9.2028 1.17253 9.20279 1.17253 9.20266 1.17238C9.20254 1.17222 9.20247 1.17211 9.20249 1.17215C9.20251 1.17218 9.20276 1.17257 9.20321 1.17343C9.20367 1.1743 9.20439 1.17579 9.20533 1.17807C9.20937 1.18789 9.21627 1.2097 9.22213 1.25325C9.2349 1.3483 9.23562 1.4809 9.23562 1.70308H9.57389ZM1.90643 1.70308V2.04135H4.61259V1.70308V1.36481H1.90643V1.70308Z" fill="#4BB54B"/>
               </svg> {/* Replaced generic div with Heroicon */}
              <div className="text-green-500 text-sm font-semibold font-['DM Sans']">9%</div>
            </div>
          </div>
     
        {/* Year Dropdown */}
        <div className="relative ml-4 bg-[#292929] rounded-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1  bg-opacity-10  rounded-full text-white text-sm font-semibold font-['DM Sans']"
          >
            <span>{selectedYear}</span>
            {isDropdownOpen ? (
              <ChevronUpIcon  className="w-4 h-4 bg-[#3F3F3F] rounded-full" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 bg-[#3F3F3F] rounded-full" />
            )}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-gray-700 rounded-md shadow-lg z-10">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600 text-sm"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-56"> {/* Fixed height for the chart */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={earningData}
            margin={{
              top: 10, right: 10, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#555" /> {/* Horizontal lines only */}
            <XAxis
              dataKey="name"
              stroke="#ccc"
              tick={{ fill: 'white', fontSize: 13.71, fontFamily: 'Roboto', fontWeight: 400 }}
              axisLine={false} // Remove X-axis line
              tickLine={false} // Remove X-axis tick marks
            />
            <YAxis
              stroke="#ccc"
              tickFormatter={formatYAxisTick}
              tick={{ fill: 'white', fontSize: 12.56, fontFamily: 'Roboto', fontWeight: 400 }}
              axisLine={false} // Remove Y-axis line
              tickLine={false} // Remove Y-axis tick marks
              domain={[0, 15000]} // Set domain to match image
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              contentStyle={{ background: '#333', border: 'none', borderRadius: '5px' }}
              labelStyle={{ color: 'white' }}
              itemStyle={{ color: '#00C1C9' }}
              formatter={(value) => [`${value.toLocaleString()}k`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#00C1C9" barSize={45} radius={[5, 5, 0, 0]} /> {/* Rounded top corners */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}