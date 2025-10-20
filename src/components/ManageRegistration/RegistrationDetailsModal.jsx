// // components/RegistrationDetailsModal.js
// import React from 'react';
// import { XMarkIcon } from '@heroicons/react/24/outline'; // For the close button
// import Image from 'next/image';

// const RegistrationDetailsModal = ({ isOpen, onClose, registration }) => {
//     if (!isOpen || !registration) return null;

//     const trainer = registration.trainerDetails; // Assuming trainerDetails is nested

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50  py-10 p-6">
//             <div className="bg-[#343434] border border-[#404040] rounded-lg shadow-xl w-full max-w-6xl  mx-auto p-6 relative text-white">
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-[#B0B0B0] hover:text-white transition-colors duration-200"
//                     aria-label="Close"
//                 >
//                     <XMarkIcon className="h-6 w-6" />
//                 </button>

//                 <div className="flex flex-col items-center mb-6">
//                     <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border border-[#404040]">
//                         <img
//                             src={trainer.avatar || "/avatars/user-avatar.png"} // Fallback avatar
//                             alt={trainer.name}
//                             className="w-full h-full object-cover"
//                         />
//                     </div>
//                     <h2 className="text-xl font-semibold mb-4">{trainer.name}</h2> {/* Trainer Name */}
//                 </div>

//                 <div className="space-y-4 text-sm">
//                     {/* Email Address */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Email Address:</label>
//                         <input
//                             type="text"
//                             value={trainer.email}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white"
//                         />
//                     </div>

//                     {/* Trainer ID */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Trainer ID:</label>
//                         <input
//                             type="text"
//                             value={trainer.id}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white"
//                         />
//                     </div>

//                     {/* Years of Experience */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Years of Experience:</label>
//                         <input
//                             type="text"
//                             value={trainer.yearsOfExperience}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white"
//                         />
//                     </div>

//                     {/* Per Hour Rate */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Per Hour Rate:</label>
//                         <input
//                             type="text"
//                             value={`$${trainer.perHourRate}`}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white"
//                         />
//                     </div>

//                     {/* Coaching Expertise */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Coaching Expertise:</label>
//                         <input
//                             type="text"
//                             value={trainer.coachingExpertise}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white"
//                         />
//                     </div>

//                     {/* Bio */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Bio:</label>
//                         <textarea
//                             value={trainer.bio}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white min-h-[100px]"
//                         ></textarea>
//                     </div>

//                     {/* Achievements */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Achievements:</label>
//                         <ul className="list-disc list-inside bg-[#2A2A2A] border border-[#404040] rounded p-2">
//                             {trainer.achievements.map((achievement, index) => (
//                                 <li key={index} className="text-white text-sm">{achievement}</li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* Location */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Location:</label>
//                         <input
//                             type="text"
//                             value={trainer.location}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white"
//                         />
//                     </div>

//                     {/* Preferred Training Locations */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Preferred Training Locations:</label>
//                         <input
//                             type="text"
//                             value={trainer.preferredTrainingLocations.join(', ')}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white"
//                         />
//                     </div>

//                      {/* Availability */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Availability (Date):</label>
//                         <input
//                             type="text"
//                             value={trainer.availability}
//                             readOnly
//                             className="w-full p-2 bg-[#2A2A2A] border border-[#404040] rounded text-white"
//                         />
//                     </div>

//                     {/* Time Slots */}
//                     <div>
//                         <label className="block text-[#B0B0B0] mb-1">Time slots:</label>
//                         <ul className="list-disc list-inside bg-[#2A2A2A] border border-[#404040] rounded p-2">
//                             {trainer.timeSlots.map((slot, index) => (
//                                 <li key={index} className="text-white text-sm">{slot}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RegistrationDetailsModal;

