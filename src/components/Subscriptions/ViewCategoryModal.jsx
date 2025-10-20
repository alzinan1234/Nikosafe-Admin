import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';

export default function ViewCategoryModal({ onClose }) {
  const [categoryName, setCategoryName] = useState('Annual Membership'); // Example pre-filled category

  const handleSave = () => {
    // Handle save logic for category name
    console.log("Category Name Saved:", categoryName);
    onClose();
  };

  return (
    <ModalWrapper title="View Category" onClose={onClose}>
      <div className="space-y-4 px-10">
        <div>
       
          <div className="flex items-center">
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="shadow appearance-none border border-[#929292] rounded w-full py-2 px-3  text-white leading-tight focus:outline-none focus:shadow-outline mr-2"
              placeholder="e.g., Annual Membership"
            />
            <button
              onClick={() => alert("Edit functionality for category name")} // Placeholder for edit action
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
          </div>
        </div>

        <div className="col-span-full mt-16">
              <button
            type="submit"
            className="w-full mx-auto flex justify-center items-center  rounded-full bg-cyan-400 hover:bg-cyan-300 text-white py-2 font-medium  border-b-4 border-lime-400"
          >
            Save
          </button>
          </div>
      </div>
    </ModalWrapper>
  );
}