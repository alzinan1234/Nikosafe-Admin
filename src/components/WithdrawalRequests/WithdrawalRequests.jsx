'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/solid'; // For the view icon
import Image from 'next/image';
// import WithdrawalDetailsModal from './WithdrawalDetailsModal'; // Remove this import as we are no longer using the modal
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// Mock data for Withdrawal Requests (replace with actual API calls in a real application)
const getAllWithdrawalRequests = () => {
    return [
        {
            id: 'WR001',
            submittedBy: 'Haus & Herz',
            avatar: '/image/userImage.png', // Placeholder avatar
            accountType: 'Service provider',
            dateSubmitted: 'May 7, 2025',
            amount: '€150.00',
            paymentMethod: 'Bank Transfer',
            status: 'Pending',
            description: 'Requested withdrawal of €150.00 to associated bank account ending in **** **** 1234. Waiting for approval.',
        },
        {
            id: 'WR002',
            submittedBy: 'Studio Pixel',
            avatar: '/image/userImage.png',
            accountType: 'Vendor',
            dateSubmitted: 'May 6, 2025',
            amount: '€500.00',
            paymentMethod: 'PayPal',
            status: 'Approved',
            description: 'Withdrawal of €500.00 approved and processed via PayPal.',
        },
        {
            id: 'WR003',
            submittedBy: 'Creative Designs',
            avatar: '/image/userImage.png',
            accountType: 'Client',
            dateSubmitted: 'May 5, 2025',
            amount: '€75.50',
            paymentMethod: 'Credit Card',
            status: 'Rejected',
            description: 'Withdrawal rejected due to insufficient funds/verification issues.',
        },
        {
            id: 'WR004',
            submittedBy: 'Global Solutions',
            avatar: '/image/userImage.png',
            accountType: 'Service provider',
            dateSubmitted: 'May 4, 2025',
            amount: '€1200.00',
            paymentMethod: 'Bank Transfer',
            status: 'Pending',
            description: 'Large withdrawal request pending security review.',
        },
        {
            id: 'WR005',
            submittedBy: 'Market Place Inc.',
            avatar: '/image/userImage.png',
            accountType: 'Vendor',
            dateSubmitted: 'May 3, 2025',
            amount: '€80.00',
            paymentMethod: 'Stripe',
            status: 'Approved',
            description: 'Automated withdrawal processed.',
        },
        {
            id: 'WR006',
            submittedBy: 'Tech Innovations',
            avatar: '/image/userImage.png',
            accountType: 'Client',
            dateSubmitted: 'May 2, 2025',
            amount: '€20.00',
            paymentMethod: 'Credit Card',
            status: 'Pending',
            description: 'Small withdrawal request.',
        },
        {
            id: 'WR007',
            submittedBy: 'Dynamic Systems',
            avatar: '/image/userImage.png',
            accountType: 'Service provider',
            dateSubmitted: 'Apr 30, 2025',
            amount: '€350.00',
            paymentMethod: 'PayPal',
            status: 'Approved',
            description: 'Withdrawal processed successfully.',
        },
        {
            id: 'WR008',
            submittedBy: 'Food Express',
            avatar: '/image/userImage.png',
            accountType: 'Vendor',
            dateSubmitted: 'Apr 29, 2025',
            amount: '€100.00',
            paymentMethod: 'Bank Transfer',
            status: 'Pending',
            description: 'Daily revenue withdrawal.',
        },
        {
            id: 'WR009',
            submittedBy: 'Urban Living',
            avatar: '/image/userImage.png',
            accountType: 'Client',
            dateSubmitted: 'Apr 28, 2025',
            amount: '€250.00',
            paymentMethod: 'Stripe',
            status: 'Rejected',
            description: 'Withdrawal failed due to invalid bank details.',
        },
        {
            id: 'WR010',
            submittedBy: 'Health & Wellness',
            avatar: '/image/userImage.png',
            accountType: 'Service provider',
            dateSubmitted: 'Apr 27, 2025',
            amount: '€600.00',
            paymentMethod: 'Bank Transfer',
            status: 'Pending',
            description: 'Weekly payout request.',
        },
        {
            id: 'WR011',
            submittedBy: 'The Bookworm',
            avatar: '/image/userImage.png',
            accountType: 'Vendor',
            dateSubmitted: 'Apr 26, 2025',
            amount: '€40.00',
            paymentMethod: 'PayPal',
            status: 'Approved',
            description: 'Small payment withdrawal.',
        },
    ];
};

const getWithdrawalRequestById = (id) => {
    return getAllWithdrawalRequests().find(request => request.id === id);
};


const ITEMS_PER_PAGE = 10; // Number of rows per page
const PAGE_RANGE = 2; // Number of pages to show around the current page (e.g., if current is 5, shows 3,4,5,6,7)

