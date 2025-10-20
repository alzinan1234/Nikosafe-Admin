// components/PromotionApproval.js - Updated with toast and modal
"use client";

import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { promotionService } from '@/lib/promotionService';
import eye from "../../../public/icon/eye.svg";

// Helper to map API status to UI status
const mapApiStatus = (status) => {
    switch (status) {
        case 'approved':
            return 'Approved';
        case 'rejected':
            return 'Rejected';
        case 'pending':
        default:
            return 'Pending';
    }
};

// Helper to format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    
    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right`}>
            <div className="flex items-center gap-2">
                {type === 'success' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )}
                <span>{message}</span>
            </div>
        </div>
    );
};

// Rejection Modal Component
const RejectionModal = ({ isOpen, onClose, onConfirm, venueName, isLoading }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.trim()) {
            onConfirm(reason.trim());
            setReason('');
        }
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#343434] rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Reject Promotion
                    </h3>
                    <p className="text-gray-300 mb-4">
                        Please provide a reason for rejecting the promotion from <span className="font-medium text-white">{venueName}</span>.
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full h-32 p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            required
                        />
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !reason.trim()}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Rejecting...
                                    </div>
                                ) : (
                                    'Reject Promotion'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default function PromotionApproval() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ status: '' });
    
    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    // Rejection modal state
    const [rejectionModal, setRejectionModal] = useState({ 
        isOpen: false, 
        promotionId: null, 
        venueName: '', 
        isLoading: false 
    });

    // Fetch promotions when filters change
    useEffect(() => {
        fetchPromotions();
    }, [filters]);

    // Client-side search filtering
    useEffect(() => {
        if (!searchTerm) {
            setFilteredPromotions(promotions);
            return;
        }

        const filtered = promotions.filter(
            (promo) =>
                promo.venue_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                promo.venue_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                promo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mapApiStatus(promo.approval_status).toLowerCase().includes(searchTerm.toLowerCase()) ||
                formatDate(promo.created_at).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPromotions(filtered);
    }, [searchTerm, promotions]);

    const fetchPromotions = async () => {
        setIsLoading(true);
        setError(null);
        
        const result = await promotionService.getPromotions(filters);

        if (result.success) {
            setPromotions(result.data || []);
        } else {
            setError(result.error);
            setPromotions([]);
        }
        setIsLoading(false);
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilter = (status) => {
        setFilters(prev => ({
            ...prev,
            status: status
        }));
    };

    const handleClearFilters = () => {
        setFilters({ status: '' });
        setSearchTerm('');
    };

    const handleApprove = async (promoId, venueName) => {
        const result = await promotionService.approvePromotion(promoId);
        
        if (result.success) {
            showToast(`Promotion from ${venueName} approved successfully!`, 'success');
            fetchPromotions(); // Refresh the list
        } else {
            showToast(`Failed to approve: ${result.error}`, 'error');
        }
    };

    const openRejectionModal = (promoId, venueName) => {
        setRejectionModal({
            isOpen: true,
            promotionId: promoId,
            venueName: venueName,
            isLoading: false
        });
    };

    const closeRejectionModal = () => {
        setRejectionModal({
            isOpen: false,
            promotionId: null,
            venueName: '',
            isLoading: false
        });
    };

    const handleRejectConfirm = async (reason) => {
        setRejectionModal(prev => ({ ...prev, isLoading: true }));
        
        const result = await promotionService.rejectPromotion(rejectionModal.promotionId, reason);
        
        if (result.success) {
            showToast(`Promotion from ${rejectionModal.venueName} rejected successfully!`, 'success');
            fetchPromotions(); // Refresh the list
            closeRejectionModal();
        } else {
            showToast(`Failed to reject: ${result.error}`, 'error');
            setRejectionModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleView = (promoId) => {
        router.push(`/admin/promotion-approval/${promoId}`);
    };

    const getStatusColor = (status) => {
        const uiStatus = mapApiStatus(status);
        return uiStatus === "Pending"
            ? "text-[#FFC107]"
            : uiStatus === "Approved"
            ? "text-[#4CAF50]"
            : "text-[#F44336]";
    };

    const getStatusCounts = () => {
        const counts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            total: promotions.length
        };

        promotions.forEach(promo => {
            if (promo.approval_status in counts) {
                counts[promo.approval_status]++;
            }
        });

        return counts;
    };

    const statusCounts = getStatusCounts();

    return (
        <div className="bg-[#343434] p-4 rounded-lg shadow-lg">
            {/* Toast Notification */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ show: false, message: '', type: '' })} 
                />
            )}

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={rejectionModal.isOpen}
                onClose={closeRejectionModal}
                onConfirm={handleRejectConfirm}
                venueName={rejectionModal.venueName}
                isLoading={rejectionModal.isLoading}
            />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[27px] font-semibold text-white">
                        Promotion Approval
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Total: {statusCounts.total} | 
                        Pending: <span className="text-[#FFC107]">{statusCounts.pending}</span> | 
                        Approved: <span className="text-[#4CAF50]">{statusCounts.approved}</span> | 
                        Rejected: <span className="text-[#F44336]">{statusCounts.rejected}</span>
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex items-center gap-4">
                    {/* Status Filter Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusFilter('')}
                            className={`px-3 py-1 rounded text-sm ${
                                filters.status === '' 
                                    ? 'bg-[#00C1C9] text-white' 
                                    : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleStatusFilter('pending')}
                            className={`px-3 py-1 rounded text-sm ${
                                filters.status === 'pending' 
                                    ? 'bg-[#FFC107] text-black' 
                                    : 'bg-[#2A2A2A] text-[#FFC107] hover:bg-[#3A3A3A]'
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => handleStatusFilter('approved')}
                            className={`px-3 py-1 rounded text-sm ${
                                filters.status === 'approved' 
                                    ? 'bg-[#4CAF50] text-white' 
                                    : 'bg-[#2A2A2A] text-[#4CAF50] hover:bg-[#3A3A3A]'
                            }`}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => handleStatusFilter('rejected')}
                            className={`px-3 py-1 rounded text-sm ${
                                filters.status === 'rejected' 
                                    ? 'bg-[#F44336] text-white' 
                                    : 'bg-[#2A2A2A] text-[#F44336] hover:bg-[#3A3A3A]'
                            }`}
                        >
                            Rejected
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search promotions..."
                            className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-lg border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white w-64"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Clear Filters Button */}
                    {(filters.status || searchTerm) && (
                        <button
                            onClick={handleClearFilters}
                            className="px-3 py-2 bg-[#6B7280] text-white rounded text-sm hover:bg-[#5A6268]"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Loading and Error States */}
            {isLoading && (
                <div className="text-center py-8 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C1C9] mx-auto"></div>
                    <p className="mt-2">Loading promotions...</p>
                </div>
            )}

            {error && (
                <div className="text-center py-4 text-red-400 bg-red-900/20 rounded-lg mb-4">
                    <p>Error: {error}</p>
                    <button 
                        onClick={fetchPromotions}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Promotions Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-white bg-[#00C1C980] border-b border-gray-700">
                            <th className="py-3 px-4 font-[700] text-[14px] text-center">Venue Name</th>
                            <th className="py-3 px-4 font-[700] text-[14px] text-center">Venue Email</th>
                            <th className="py-3 px-4 font-[700] text-[14px] text-center">Promotion Title</th>
                            <th className="py-3 px-4 font-[700] text-[14px] text-center">Status</th>
                            <th className="py-3 px-4 font-[700] text-[14px] text-center">Date Submitted</th>
                            <th className="py-3 px-4 font-[700] text-[14px] text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoading && filteredPromotions.length > 0 ? (
                            filteredPromotions.map((promo) => (
                                <tr key={promo.id} className="border-b border-gray-700 text-white hover:bg-[#404040] transition-colors">
                                    <td className="py-3 px-4 text-center">{promo.venue_name}</td>
                                    <td className="py-3 px-4 text-center text-sm">{promo.venue_email}</td>
                                    <td className="py-3 px-4 text-center font-medium">{promo.title}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`font-medium ${getStatusColor(promo.approval_status)}`}>
                                            {mapApiStatus(promo.approval_status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">{formatDate(promo.created_at)}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Approve Button - Only show for pending promotions */}
                                            {promo.approval_status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(promo.id, promo.venue_name)}
                                                    className="p-2 rounded-full text-[#73D100] border border-[#73D100] hover:bg-green-900 transition-colors duration-200"
                                                    title="Approve Promotion"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Reject Button - Only show for pending promotions */}
                                            {promo.approval_status === 'pending' && (
                                                <button
                                                    onClick={() => openRejectionModal(promo.id, promo.venue_name)}
                                                    className="p-2 rounded-full text-[#FF0000] border border-[#FF0000] hover:bg-red-900 transition-colors duration-200"
                                                    title="Reject Promotion"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}

                                            {/* View Button - Always show */}
                                            <button
                                                onClick={() => handleView(promo.id)}
                                                className="rounded-full text-[#9900FF] hover:bg-purple-900 transition-colors duration-200"
                                                title="View Details"
                                            >
                                                <Image
                                                    src={eye}
                                                    alt="View Details"
                                                    width={35}
                                                    height={30}
                                                    className="inline w-9 h-10"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            !isLoading && (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-400">
                                        {promotions.length === 0 
                                            ? 'No promotions found.' 
                                            : 'No promotions match your search criteria.'
                                        }
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}