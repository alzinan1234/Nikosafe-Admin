// // components/AlcoholConsumptionTrendChart.js
// "use client"; // Client component due to useState and chart rendering

// import React, { useState } from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area
// } from 'recharts';
// import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'; // For the arrow icon

// // Dummy data for the Alcohol Consumption Trend Line Chart
// const alcoholData = [
//   { name: 'Jan', consumption: 14000 },
//   { name: 'Feb', consumption: 13500 },
//   { name: 'Mar', consumption: 11000 },
//   { name: 'Apr', consumption: 12000 },
//   { name: 'May', consumption: 10500 },
//   { name: 'Jun', consumption: 11500 },
//   { name: 'Jul', consumption: 12500 },
//   { name: 'Aug', consumption: 11000 },
//   { name: 'Sep', consumption: 10000 },
//   { name: 'Oct', consumption: 12000 },
//   { name: 'Nov', consumption: 14500 },
//   { name: 'Dec', consumption: 13000 },
// ];

// const formatYAxisTick = (value) => {
//   if (value === 0) return '00k';
//   return `${value / 1000}k`;
// };

// export default function AlcoholConsumptionTrendChart() {
//   const [selectedYear, setSelectedYear] = useState('2024');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const years = ['2024', '2023', '2022']; // Example years

//   return (
//     <div className="w-full h-full p-2.5 bg-[#3F3F3F] bg-opacity-10 rounded-lg flex flex-col justify-start items-center gap-5">
//       <div className="w-full flex justify-between items-center">
//         <div className="flex-1 flex justify-between items-center">
//           <div className="text-white text-base font-medium font-['Roboto']">Alcohol Consumption Trend Line Chart:</div>
//           {/* Year Dropdown */}
//           <div className="relative ml-4 bg-[#292929] rounded-full">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-2 px-3 py-1  bg-opacity-10 rounded-full text-white text-sm font-semibold font-['DM Sans']"
//             >
//               <span>{selectedYear}</span>
//               {isDropdownOpen ? (
//                 <ChevronUpIcon className="w-4 h-4 bg-[#3F3F3F] rounded-full" />
//               ) : (
//                 <ChevronDownIcon className="w-4 h-4 bg-[#3F3F3F] rounded-full" />
//               )}
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-24 bg-gray-700 rounded-md shadow-lg z-10">
//                 {years.map((year) => (
//                   <button
//                     key={year}
//                     onClick={() => {
//                       setSelectedYear(year);
//                       setIsDropdownOpen(false);
//                     }}
//                     className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600 text-sm"
//                   >
//                     {year}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="w-full h-56"> {/* Fixed height for the chart */}
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart
//             data={alcoholData}
//             margin={{
//               top: 10, right: 10, left: 0, bottom: 0,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#555" /> {/* Horizontal lines only */}
//             <XAxis
//               dataKey="name"
//               stroke="#ccc"
//               tick={{ fill: 'white', fontSize: 12, fontFamily: 'Roboto', fontWeight: 400 }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <YAxis
//               stroke="#ccc"
//               tickFormatter={formatYAxisTick}
//               tick={{ fill: 'white', fontSize: 12, fontFamily: 'Roboto', fontWeight: 400 }}
//               axisLine={false}
//               tickLine={false}
//               domain={[0, 15000]} // Set domain to match image
//             />
//             <Tooltip
//               cursor={{ stroke: '#ADB7F9', strokeWidth: 2 }} // Line for tooltip
//               contentStyle={{ background: '#333', border: 'none', borderRadius: '5px' }}
//               labelStyle={{ color: 'white' }}
//               itemStyle={{ color: '#ADB7F9' }}
//               formatter={(value) => [`${value.toLocaleString()}k`, 'Consumption']}
//             />
//             <Area
//               type="monotone"
//               dataKey="consumption"
//               stroke="#ADB7F9"
//               fill="url(#alcoholGradient)"
//               strokeWidth={2}
//             />
//             <defs>
//               <linearGradient id="alcoholGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#ADB7F9" stopOpacity={1} />
//                 <stop offset="100%" stopColor="rgba(177, 185, 248, 0)" stopOpacity={0} />
//               </linearGradient>
//             </defs>
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }