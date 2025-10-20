// // components/WithdrawalDetailsModal.js
// 'use client';

// import React from 'react';
// import Image from 'next/image'; // Import Image for avatar

// const getStatusClasses = (status) => {
//     switch (status) {
//         case 'Pending':
//             return 'text-orange-500';
//         case 'Approved':
//             return 'text-green-500';
//         case 'Rejected':
//             return 'text-red-500';
//         default:
//             return 'text-gray-500';
//     }
// };

// const WithdrawalDetailsModal = ({ isOpen, onClose, request }) => {
//     if (!isOpen || !request) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//             <div className="bg-[#343434] rounded-lg p-6 max-w-md w-full relative border border-[#404040]">
//                 {/* Close Button (X icon) */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-3 right-3 text-white hover:text-gray-400 p-1 rounded-full bg-[#2A2A2A]"
//                     aria-label="Close modal"
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
//                     </svg>
//                 </button>

//                 <h2 className="text-xl font-semibold text-white mb-4">Withdrawal Request Details - {request.id}</h2>

//                 <div className="space-y-2 text-white text-sm">
//                     <p className="flex items-center">
//                         <strong className="text-[#B0B0B0] mr-2">Submitted By:</strong>
//                         <div className="flex items-center">
//                             <Image
//                                 src={request.avatar}
//                                 alt="User Avatar"
//                                 width={24}
//                                 height={24}
//                                 className="rounded-full mr-2"
//                                 onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/24x24/CCCCCC/000000?text=NA'; }}
//                             />
//                             {request.submittedBy}
//                         </div>
//                     </p>
//                     <p><strong className="text-[#B0B0B0]">Account Type:</strong> {request.accountType}</p>
//                     <p><strong className="text-[#B0B0B0]">Date Submitted:</strong> {request.dateSubmitted}</p>
//                     <p><strong className="text-[#B0B0B0]">Amount:</strong> {request.amount}</p>
//                     <p><strong className="text-[#B0B0B0]">Payment Method:</strong> {request.paymentMethod}</p>
//                     <p>
//                         <strong className="text-[#B0B0B0]">Status:</strong>{' '}
//                         <span className={getStatusClasses(request.status)}>{request.status}</span>
//                     </p>
//                     <p><strong className="text-[#B0B0B0]">Description:</strong> {request.description}</p>
//                 </div>

//                 <div className="mt-6 flex justify-end gap-3">
//                     {request.status === 'Pending' && (
//                         <>
//                             <button
//                                 onClick={() => {
//                                     // Simulate approval logic
//                                     console.log(`Approving withdrawal request: ${request.id}`);
//                                     onClose(); // Close modal after action
//                                 }}
//                                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200"
//                             >
//                                 Approve
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     // Simulate rejection logic
//                                     console.log(`Rejecting withdrawal request: ${request.id}`);
//                                     onClose(); // Close modal after action
//                                 }}
//                                 className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
//                             >
//                                 Reject
//                             </button>
//                         </>
//                     )}
//                     <button
//                         onClick={onClose}
//                         className="bg-[#17787C] text-white px-4 py-2 rounded hover:bg-[#136164] transition-colors duration-200"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WithdrawalDetailsModal;
