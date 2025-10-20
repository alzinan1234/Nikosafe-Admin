"use client";

import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { registrationService } from '@/lib/registrationService';

// Assuming eyeIcon is correctly imported from local path
import eyeIcon from "../../../public/icon/eye.svg"; 

export default function ManageRegistration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  // Debounce the raw input to avoid calling the server on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch when the debounced term or page changes
  useEffect(() => {
    fetchRegistrations();
  }, [debouncedSearchTerm, currentPage]);

  const fetchRegistrations = async () => {
    setLoading(true);
    const trimmedSearch = debouncedSearchTerm;
    const pageToFetch = trimmedSearch ? 1 : currentPage;
    try {
      const result = await registrationService.getAllRegistrations({
        page: pageToFetch,
        search: trimmedSearch,
      });

      if (result.success) {
        const rows = result.data || [];
        setRegistrations(rows);
        // Apply an immediate client-side filter using the live searchTerm so the UI
        // feels responsive while the user types; server results are authoritative.
        setFilteredRows(filterByNameOrEmail(rows, searchTerm));
        setTotalCount(result.count || 0);
        setNextPage(result.next);
        setPreviousPage(result.previous);

        if (trimmedSearch && currentPage !== 1) {
          setCurrentPage(1);
        }
      } else {
        toast.error(result.error || 'Failed to load registrations');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering helper (fast, in-memory): matches by name or email
  const filterByNameOrEmail = (rows, term) => {
    const q = (term || '').trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = (r.name || r.full_name || '').toString().toLowerCase();
      const email = (r.email || r.user_email || '').toString().toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  };

  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearchTerm(v);
    // Instant client-side filter while the debounced server fetch is pending
    setFilteredRows((prevRows) => filterByNameOrEmail(registrations, v));
  };

  const handleView = (rowId) => {
    router.push(`/admin/manage-registrations/${rowId}`);
  };

  // NOTE: Removed handleDeleteClick and handleDeleteConfirm functions as per request (removed delete icon).
  const handleDeleteClick = (rowId) => {
      // Logic for the modal is no longer necessary, but keeping the function stub for structure
      setDeleteId(rowId);
      setDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
      // NOTE: The delete functionality is removed from the table view as requested.
  };
  // NOTE: Removed handleEdit function as per request (removed edit icon).
  const handleEdit = (rowId) => {
      // Logic for the edit redirect is no longer necessary, but keeping the function stub for structure
      router.push(`/admin/manage-registrations/${rowId}/edit`);
  };

  const handleFilterClick = () => {
    toast('Filter functionality coming soon!', { icon: '🔍' });
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Helper to format registration date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Assuming dateString is a valid format like ISO string or Date
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Helper to get type color (Original logic preserved)
  const getTypeColor = (type) => {
    switch (type) {
      case 'Hospitality Venue':
      case 'Vendor':
        return 'text-[#FF4D00]'; // Orange
      case 'Service Provider':
        return 'text-[#4976F4]'; // Blue
      case 'Basic User':
        return 'text-[#3CC668]'; // Green
      default:
        return 'text-white';
    }
  };

  // **NEW** Helper to get Status and Status Color
  // Assuming 'status' is a direct field on the row data for simplicity,
  // or a combination of `is_active`, `is_blocked`, `is_verified` (adjust as needed for your API)
  const getStatusDisplay = (row) => {
    // Example logic based on common boolean fields (Adjust this to match your actual API response fields)
    if (row.is_blocked) {
      return { status: 'Blocked', color: 'text-[#EF4444]' }; // Red
    }
    if (row.is_verified) {
      return { status: 'Approved', color: 'text-[#3CC668]' }; // Green
    }
    // Assuming 'is_active' determines if it's currently usable (after approval, before block)
    if (row.is_active === false) {
      return { status: 'Rejected/Inactive', color: 'text-yellow-400' }; // Yellow
    }
    
    // Default or pending state
    return { status: 'Pending', color: 'text-gray-400' };
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="bg-[#343434] p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-semibold text-white">
            Manage Registrations
          </h2>

          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <button
              onClick={handleFilterClick}
              className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px]"
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

        {loading ? (
          <div className="text-center py-8 text-white">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">Loading registrations...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-white bg-[#00C1C980] border-b border-gray-700">
                    <th className="py-2 font-[700] text-[14px] text-center">Name</th>
                    <th className="text-center">Type</th>
                    <th className="text-center">Subscription Type</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Registration Date</th>
                    {/* NEW FIELD ADDED */}
                    <th className="text-center">Status</th> 
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => {
                      const { status, color } = getStatusDisplay(row); // Get dynamic status and color
                      return (
                        <tr key={row.id} className="border-b border-gray-700 text-white">
                          <td className="py-2 text-center">{row.name}</td>
                          <td className="text-center">
                            <span className={getTypeColor(row.type)}>
                              {row.type}
                            </span>
                          </td>
                          <td className="text-center">{row.subscription_type}</td>
                          <td className="text-center">{row.email}</td>
                          <td className="text-center">{formatDate(row.registration_date)}</td>
                          {/* NEW STATUS FIELD */}
                          <td className="text-center">
                            <span className={color}>
                              {status}
                            </span>
                          </td>
                          <td className="py-2">
                            <div className="flex items-center justify-center gap-2">
                              {/* REMOVED: Edit Icon */}
                              {/* REMOVED: Delete Icon */}
                              {/* KEPT: View Icon */}
                              <Image
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                src={eyeIcon}
                                alt="View"
                                width={26}
                                height={26}
                                onClick={() => handleView(row.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-400"> {/* Updated colSpan to 7 */}
                        No matching registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalCount > 0 && (
              <div className="flex justify-between items-center mt-4 text-white">
                <p className="text-sm text-gray-400">
                  Showing page {currentPage} - Total: {totalCount} registrations
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={!previousPage}
                    className={`px-4 py-2 rounded ${
                      previousPage
                        ? 'bg-[#00C1C9] hover:bg-[#009da3] cursor-pointer'
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                    } transition-colors`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!nextPage}
                    className={`px-4 py-2 rounded ${
                      nextPage
                        ? 'bg-[#00C1C9] hover:bg-[#009da3] cursor-pointer'
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                    } transition-colors`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal (kept but unused in table now) */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-sm relative border border-[#3A3A3A]">
            <h2 className="text-white text-xl font-semibold mb-4 text-center">
              Confirm Delete
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Are you sure you want to delete this registration? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmModal(false);
                  setDeleteId(null);
                }}
                className="bg-transparent border border-gray-600 text-gray-400 px-6 py-2 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-[#EF4444] text-white px-6 py-2 rounded-full hover:bg-[#DC2626] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}