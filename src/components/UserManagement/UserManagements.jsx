'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ArrowLeft, Plus, Edit2, Trash2, Loader2, X, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import userManageService from '@/lib/userManageService';

// ViewUserModal Component
function ViewUserModal({ user, onClose }) {
  if (!user) return null;

  const userData = user.data || user;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
      <div className="bg-[#242424] rounded-lg shadow-xl w-full max-w-2xl mx-auto p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#242424] pb-4">
          <h2 className="text-xl font-semibold text-white">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 p-4 bg-[#343434] rounded-lg">
            <img
              src={userData.profile_details?.avatar || "https://placehold.co/80x80/cccccc/000000?text=User"}
              alt="avatar"
              className="w-20 h-20 rounded-full"
              onError={(e) => { e.target.src="https://placehold.co/80x80/cccccc/000000?text=User" }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">{userData.full_name || 'N/A'}</h3>
              <p className="text-gray-400">{userData.user_type?.type || 'N/A'}</p>
              {userData.user_type?.designation && (
                <p className="text-sm text-[#00C1C9]">{userData.user_type.designation}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {userData.account_status?.map((status, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status === 'Blocked' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500' 
                      : status === 'Verified'
                      ? 'bg-green-500/20 text-green-400 border border-green-500'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500'
                  }`}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-[#343434] rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <User size={20} className="text-[#00C1C9]" />
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-300">{userData.email || 'N/A'}</span>
              </div>
              {userData.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-300">{userData.phone_number}</span>
                </div>
              )}
              {userData.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-300">{userData.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          {userData.profile_details && (
            <div className="bg-[#343434] rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Profile Details</h4>
              <div className="grid grid-cols-2 gap-4">
                {userData.profile_details.age && (
                  <div>
                    <p className="text-gray-400 text-sm">Age</p>
                    <p className="text-white">{userData.profile_details.age} years</p>
                  </div>
                )}
                {userData.profile_details.weight && (
                  <div>
                    <p className="text-gray-400 text-sm">Weight</p>
                    <p className="text-white">{userData.profile_details.weight} kg</p>
                  </div>
                )}
                {userData.profile_details.sex && (
                  <div>
                    <p className="text-gray-400 text-sm">Gender</p>
                    <p className="text-white capitalize">{userData.profile_details.sex}</p>
                  </div>
                )}
                {userData.profile_details.created_at && (
                  <div>
                    <p className="text-gray-400 text-sm">Profile Created</p>
                    <p className="text-white">{new Date(userData.profile_details.created_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="bg-[#343434] rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Shield size={20} className="text-[#00C1C9]" />
              Account Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">User ID</p>
                <p className="text-white">{userData.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className={`font-medium ${userData.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {userData.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Blocked</p>
                <p className={`font-medium ${userData.is_blocked ? 'text-red-400' : 'text-green-400'}`}>
                  {userData.is_blocked ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Verified</p>
                <p className={`font-medium ${userData.is_verified ? 'text-green-400' : 'text-gray-400'}`}>
                  {userData.is_verified ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Registration Date</p>
                <p className="text-white">
                  {userData.registration_date 
                    ? new Date(userData.registration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'N/A'
                  }
                </p>
              </div>
              {userData.last_login_date && (
                <div>
                  <p className="text-gray-400 text-sm">Last Login</p>
                  <p className="text-white">
                    {new Date(userData.last_login_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#00C1C9] text-white rounded-lg hover:bg-opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// AddJobTitleModal Component
function AddJobTitleModal({ onClose, onSave, initialJobTitle = '', designationId = null }) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (jobTitle.trim()) {
      setLoading(true);
      try {
        if (designationId) {
          await userManageService.updateDesignation(designationId, jobTitle.trim());
        } else {
          await userManageService.createDesignation(jobTitle.trim());
        }
        onSave();
        setJobTitle('');
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
      <div className="bg-[#343434] rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onClose} className="text-[#00C1C9] bg-[#00C1C91A] rounded p-[10px] rounded-full hover:text-gray-300 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">{designationId ? 'Edit Designation' : 'Add Designation'}</h2>
        </div>

        <div className="mb-6">
          <label htmlFor="jobTitle" className="block text-white text-sm font-bold mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            className="w-full border border-[#C3C3C3] rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] bg-[#242424]"
            placeholder="Enter job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading || !jobTitle.trim()}
            className="bg-[#00C1C9] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-opacity w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ServiceProviderJobTitlesModal Component
function ServiceProviderJobTitlesModal({ onClose }) {
  const [jobTitles, setJobTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddJobTitleModal, setShowAddJobTitleModal] = useState(false);
  const [editingJobTitle, setEditingJobTitle] = useState(null);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await userManageService.getDesignations();
      setJobTitles(response.data?.results || response.results || []);
    } catch (error) {
      console.error('Error fetching designations:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateJobTitle = async () => {
    setShowAddJobTitleModal(false);
    setEditingJobTitle(null);
    await fetchDesignations();
  };

  const handleEditClick = (jobTitle) => {
    setEditingJobTitle(jobTitle);
    setShowAddJobTitleModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this job title?')) {
      try {
        await userManageService.deleteDesignation(id);
        await fetchDesignations();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-40 p-4">
        <div className="bg-[#242424] rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative">
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

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 size={32} className="animate-spin text-[#00C1C9]" />
              </div>
            ) : jobTitles.length === 0 ? (
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

      {showAddJobTitleModal && (
        <AddJobTitleModal
          onClose={() => setShowAddJobTitleModal(false)}
          onSave={handleAddOrUpdateJobTitle}
          initialJobTitle={editingJobTitle ? editingJobTitle.title : ''}
          designationId={editingJobTitle ? editingJobTitle.id : null}
        />
      )}
    </>
  );
}

// Main UserManagement Component
const UserManagement = () => {
  const [showJobTitlesModal, setShowJobTitlesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [localAllUsers, setLocalAllUsers] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const itemsPerPage = 10;

  // Debounce search input to avoid spamming the API while typing
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Fetch users when page or debounced search changes (skip when API marked down)
  useEffect(() => {
    if (apiError) return; // don't call API while in offline/fallback mode
    fetchUsers();
  }, [currentPage, debouncedSearch, apiError]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Use the debounced search term when calling the service
      const params = {
        page: currentPage,
        search: debouncedSearch || undefined,
      };
      console.debug('Fetching users with params:', params);
      const response = await userManageService.getAllUsers(params);

      const userData = response.data || response;
      const results = userData.results || [];

      // Cache last good result for client-side filtering when API fails
      setLocalAllUsers(results);

      setCurrentUsers(results);
      setTotalCount(userData.count || results.length || 0);
      setTotalPages(Math.ceil((userData.count || results.length || 0) / itemsPerPage));
      setApiError(false);
      setApiErrorMessage('');
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mark API as down and fall back to client-side cached results
      setApiError(true);
      setApiErrorMessage(error.message || 'An unexpected error occurred.');

      if (localAllUsers.length > 0) {
        // show filtered / cached results
        const q = (debouncedSearch || '').toLowerCase().trim();
        const filtered = q
          ? localAllUsers.filter(u => ((u.name || u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || String(u.user_id || u.id || '').includes(q)))
          : localAllUsers;

        setCurrentUsers(filtered.slice(0, itemsPerPage));
        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      } else {
        // no cached data
        alert(`Error: ${error.message}`);
        setCurrentUsers([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  };

  // Retry handler (clears error and attempts to fetch again)
  const handleRetry = () => {
    setApiError(false);
    setApiErrorMessage('');
    fetchUsers();
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      if (isBlocked === true) {
        await userManageService.unblockUser(userId);
      } else {
        await userManageService.blockUser(userId, 'Violation of terms and conditions');
      }
      await fetchUsers();
    } catch (error) {
      console.error('Block/Unblock error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const userDetails = await userManageService.getUserDetails(userId);
      setSelectedUser(userDetails);
      setShowUserModal(true);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push('...');
      if (currentPage > 2) pageNumbers.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPages) pageNumbers.push(currentPage);
      if (currentPage < totalPages - 1) pageNumbers.push(currentPage + 1);
      if (currentPage < totalPages - 2) pageNumbers.push('...');
      pageNumbers.push(totalPages);
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJobTitlesModal(true)}
              className="border border-[#00C1C9] text-[12px] font-normal px-4 py-1 rounded-full bg-[#00C1C91A] text-white hover:bg-teal-900 transition-colors"
            >
              Manage Service provider job titles
            </button>
            <div className="flex items-center">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[7px] rounded-tr-[7.04px] rounded-br-[7.04px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path d="M11 8.5L20 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 16.5L14 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <ellipse cx="7" cy="8.5" rx="3" ry="3" transform="rotate(90 7 8.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <ellipse cx="17" cy="16.5" rx="3" ry="3" transform="rotate(90 17 16.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
          {/* (API error banner removed) */}

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
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <Loader2 size={32} className="animate-spin text-[#00C1C9] mx-auto" />
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-400 border-b border-gray-600">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id || user.user_id} className="text-sm text-white">
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      {user.user_id || user.id}
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      <div className="flex justify-center items-center gap-2">
                        <img
                          src={user.avatar || "https://placehold.co/24x24/cccccc/000000?text=A"}
                          alt="avatar"
                          width={24}
                          height={24}
                          className="rounded-full"
                          onError={(e) => { e.target.src="https://placehold.co/24x24/cccccc/000000?text=A" }}
                        />
                        {user.name || user.full_name || 'N/A'}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      {user.email}
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      {user.registration_date ? new Date(user.registration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewUser(user.id || user.user_id)}
                          className="px-3 py-1 text-xs border border-[#C267FF] text-[#C267FF] bg-[#0053B21A] rounded-full cursor-pointer hover:opacity-80"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleBlockToggle(user.id || user.user_id, user.is_blocked)}
                          disabled={actionLoading[user.id || user.user_id]}
                          className={`px-3 py-1 text-xs border rounded-full cursor-pointer hover:opacity-80 disabled:opacity-50 flex items-center gap-1 ${
                            user.is_blocked === true
                              ? 'bg-[#B200001A] border-[#FF0000] text-[#FF0000]'
                              : 'bg-green-600/10 border-green-600 text-green-400'
                          }`}
                        >
                          {actionLoading[user.id || user.user_id] && <Loader2 size={12} className="animate-spin" />}
                          {user.is_blocked === true ? 'Unblock' : 'Block'}
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

      <div className="flex justify-end items-center mt-6 gap-2 text-sm text-white">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-[#1f1f1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1" stroke="#E2E2E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-[#1f1f1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {showJobTitlesModal && (
        <ServiceProviderJobTitlesModal onClose={() => setShowJobTitlesModal(false)} />
      )}

      {showUserModal && selectedUser && (
        <ViewUserModal user={selectedUser} onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }} />
      )}
    </>
  );
};

export default UserManagement;