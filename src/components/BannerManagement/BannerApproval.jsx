"use client";

import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
 // Import the new service

// Assuming these paths are correct
import eye from "../../../public/icon/eye.svg"; 
// Using inline SVG for the back arrow to keep the icon crisp and avoid Next/Image overhead
import { bannerService } from "@/lib/bannerService";

// Helper to map API status to UI status for display
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

export default function BannerApproval() {
    const router = useRouter();
    const [banners, setBanners] = useState([]);
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('pending'); // Default to pending

    // --- Data Fetching Logic ---
    const fetchBanners = useCallback(async (status) => {
        setIsLoading(true);
        setError(null);
        
        // Fetch banners based on the selected status filter
        const result = await bannerService.getBanners({ status });
        
        if (result.success) {
            // Map API response fields to component state format
            const formattedData = (result.data || []).map(banner => ({
                id: banner.id,
                submittedBy: banner.submitted_by_venue_name || 'N/A', // Assuming a venue_name field
                type: 'Banner', // Assuming a default or you'll need to fetch/infer this
                title: banner.title || `Banner ${banner.id}`,
                status: mapApiStatus(banner.approval_status), // Map approval_status
                dateSubmitted: new Date(banner.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
            }));
            setBanners(formattedData);
            setFilteredBanners(formattedData);
        } else {
            setError(result.error);
            setBanners([]);
            setFilteredBanners([]);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchBanners(filterStatus); 
    }, [fetchBanners, filterStatus]);

    // --- Search/Filter Logic ---
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const newFilteredBanners = banners.filter(
            (banner) =>
                banner.submittedBy.toLowerCase().includes(term) ||
                banner.type.toLowerCase().includes(term) ||
                banner.title.toLowerCase().includes(term) ||
                banner.status.toLowerCase().includes(term) ||
                banner.dateSubmitted.toLowerCase().includes(term)
        );
        setFilteredBanners(newFilteredBanners);
    }, [searchTerm, banners]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // --- Action Handlers ---
    const updateBannerStatusLocally = (bannerId, newStatus) => {
        setBanners(prev =>
            prev.map(banner =>
                Number(banner.id) === Number(bannerId) ? { ...banner, status: newStatus } : banner
            )
        );
    };

    const handleApprove = async (bannerId) => {
        const confirmApprove = window.confirm(`Are you sure you want to approve banner ${bannerId}?`);
        if (!confirmApprove) return;

        const result = await bannerService.approveBanner(bannerId);
        
        if (result.success) {
            alert(result.message);
            // Re-fetch the list to remove the item from the current 'pending' view 
            // or update locally and rely on the next full fetch to sync.
            // For simplicity and to reflect the status change immediately (if viewing 'all'):
            updateBannerStatusLocally(bannerId, "Approved");
            // If the current filter is 'pending', re-fetch to remove it from the list
            if (filterStatus === 'pending') {
                fetchBanners(filterStatus);
            }
        } else {
            alert(`Approval failed: ${result.error}`);
        }
    };

    const handleReject = async (bannerId) => {
        const reason = window.prompt("Enter reason for rejection (Optional):");
        if (reason === null) return; // User clicked cancel
        
        const result = await bannerService.rejectBanner(bannerId, reason);
        
        if (result.success) {
            alert(result.message);
            updateBannerStatusLocally(bannerId, "Rejected");
             // If the current filter is 'pending', re-fetch to remove it from the list
             if (filterStatus === 'pending') {
                fetchBanners(filterStatus);
            }
        } else {
            alert(`Rejection failed: ${result.error}`);
        }
    };

    const handleView = (bannerId) => {
        // Navigate to the dynamic banner details page
        router.push(`/admin/banner-approval/${bannerId}`);
    };

    const handleFilterClick = () => {
        // Simple example: toggle between 'pending' and 'all'
        const newStatus = filterStatus === 'pending' ? 'all' : 'pending';
        setFilterStatus(newStatus);
        setSearchTerm(""); // Clear search when filter changes
    };

    // --- Rendering Logic ---
    if (isLoading) {
        return <div className="text-white p-4 text-center">Loading banners...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
    }

    return (
        <div className="bg-[#343434] p-4 rounded-lg shadow-lg">
            {/* Header and Search/Filter Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-white hover:text-gray-400" aria-label="Go back">
                        {/* Inline SVG back arrow - small and fast */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-[20px] font-semibold text-white">
                        Banner Approval ({filterStatus.toUpperCase()})
                    </h2>
                </div>

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

                    {/* Filter Button */}
                    <button
                        onClick={handleFilterClick}
                        className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px]"
                        title={`Filter: Currently showing ${filterStatus}. Click to switch to ${filterStatus === 'pending' ? 'all' : 'pending'}.`}
                    >
                        {/* Filter SVG */}
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

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-white bg-[#00C1C980] border-b border-gray-700">
                            <th className="py-2 px-4 font-[700] text-[14px] text-center">
                                Submitted By
                            </th>
                            <th className="py-2 px-4 font-[700] text-[14px] text-center">
                                Type
                            </th>
                            <th className="py-2 px-4 font-[700] text-[14px] text-center">
                                Title
                            </th>
                            <th className="py-2 px-4 font-[700] text-[14px] text-center">
                                Status
                            </th>
                            <th className="py-2 px-4 font-[700] text-[14px] text-center">
                                Date Submitted
                            </th>
                            <th className="py-2 px-4 font-[700] text-[14px] text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBanners.length > 0 ? (
                            filteredBanners.map((banner) => (
                                <tr key={banner.id} className="border-b border-gray-700 text-white">
                                    <td className="py-2 px-4 text-center">{banner.submittedBy}</td>
                                    <td className="py-2 px-4 text-center">{banner.type}</td>
                                    <td className="py-2 px-4 text-center">{banner.title}</td>
                                    <td className="py-2 px-4 text-center">
                                        <span
                                            className={`font-medium ${
                                                banner.status === "Pending"
                                                    ? "text-[#FFC107]" // Yellow for Pending
                                                    : banner.status === "Approved"
                                                    ? "text-[#4CAF50]" // Green for Approved
                                                    : "text-[#F44336]" // Red for Rejected
                                            }`}
                                        >
                                            {banner.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center">{banner.dateSubmitted}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Approve (Green Check) - Only visible/enabled for Pending */}
                                            <button
                                                onClick={() => handleApprove(banner.id)}
                                                className={`p-1 rounded-full border transition-colors duration-200 ${banner.status === "Pending" ? 'text-[#73D100] border-[#73D100] hover:bg-green-900' : 'text-gray-500 border-gray-700 cursor-not-allowed'}`}
                                                style={{ backgroundColor: '#0053B200' }}
                                                title="Approve"
                                                disabled={banner.status !== "Pending"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </button>

                                            {/* Reject (Red X) - Only visible/enabled for Pending */}
                                            <button
                                                onClick={() => handleReject(banner.id)}
                                                className={`p-1 rounded-full border transition-colors duration-200 ${banner.status === "Pending" ? 'text-[#FF0000] border-[#FF0000] hover:bg-red-900' : 'text-gray-500 border-gray-700 cursor-not-allowed'}`}
                                                style={{ backgroundColor: '' }}
                                                title="Reject"
                                                disabled={banner.status !== "Pending"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>

                                            {/* View (Purple Eye) */}
                                            <button
                                                onClick={() => handleView(banner.id)}
                                                className="p-1 rounded-full text-[#9900FF] hover:bg-purple-900 transition-colors duration-200"
                                                title="View Details"
                                            >
                                                <Image
                                                    src={eye}
                                                    alt="View"
                                                    width={28}
                                                    height={30}
                                                    className="inline"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-400">
                                    No matching banners found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}