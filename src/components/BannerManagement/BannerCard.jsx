// components/BannerManagement/BannerCard.js

import Image from 'next/image';

const getStatusColor = (status) => {
    switch (status) {
        case 'approved':
            return 'text-green-500';
        case 'rejected':
            return 'text-red-500';
        case 'pending':
        default:
            return 'text-yellow-500';
    }
};

export default function BannerCard({ banner }) {
    return (
        <div className="w-full space-y-4 pt-6">
            <h1 className="text-2xl font-bold text-white text-center">{banner.title}</h1>

            {/* Image Section */}
            <div className="relative w-full h-48 bg-[#404040] rounded-lg overflow-hidden">
                {banner.imageUrl ? (
                    // Using a dummy placeholder for relative paths if the image is internal
                    <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        layout="fill"
                        objectFit="cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/404040/FFFFFF?text=Image+Not+Found'; }}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        No Banner Image
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="bg-[#2A2A2A] p-4 rounded-lg space-y-3">
                <p className="text-sm">
                    <span className="text-gray-400">Description:</span>{' '}
                    <span className="text-white block mt-1">{banner.description}</span>
                </p>
                <div className="flex justify-between border-t border-gray-700 pt-3">
                    <p className="text-sm">
                        <span className="text-gray-400">Submitted By:</span>{' '}
                        <span className="font-medium text-white">{banner.submittedBy}</span>
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-400">Type:</span>{' '}
                        <span className="font-medium text-white">{banner.type}</span>
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm">
                        <span className="text-gray-400">Location:</span>{' '}
                        <span className="font-medium text-white">{banner.location}</span>
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-400">Submitted On:</span>{' '}
                        <span className="font-medium text-white">{banner.dateSubmitted}</span>
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm">
                        <span className="text-gray-400">Duration:</span>{' '}
                        <span className="font-medium text-white">{banner.startDate}</span>
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-400">Time:</span>{' '}
                        <span className="font-medium text-white">{banner.startTime} - {banner.endTime}</span>
                    </p>
                </div>
            </div>

            {/* Status Indicator */}
            <div className="text-center p-2 rounded-lg border border-gray-700">
                <span className="text-lg font-bold">Status: </span>
                <span className={`text-lg font-bold ${getStatusColor(banner.status)}`}>
                    {banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}
                </span>
            </div>
        </div>
    );
}