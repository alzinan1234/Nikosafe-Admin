'use client';

import React, { useState, useMemo } from 'react'; // Added useMemo for performance
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Importing from heroicons
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react'; // Using Lucide for icons

// Mock user data (now includes a status for blocking)
const initialUsers = new Array(35).fill(null).map((_, i) => ({ // Increased users for pagination demo
  id: `user-${i + 1}`,
  name: `Robo Gladiator ${i + 1}`,
  email: `robo${i + 1}@gmail.com`,
  date: `March ${15 + (i % 31)}, 2024`, // Varying date
  avatar: 'https://placehold.co/24x24/cccccc/000000?text=A', // Using a placeholder image URL
  status: 'active', // 'active' or 'blocked'
}));

// AddJobTitleModal Component (moved here for self-containment)
function AddJobTitleModal({ onClose, onSave, initialJobTitle = '' }) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);

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
          <button onClick={onClose} className="text-[#00C1C9] bg-[#00C1C91A] rounded p-[10px] rounded-full hover:text-gray-300 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">{initialJobTitle ? 'Edit Job Title' : 'Add Designation'}</h2>
        </div>

        {/* Form */}
        <div className="mb-6">
          <label htmlFor="jobTitle" className="block text-white text-sm font-bold mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            className="w-full border border-[#C3C3C3] rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] bg-[#242424]" // Added bg color
            placeholder="Enter job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="bg-[#00C1C9] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-opacity w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ServiceProviderJobTitlesModal Component (moved here for self-containment)
function ServiceProviderJobTitlesModal({ onClose }) {
  const [jobTitles, setJobTitles] = useState([
    { id: 1, title: 'Plumber' },
    { id: 2, title: 'Electrician' },
    { id: 3, title: 'Carpenter' },
  ]);
  const [showAddJobTitleModal, setShowAddJobTitleModal] = useState(false);
  const [editingJobTitle, setEditingJobTitle] = useState(null); // State to hold job title being edited

  const handleAddJobTitle = (newTitle) => {
    if (editingJobTitle) {
      // If editing, update the existing job title
      setJobTitles(jobTitles.map(jt => jt.id === editingJobTitle.id ? { ...jt, title: newTitle } : jt));
      setEditingJobTitle(null); // Clear editing state
    } else {
      // Otherwise, add a new job title
      setJobTitles([...jobTitles, { id: Date.now(), title: newTitle }]);
    }
    setShowAddJobTitleModal(false);
  };

  const handleEditClick = (jobTitle) => {
    setEditingJobTitle(jobTitle);
    setShowAddJobTitleModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this job title?')) {
      setJobTitles(jobTitles.filter(jt => jt.id !== id));
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-40 p-4">
        <div className="bg-[#242424] rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="text-[#00C1C9] bg-[#00C1C91A] rounded-full p-[10px] hover:text-gray-300 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-[16px] font-semibold text-white">Service provider Designations</h2>
            </div>
            <button
              onClick={() => { setEditingJobTitle(null); setShowAddJobTitleModal(true); }}
              className="flex items-center gap-1 border border-[#00C1C9] text-[12px] font-normal px-4 py-1 rounded-full bg-[#00C1C91A] text-white hover:bg-teal-900 transition-colors"
            >
              <Plus size={16} /> Add Designations
            </button>
          </div>

          {/* Job Titles List */}
          <div className="space-y-4">
            {jobTitles.length === 0 ? (
              <p className="text-gray-400 text-center">No job titles found.</p>
            ) : (
              jobTitles.map((jobTitle) => (
                <div
                  key={jobTitle.id}
                  className="flex justify-between items-center bg-[#343434] rounded-lg p-3 border border-gray-600"
                >
                  <span className="text-white text-base">{jobTitle.title}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditClick(jobTitle)}
                      className="text-[#C267FF] hover:text-[#a040ff] transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(jobTitle.id)}
                      className="text-[#FF0000] hover:text-[#cc0000] transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Conditionally render AddJobTitleModal */}
      {showAddJobTitleModal && (
        <AddJobTitleModal
          onClose={() => setShowAddJobTitleModal(false)}
          onSave={handleAddJobTitle}
          initialJobTitle={editingJobTitle ? editingJobTitle.title : ''} // Pass initial value for editing
        />
      )}
    </>
  );
}


// UserManagement Component (main component)
const UserManagement = () => {
  const [showJobTitlesModal, setShowJobTitlesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUsers, setCurrentUsers] = useState(initialUsers); // State to manage user data
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const itemsPerPage = 5; // Number of items per page

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return currentUsers;
    }
    return currentUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, currentUsers]);

  // Calculate users for the current page
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsersDisplayed = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle blocking/unblocking a user
  const handleBlockToggle = (userId) => {
    setCurrentUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
          : user
      )
    );
  };

  // Handle viewing user details - now logs to console instead of routing
  const handleViewUser = (userId) => {
    console.log(`Attempting to view details for user ID: ${userId}`);
    // For this isolated environment, direct client-side routing is not available.
    // You could implement a simple custom modal here to display user details if needed.
  };

  // Function to render page numbers dynamically
  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Always show first few pages, and last few pages, with "..." in between if many pages
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push('...');
      if (currentPage > 2) pageNumbers.push(currentPage - 1);
      pageNumbers.push(currentPage);
      if (currentPage < totalPages - 1) pageNumbers.push(currentPage + 1);
      if (currentPage < totalPages - 2) pageNumbers.push('...');
      if (currentPage !== totalPages) pageNumbers.push(totalPages);
    }

    return pageNumbers.map((num, index) => (
      num === '...' ? (
        <span key={index} className="px-2 text-gray-400">.....</span>
      ) : (
        <button 
          key={index}
          onClick={() => handlePageChange(num)}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
            currentPage === num ? 'bg-[#00C1C9] text-white' : 'hover:bg-[#1f1f1f] text-white'
          }`}
        >
          {num}
        </button>
      )
    ));
  };


  return (
    <>
      <div className="bg-[#343434] rounded-lg text-white p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJobTitlesModal(true)}
              className="border border-[#00C1C9] text-[12px] font-normal px-4 py-1 rounded-full bg-[#00C1C91A] text-white hover:bg-teal-900 transition-colors"
            >
              Manage Service provider job titles
            </button>
            <div className="flex items-center ">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
              {/* Filter button with SVG - now acts as a visual trigger for search */}
              <button
                onClick={() => setSearchTerm(searchTerm)} // Re-apply current search term (triggers memoized filter)
                className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[7px] rounded-tr-[7.04px] rounded-br-[7.04px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <path
                    d="M11 8.5L20 8.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 16.5L14 16.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="7"
                    cy="8.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 7 8.5)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="17"
                    cy="16.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 17 16.5)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#17787C]">
              <tr className="text-sm text-white">
                <th className="py-3 px-4 text-center">User ID</th>
                <th className="py-3 px-4 text-center">Name</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Registration Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsersDisplayed.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-400 border-b border-gray-600">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                currentUsersDisplayed.map((user) => (
                  <tr key={user.id} className="text-sm text-white">
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      {user.id}
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      <div className="flex justify-center items-center gap-2">
                        <img
                          src={user.avatar}
                          alt="avatar"
                          width={24}
                          height={24}
                          className="rounded-full"
                          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/24x24/cccccc/000000?text=A" }}
                        />
                        {user.name}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      {user.email}
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      {user.date}
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="px-3 py-1 text-xs border border-[#C267FF] text-[#C267FF] bg-[#0053B21A] rounded-full cursor-pointer hover:opacity-80"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleBlockToggle(user.id)}
                          className={`px-3 py-1 text-xs border rounded-full cursor-pointer hover:opacity-80 ${
                            user.status === 'blocked'
                              ? 'bg-[#B200001A] border-[#FF0000] text-[#FF0000]'
                              : 'bg-green-600/10 border-green-600 text-green-400' // Example active color
                          }`}
                        >
                          {user.status === 'blocked' ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm text-white">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center border rounded-full rounded hover:bg-[#1f1f1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
  <path d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1" stroke="#E2E2E2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center border rounded-full  hover:bg-[#1f1f1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
  <path d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13" stroke="#C8C8C8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </button>
      </div>

      {/* Service Provider Job Titles Modal */}
      {showJobTitlesModal && (
        <ServiceProviderJobTitlesModal onClose={() => setShowJobTitlesModal(false)} />
      )}
    </>
  );
};

export default UserManagement;
