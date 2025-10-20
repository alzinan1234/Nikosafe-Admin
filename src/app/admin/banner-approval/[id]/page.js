// app/banners/[id]/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Assuming you have a way to access the service, adjust path if necessary
import { bannerService } from "@/lib/bannerService"; 
// Assuming BannerCard component is located here. If it's not, you'll need to create it.
import BannerCard from "@/components/BannerManagement/BannerCard"; 
import Image from "next/image"; 

// Helper function to format the API response structure to match the component's expected data
const formatBannerData = (apiBanner) => {
    if (!apiBanner) return null;
    return {
        id: apiBanner.id,
        submittedBy: apiBanner.submitted_by_venue_name || 'N/A', // Use API fields
        type: apiBanner.type || 'Banner', 
        title: apiBanner.title || `Banner ${apiBanner.id}`,
        status: apiBanner.approval_status, // Use the raw status for further checks
        dateSubmitted: apiBanner.created_at ? new Date(apiBanner.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
        imageUrl: apiBanner.image || '', // Image URL from API
        description: apiBanner.description || 'No description provided.',
        startDate: apiBanner.start_date || 'N/A',
        startTime: apiBanner.start_time || 'N/A', // Assuming API provides time fields
        endTime: apiBanner.end_time || 'N/A',     // Assuming API provides time fields
        location: apiBanner.location_name || 'N/A', // Assuming API provides a location
    };
};

export default function BannerDetailsPage({ params }) {
    const router = useRouter();
    const { id } = params; // Get the dynamic ID from the URL

    const [banner, setBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchBannerDetails = async () => {
            setIsLoading(true);
            setError(null);
            
            // 1. Replace dummy data lookup with API call
            const result = await bannerService.getBannerDetails(id);

            if (result.success && result.data) {
                setBanner(formatBannerData(result.data));
            } else {
                setError(result.error || `Failed to fetch banner details for ID: ${id}`);
                setBanner(null);
            }
            setIsLoading(false);
        };

        fetchBannerDetails();
    }, [id]);

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#343434] text-white">
                <p className="text-xl">Loading banner details...</p>
            </div>
        );
    }
    
    // --- Error State ---
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#343434] text-red-500 p-4">
                <p className="text-xl mb-4">Error loading banner: {error}</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // --- Not Found State ---
    if (!banner) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#343434] text-white p-4">
                <p className="text-xl mb-4">Banner with ID {id} not found!</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 "
                >
                    Go Back
                </button>
            </div>
        );
    }

    // --- Render Details (Existing Design) ---
    return (
        <div className="relative flex items-center justify-center max-w-md rounded-lg bg-[#343434] p-4">
            {/* Close Button (X icon) */}
            <button
                onClick={() => router.back()} // Go back to the previous page
                className="absolute top-1 right-1 text-white text-3xl font-bold hover:text-gray-300 focus:outline-none z-10"
                aria-label="Close"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {/* BannerCard component to display details */}
            {/* Note: Ensure BannerCard can handle the 'banner' object structure */}
            <BannerCard banner={banner} />
        </div>
    );
}