const WithdrawalRequests = () => {
    const router = useRouter(); // Initialize useRouter
    const [currentPage, setCurrentPage] = useState(1);
    const [allRequests, setAllRequests] = useState([]); // Store all requests, filtered by search
    const [displayedRequests, setDisplayedRequests] = useState([]); // Store requests for current page
    // const [isModalOpen, setIsModalOpen] = useState(false); // No longer needed
    // const [selectedRequest, setSelectedRequest] = useState(null); // No longer needed
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger data re-fetch

    // Fetch all requests and filter them based on search term
    useEffect(() => {
        const fetchedRequests = getAllWithdrawalRequests(); // Get all requests from mock data
        const filtered = fetchedRequests.filter(request =>
            request.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.accountType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setAllRequests(filtered);
        setCurrentPage(1); // Reset to first page on search or full data refresh
    }, [searchTerm, refreshTrigger]); // Re-run when search term changes or data needs refresh

    // Update displayed requests based on current page and filtered 'allRequests'
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedRequests(allRequests.slice(startIndex, endIndex));
    }, [currentPage, allRequests]); // Re-run when current page or filtered requests change

    // Calculate total pages based on currently filtered requests (allRequests)
    const totalPages = Math.ceil(allRequests.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const openDetailsPage = (requestId) => {
        router.push(`/admin/withdrawal-requests/${requestId}`); // Navigate to the dynamic details page
    };

    // const closeDetailsModal = () => { // No longer needed
    //     setIsModalOpen(false);
    //     setSelectedRequest(null);
    //     // Refresh table data after modal close, in case a change was made in modal
    //     setRefreshTrigger(prev => prev + 1);
    // };

    // Handle Approve Withdrawal Request (Green Check)
    const handleApproveWithdrawal = useCallback((requestId) => {
        // In a real app: call API to update status to 'Approved'
        console.log(`Withdrawal request ${requestId} approved.`);
        // For mock data, you'd update the status in your mock data source, then refresh
        // For demonstration, just log and refresh.
        // updateWithdrawalRequestStatus(requestId, 'Approved'); // if you had a function to modify mock data
        setRefreshTrigger(prev => prev + 1); // Trigger re-fetch to reflect changes
    }, []);

    // Handle Reject Withdrawal Request (Red X)
    const handleRejectWithdrawal = useCallback((requestId) => {
        // In a real app: call API to update status to 'Rejected'
        console.log(`Withdrawal request ${requestId} rejected.`);
        // For demonstration, just log and refresh.
        // updateWithdrawalRequestStatus(requestId, 'Rejected'); // if you had a function to modify mock data
        setRefreshTrigger(prev => prev + 1); // Trigger re-fetch to reflect changes
    }, []);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Pending':
                return 'text-orange-500'; // Orange for Pending, matching image
            case 'Approved':
                return 'text-green-500';
            case 'Rejected':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    // Memoize the page numbers calculation for performance
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

                {/* Table Container */}
                <div className="border-b border-[#D0D0D0CC] rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-[#404040]">
                        <thead className="bg-[#17787C]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                    Submitted By
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                    Account Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                    Date Submitted
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                    Payment Method
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#FFFFFF] tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D0D0D0CC]">
                            {displayedRequests.length > 0 ? (
                                displayedRequests.map((request) => (
                                    <tr key={request.id} className="">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden border border-[#404040]">
                                                    <Image
                                                        src={request.avatar}
                                                        alt="User Avatar"
                                                        width={32}
                                                        height={32}
                                                        className="h-full w-full object-cover"
                                                        // Fallback for image loading errors
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/32x32/CCCCCC/000000?text=NA'; }}
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-white">{request.submittedBy}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                                            {request.accountType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B0B0B0] text-center">
                                            {request.dateSubmitted}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                                            {request.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                                            {request.paymentMethod}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleApproveWithdrawal(request.id)}
                                                    className="text-green-500 border border-green-500 cursor-pointer bg-[#4BB54B1A] hover:text-green-700 p-2 rounded-full hover:bg-green-900 transition-colors duration-200"
                                                    aria-label="Approve withdrawal"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleRejectWithdrawal(request.id)}
                                                    className="text-[#FF0000] hover:text-red-700 cursor-pointer p-2 rounded-full border border-[#FF0000] hover:bg-red-900 transition-colors duration-200"
                                                    aria-label="Reject withdrawal"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDetailsPage(request.id)} // Changed to openDetailsPage
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
                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-[#B0B0B0]">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Withdrawal Details Modal - REMOVED */}
                {/* <WithdrawalDetailsModal
                    isOpen={isModalOpen}
                    onClose={closeDetailsModal}
                    request={selectedRequest}
                /> */}
            </div>

            {/* Pagination */}
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