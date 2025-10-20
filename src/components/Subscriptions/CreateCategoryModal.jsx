// import React, { useState } from 'react';
// import ModalWrapper from './ModalWrapper';

// export default function CreateCategoryModal({ onClose }) {
//   const [categoryName, setCategoryName] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here (e.g., create a new category)
//     console.log("New Category Name:", categoryName);
//     onClose(); // Close modal after submission
//   };

//   return (
//     <ModalWrapper title="Create Category" onClose={onClose}>
//       <form onSubmit={handleSubmit} className="space-y-4 px-10">
//         <div>
          
//           <input
//             type="text"
//             id="newCategoryName"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             className="shadow appearance-none border  rounded w-full py-2 px-3 border-[#929292] text-white leading-tight focus:outline-none focus:shadow-outline"
//             placeholder="Enter new category name"
//             required
//           />
//         </div>

//        <div className="col-span-full mt-16">
//               <button
//             type="submit"
//             className="w-full mx-auto flex justify-center items-center  rounded-full bg-cyan-400 hover:bg-cyan-300 text-white py-2 font-medium  border-b-4 border-lime-400"
//           >
//             Save
//           </button>
//           </div>
//       </form>
//     </ModalWrapper>
//   );
// }