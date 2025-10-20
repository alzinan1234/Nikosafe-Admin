// app/admin/promotion-approval/[id]/page.js
'use client';

import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { promotionService } from '@/lib/promotionService';

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

const PromotionDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [promotion, setPromotion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            
            const result = await promotionService.getPromotionDetails(id);

            if (result.success) {
                setPromotion(result.data);
            } else {
                setError(result.error);
            }
            setIsLoading(false);
        };

        fetchDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] text-white flex items-center justify-center">
                <p className="text-lg">Loading promotion details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] text-red-500 flex items-center justify-center">
                <p className="text-lg">Error loading details: {error}</p>
            </div>
        );
    }

    if (!promotion) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] text-white flex items-center justify-center">
                <p className="text-lg">Promotion not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#2A2A2A]">
            <div className="relative bg-[#343434] text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white rounded-full p-1 bg-[#404040]"
                    aria-label="Close details"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-4">
                    {promotion.image && (
                        <Image
                            src={promotion.image}
                            alt={promotion.title}
                            width={400}
                            height={200}
                            className="rounded-lg mb-4 object-cover w-full h-48"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/400x200/CCCCCC/000000?text=No+Image';
                            }}
                        />
                    )}
                    <h2 className="text-xl font-semibold mb-2">{promotion.title}</h2>
                    <p className="text-gray-300 text-sm mb-4">{promotion.description}</p>

                    <div className="flex items-center text-gray-400 text-sm mb-2">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        <span>Start: {formatDate(promotion.start_date)}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        <span>End: {formatDate(promotion.end_date)}</span>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                    <p className="flex justify-between text-sm">
                        <span className="text-gray-400">Submitted By:</span>
                        <span className="font-medium">{promotion.venue_name}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                        <span className="text-gray-400">Venue Email:</span>
                        <span className="font-medium">{promotion.venue_email}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                        <span className="text-gray-400">Date Submitted:</span>
                        <span className="font-medium">{formatDate(promotion.created_at)}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <span
                            className={`font-medium ${
                                mapApiStatus(promotion.approval_status) === 'Pending'
                                    ? 'text-[#FFC107]'
                                    : mapApiStatus(promotion.approval_status) === 'Approved'
                                    ? 'text-[#4CAF50]'
                                    : 'text-[#F44336]'
                            }`}
                        >
                            {mapApiStatus(promotion.approval_status)}
                        </span>
                    </p>
                    {promotion.approval_status === 'rejected' && promotion.rejection_reason && (
                        <p className="flex justify-between text-sm">
                            <span className="text-gray-400">Rejection Reason:</span>
                            <span className="font-medium text-[#F44336]">{promotion.rejection_reason}</span>
                        </p>
                    )}
                    <p className="flex justify-between text-sm">
                        <span className="text-gray-400">Active:</span>
                        <span className={`font-medium ${promotion.is_active ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                            {promotion.is_active ? 'Yes' : 'No'}
                        </span>
                    </p>
                    <p className="flex justify-between text-sm">
                        <span className="text-gray-400">Featured:</span>
                        <span className={`font-medium ${promotion.is_featured ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                            {promotion.is_featured ? 'Yes' : 'No'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PromotionDetailsPage;