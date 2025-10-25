// app/admin/withdrawal-requests/[id]/page.js
'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { withdrawalService } from '@/lib/withdrawalService';

export default function WithdrawalDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchWithdrawalDetails();
        }
    }, [id]);

    const fetchWithdrawalDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await withdrawalService.getWithdrawalDetail(id);
            
            if (result.success) {
                setRequest(result.data);
            } else {
                setError(result.error || "Failed to fetch withdrawal details");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).split('/').join('.');
    };

    const getStatusColor = (status) => {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#21F6FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg">Loading withdrawal details...</p>
                </div>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-red-400 mb-4">{error || "Request not found"}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-[#21F6FF] text-black rounded hover:bg-[#1ad4dc] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#2A2A2A]">
            <div className="relative bg-[#343434] text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
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

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Venue Information</h2>
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold">Venue Name:</span> {request.venue_name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold">Email:</span> {request.venue_email || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold">Venue ID:</span> {request.hospitality_venue || "N/A"}
                    </p>
                </div>

                <h3 className="text-xl font-semibold mb-4 border-t border-gray-600 pt-4">Transaction Details</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-300">Request Date:</span>
                        <span className="font-medium">{formatDate(request.requested_date)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Processed Date:</span>
                        <span className="font-medium">{request.processed_date ? formatDate(request.processed_date) : "Not processed yet"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Amount:</span>
                        <span className="font-medium text-lg">€{request.amount || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Available Balance:</span>
                        <span className="font-medium">€{request.available_balance || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Status:</span>
                        <span className={`font-medium capitalize ${getStatusColor(request.status)}`}>
                            {request.status || "Unknown"}
                        </span>
                    </div>
                </div>

                {request.bank_details && (
                    <>
                        <h3 className="text-xl font-semibold mb-4 border-t border-gray-600 pt-4 mt-4">Bank Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-300">Bank Name:</span>
                                <span className="font-medium">{request.bank_details.bank_name || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Account Number:</span>
                                <span className="font-medium">{request.bank_details.account_number || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Account Holder:</span>
                                <span className="font-medium">{request.bank_details.bankholder_name || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Verified:</span>
                                <span className={`font-medium ${request.bank_details.is_verified ? 'text-green-500' : 'text-red-500'}`}>
                                    {request.bank_details.is_verified ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {request.notes && (
                    <div className="mt-4 border-t border-gray-600 pt-4">
                        <h3 className="text-lg font-semibold mb-2">Notes</h3>
                        <p className="text-sm text-gray-400 whitespace-pre-wrap">{request.notes}</p>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-600 text-xs text-gray-500">
                    <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{formatDate(request.created_at)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Last Updated:</span>
                        <span>{formatDate(request.updated_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}