'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { withdrawalService } from '@/lib/withdrawalService';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;
const PAGE_RANGE = 2;

const WithdrawalRequests = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [allRequests, setAllRequests] = useState([]);
    const [displayedRequests, setDisplayedRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    // Fetch all withdrawal requests
    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await withdrawalService.getAllWithdrawals({ search: searchTerm });
            
            if (result.success) {
                setAllRequests(result.data);
            } else {
                const errorMsg = result.error || "Failed to fetch withdrawal requests";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = "An unexpected error occurred";
            setError(errorMsg);
            toast.error(errorMsg);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter requests based on search term
    useEffect(() => {
        const filtered = allRequests.filter(request =>
            (request.venue_name && request.venue_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (request.venue_email && request.venue_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (request.status && request.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (request.amount && request.amount.toString().includes(searchTerm))
        );
        
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedRequests(filtered.slice(startIndex, endIndex));
    }, [searchTerm, allRequests, currentPage]);

    const totalPages = Math.ceil(allRequests.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const openDetailsPage = (requestId) => {
        router.push(`/admin/withdrawal-requests/${requestId}`);
    };

    // Handle Approve Withdrawal Request
    const handleApproveWithdrawal = useCallback(async (requestId) => {
        setActionLoading(prev => ({ ...prev, [requestId]: 'approve' }));
        
        try {
            const result = await withdrawalService.approveWithdrawal(requestId);
            
            if (result.success) {
                await fetchWithdrawals();
            }
        } catch (error) {
            console.error('Approve error:', error);
        } finally {
            setActionLoading(prev => {
                const newState = { ...prev };
                delete newState[requestId];
                return newState;
            });
        }
    }, []);

    // Handle Reject Withdrawal Request
    const handleRejectWithdrawal = useCallback(async (requestId) => {
        setActionLoading(prev => ({ ...prev, [requestId]: 'reject' }));
        
        try {
            const result = await withdrawalService.rejectWithdrawal(requestId);
            
            if (result.success) {
                await fetchWithdrawals();
            }
        } catch (error) {
            console.error('Reject error:', error);
        } finally {
            setActionLoading(prev => {
                const newState = { ...prev };
                delete newState[requestId];
                return newState;
            });
        }
    }, []);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'processing':
                return 'text-orange-500';
            case 'completed':
                return 'text-green-500';
            case 'rejected':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxPageButtons = (PAGE_RANGE * 2) + 1;

        if (totalPages <= maxPageButtons + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const leftBound = Math.max(1, currentPage - PAGE_RANGE);
            const rightBound = Math.min(totalPages, currentPage + PAGE_RANGE);

            if (currentPage > PAGE_RANGE + 1 && totalPages > maxPageButtons + 2) {
                pages.push(1);
            }

            if (leftBound > 2) {
                pages.push('...');
            }

            for (let i = leftBound; i <= rightBound; i++) {
                pages.push(i);
            }

            if (rightBound < totalPages - 1) {
                pages.push('...');
            }

            if (totalPages !== 1 && !pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }
        return [...new Set(pages)];
    }, [currentPage, totalPages]);

    return (
        <>
            <div className="bg-[#343434] text-white p-6 sm:p-6 lg:p-8 rounded shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[20px] sm:text-3xl font-semibold">Withdrawal Requests</h1>
                    <div className="flex items-center">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px] border-[1px] border-[#0000001A]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                <path d="M11 8.5L20 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M4 16.5L14 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <ellipse cx="7" cy="8.5" rx="3" ry="3" transform="rotate(90 7 8.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <ellipse cx="17" cy="16.5" rx="3" ry="3" transform="rotate(90 17 16.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="border-b border-[#D0D0D0CC] rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-[#404040]">
                        <thead className="bg-[#17787C]">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">Submitted By</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">Date Submitted</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D0D0D0CC]">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                                        Loading withdrawal requests...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-red-400">
                                        {error}
                                    </td>
                                </tr>
                            ) : displayedRequests.length > 0 ? (
                                displayedRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-white">{request.venue_name || "N/A"}</div>
                                                    <div className="text-xs text-gray-400">{request.venue_email || "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B0B0B0] text-center">
                                            {formatDate(request.requested_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                                            €{request.amount || "0.00"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(request.status)}`}>
                                                {request.status || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleApproveWithdrawal(request.id)}
                                                    disabled={actionLoading[request.id] === 'approve'}
                                                    className="text-green-500 border border-green-500 cursor-pointer bg-[#4BB54B1A] hover:text-green-700 p-2 rounded-full hover:bg-green-900 transition-colors duration-200 disabled:opacity-50"
                                                    aria-label="Approve withdrawal"
                                                >
                                                    {actionLoading[request.id] === 'approve' ? (
                                                        <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleRejectWithdrawal(request.id)}
                                                    disabled={actionLoading[request.id] === 'reject'}
                                                    className="text-[#FF0000] hover:text-red-700 cursor-pointer p-2 rounded-full border border-[#FF0000] hover:bg-red-900 transition-colors duration-200 disabled:opacity-50"
                                                    aria-label="Reject withdrawal"
                                                >
                                                    {actionLoading[request.id] === 'reject' ? (
                                                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => openDetailsPage(request.id)}
                                                    className="text-[#9900FF] cursor-pointer border border-[#9900FF] hover:text-[#b377ff] p-2 rounded-full hover:bg-purple-900 transition-colors duration-200"
                                                    aria-label="View details"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-[#B0B0B0]">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-end items-center mt-8 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-[#262626] border border-[#404040] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#404040] transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-4 py-2 text-white">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded ${
                                    currentPage === page ? 'bg-[#21F6FF] text-black' : 'text-white hover:bg-[#404040]'
                                } transition-colors duration-200`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-[#262626] border border-[#404040] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#404040] transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
};

export default WithdrawalRequests;