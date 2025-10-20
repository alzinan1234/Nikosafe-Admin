// components/SupportTable.js
'use client';

import React, { useState, useEffect, useMemo } from 'react';

import SupportDetailsModal from './SupportDetailsModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EyeIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { supportService } from '@/lib/supportService';
import toast, { Toaster } from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;
const PAGE_RANGE = 2;

const SupportTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [allTickets, setAllTickets] = useState([]);
    const [displayedTickets, setDisplayedTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Fetch tickets from API
    const fetchTickets = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const filters = {};

            // Add filters if they exist
            if (statusFilter) filters.status = statusFilter;
            if (priorityFilter) filters.priority = priorityFilter;
            if (searchTerm) filters.search = searchTerm;

            const response = await supportService.getTickets(filters);

            if (response.success) {
                setAllTickets(response.data);
            } else {
                setError(response.error);
                setAllTickets([]);
            }
        } catch (err) {
            setError('Failed to fetch tickets');
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch tickets on mount and when filters change
    useEffect(() => {
        fetchTickets();
    }, [searchTerm, statusFilter, priorityFilter]);

    // Update displayed tickets when data changes
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedTickets(allTickets.slice(startIndex, endIndex));
    }, [currentPage, allTickets]);

    const totalPages = Math.ceil(allTickets.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const openDetailsModal = async (ticketId) => {
        setIsLoading(true);
        const response = await supportService.getTicketDetails(ticketId);
        
        if (response.success) {
            setSelectedTicket(response.data);
            setIsModalOpen(true);
        } else {
            toast.error(response.error || 'Failed to fetch ticket details');
        }
        setIsLoading(false);
    };

    const closeDetailsModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
        fetchTickets(); // Refresh data
    };

    const handleResolveTicket = async (ticketId) => {
        // Show a loading toast that we'll dismiss on completion
        const loadingToast = toast.loading('Resolving ticket...');
        setIsLoading(true);

        try {
            const response = await supportService.resolveTicket(ticketId, 'Resolved by admin');
            
            if (response.success) {
                toast.success('Ticket resolved successfully');
                fetchTickets(); // Refresh data
            } else {
                toast.error(response.error || 'Failed to resolve ticket');
            }
        } catch (error) {
            toast.error('Failed to resolve ticket');
        } finally {
            toast.dismiss(loadingToast);
            setIsLoading(false);
        }
    };

    // Delete handler removed

    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'text-blue-500';
            case 'in_progress':
                return 'text-yellow-500';
            case 'resolved':
                return 'text-green-500';
            case 'closed':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    };

    const getPriorityClasses = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'text-red-600';
            case 'high':
                return 'text-orange-500';
            case 'medium':
                return 'text-yellow-500';
            case 'low':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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
                if (i !== 1 || pages.includes(1)) {
                    if (i === totalPages && pages.includes(totalPages)) {
                        // Skip if totalPages is already added
                    } else {
                        pages.push(i);
                    }
                }
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
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <div className="bg-[#343434] text-white p-6 sm:p-6 lg:p-8 rounded shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[20px] sm:text-3xl font-semibold">Support</h1>
                    <div className="flex items-center gap-2">
                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-[#F3FAFA1A] rounded border-[1px] border-[#0000001A]  text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="" className="text-black">All Status</option>
                            <option value="open" className="text-black">Open</option>
                            <option value="in_progress" className="text-black">In Progress</option>
                            <option value="resolved" className="text-black">Resolved</option>
                            <option value="closed" className="text-black">Closed</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-3 py-2 bg-[#F3FAFA1A] rounded border-[1px] border-[#0000001A]  text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="" className="text-black">All Priority</option>
                            <option value="low" className="text-black">Low</option>
                            <option value="medium" className="text-black">Medium</option>
                            <option value="high" className="text-black">High</option>
                            <option value="urgent" className="text-black">Urgent</option>
                        </select>

                        {/* Search */}
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
                        {/* <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px] border-[1px] border-[#0000001A]">
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
                        </button> */}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="mt-2 text-gray-400">Loading tickets...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Table Container */}
                {!isLoading && (
                    <div className="border-b border-[#D0D0D0CC] rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-[#404040]">
                            <thead className="bg-[#17787C]">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                        User Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                        Subject
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                        Priority
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D0D0D0CC]">
                                {displayedTickets.length > 0 ? (
                                    displayedTickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white text-center">
                                                #{ticket.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                                                {ticket.user_email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white text-center">
                                                <div className="max-w-xs truncate">
                                                    {ticket.subject}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClasses(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B0B0B0] text-center">
                                                {formatDate(ticket.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                <div className="flex justify-center space-x-2">
                                                    {/* View Details */}
                                                    <button
                                                        onClick={() => openDetailsModal(ticket.id)}
                                                        className="text-[#9900FF] cursor-pointer border hover:text-[#b377ff] p-2 rounded-full hover:bg-purple-900 transition-colors duration-200"
                                                        aria-label="View details"
                                                        disabled={isLoading}
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>

                                                    {/* Resolve Ticket */}
                                                    {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                                        <button
                                                            onClick={() => handleResolveTicket(ticket.id)}
                                                            className="text-green-500 cursor-pointer border hover:text-green-400 p-2 rounded-full hover:bg-green-900 transition-colors duration-200"
                                                            aria-label="Resolve ticket"
                                                            disabled={isLoading}
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-[#B0B0B0]">
                                            {searchTerm || statusFilter || priorityFilter 
                                                ? 'No tickets found matching your criteria.' 
                                                : 'No support tickets found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody> 
                        </table>
                    </div>
                )}

                {/* Support Details Modal */}
                <SupportDetailsModal
                    isOpen={isModalOpen}
                    onClose={closeDetailsModal}
                    ticket={selectedTicket}
                />
            </div>

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
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

export default SupportTable;