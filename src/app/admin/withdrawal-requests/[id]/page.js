// This file would be at app/withdrawal-requests/[id]/page.js
'use client'; // This component will be a Client Component

import { useParams, useRouter } from 'next/navigation'; // For App Router
import React from 'react';
import Image from 'next/image';

// This mock function should ideally be an API call or a shared utility
const getAllWithdrawalRequests = () => {
    return [
        {
            id: 'WR001',
            submittedBy: 'Haus & Herz',
            avatar: '/image/userImage.png',
            accountType: 'Service provider',
            dateSubmitted: 'May 7, 2025',
            amount: '€150.00',
            paymentMethod: 'Bank Transfer',
            status: 'Pending',
            description: 'Requested withdrawal of €150.00 to associated bank account ending in **** **** 1234. Waiting for approval.',
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '(123) 456-7890',
            requestDate: '07.05.2025',
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
            fullName: 'Jane Cooper',
            email: 'abc@example.com',
            phoneNumber: '(319) 555-0115',
            requestDate: '06.05.2025',
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
            fullName: 'Alice Smith',
            email: 'alice.smith@example.com',
            phoneNumber: '(987) 654-3210',
            requestDate: '05.05.2025',
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
            fullName: 'Bob Johnson',
            email: 'bob.j@example.com',
            phoneNumber: '(555) 123-4567',
            requestDate: '04.05.2025',
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
            fullName: 'Charlie Brown',
            email: 'charlie.b@example.com',
            phoneNumber: '(111) 222-3333',
            requestDate: '03.05.2025',
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
            fullName: 'Diana Prince',
            email: 'diana.p@example.com',
            phoneNumber: '(444) 555-6666',
            requestDate: '02.05.2025',
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
            fullName: 'Clark Kent',
            email: 'clark.k@example.com',
            phoneNumber: '(777) 888-9999',
            requestDate: '30.04.2025',
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
            fullName: 'Bruce Wayne',
            email: 'bruce.w@example.com',
            phoneNumber: '(000) 111-2222',
            requestDate: '29.04.2025',
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
            fullName: 'Selina Kyle',
            email: 'selina.k@example.com',
            phoneNumber: '(333) 444-5555',
            requestDate: '28.04.2025',
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
            fullName: 'Lois Lane',
            email: 'lois.l@example.com',
            phoneNumber: '(666) 777-8888',
            requestDate: '27.04.2025',
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
            fullName: 'Jimmy Olsen',
            email: 'jimmy.o@example.com',
            phoneNumber: '(999) 000-1111',
            requestDate: '26.04.2025',
        },
    ];
};

const getWithdrawalRequestById = (id) => {
    return getAllWithdrawalRequests().find(request => request.id === id);
};

export default function WithdrawalDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params; // Get the ID from the URL parameters

    const request = id ? getWithdrawalRequestById(id) : null;

    if (!request) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] text-white flex items-center justify-center">
                <p className="text-lg">Loading or Request not found...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#2A2A2A]">
            <div className="relative bg-[#343434] text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <button
                    onClick={() => router.back()} // Go back to the previous page
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
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

                <div className="flex items-center mb-6">
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-600">
                        <Image
                            src={request.avatar || 'https://placehold.co/80x80/CCCCCC/000000?text=NA'}
                            alt="User Avatar"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-lg font-bold">Full name : {request.fullName}</h2>
                        <p className="text-sm text-gray-300">Email: {request.email}</p>
                        <p className="text-sm text-gray-300">Phone number: {request.phoneNumber}</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Transaction Details :</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-300">Payment Method:</span>
                        <span className="font-medium">{request.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Request Date:</span>
                        <span className="font-medium">{request.requestDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Amount:</span>
                        <span className="font-medium">{request.amount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Status:</span>
                        <span className={`font-medium ${
                            request.status === 'Pending' ? 'text-orange-500' :
                            request.status === 'Approved' ? 'text-green-500' :
                            'text-red-500'
                        }`}>{request.status}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-300 mb-1">Description:</span>
                        <p className="text-sm text-gray-400">{request.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}