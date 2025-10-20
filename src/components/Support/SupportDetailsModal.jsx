// components/SupportDetailsModal.js
'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { supportService } from '@/lib/supportService';
import toast, { Toaster } from 'react-hot-toast';


const SupportDetailsModal = ({ isOpen, onClose, ticket }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [localTicket, setLocalTicket] = useState(ticket || {});
    const [status, setStatus] = useState(ticket?.status ?? 'open');
    const [priority, setPriority] = useState(ticket?.priority ?? 'medium');

    // Keep local copy in state when ticket prop changes
    useEffect(() => {
        if (ticket) {
            setLocalTicket(ticket);
            setStatus(ticket.status || 'open');
            setPriority(ticket.priority || 'medium');
        }
    }, [ticket]);

    if (!isOpen || !ticket) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'bg-blue-500';
            case 'in_progress':
                return 'bg-yellow-500';
            case 'resolved':
                return 'bg-green-500';
            case 'closed':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'bg-red-600';
            case 'high':
                return 'bg-orange-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#343434] border border-[#404040] w-[1120px] rounded-lg shadow-xl mx-auto p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 rounded-lg">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}

                {/* Header */}
                <div className="flex gap-6 items-center mb-6">
                    <button
                        onClick={onClose}
                        className="text-[#B0B0B0] hover:text-white transition-colors duration-200 rounded-full p-[10px] py-[12px] bg-[#00C1C91A]"
                        aria-label="Close"
                        disabled={isLoading}
                    >
                        <Image src="/icon/elements.svg" alt="Elements Icon" width={24} height={24} />
                    </button>
                    <h2 className="text-xl font-semibold text-white">Support Details</h2>
                </div>

                <div className="px-8 md:px-12 lg:px-20 py-[20px] space-y-6">
                    {/* User Info */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border border-[#404040]">
                            <img
                                src={ticket.avatar || "/avatars/user-avatar.png"}
                                alt={ticket.user_name || ticket.user_email}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-white text-lg font-medium mb-1">
                            Submitted By: {ticket.user_email || 'N/A'}
                        </p>
                        {ticket.user_name && (
                            <p className="text-[#B0B0B0] text-sm mb-1">
                                Name: {ticket.user_name}
                            </p>
                        )}
                        <p className="text-[#B0B0B0] text-sm">
                            Date Submitted: {formatDate(ticket.created_at)}
                        </p>

                        {/* Status & Priority controls */}
                        <div className="flex gap-3 mt-3">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded bg-[#242424] border border-[#404040] text-white">
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Priority</label>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-2 rounded bg-[#242424] border border-[#404040] text-white">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={async () => {
                                        setIsLoading(true);
                                        const res1 = await supportService.updateTicketStatus(ticket.id, status, 'Updated via admin modal');
                                        const res2 = await supportService.updateTicketPriority(ticket.id, priority);
                                        setIsLoading(false);
                                        if (res1.success && res2.success) {
                                            toast.success('Ticket updated');
                                            // refresh local ticket
                                            const details = await supportService.getTicketDetails(ticket.id);
                                            if (details.success) setLocalTicket(details.data);
                                        } else {
                                            toast.error(res1.error || res2.error || 'Failed to update ticket');
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#00C1C9] rounded text-black font-medium"
                                    disabled={isLoading}
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Status and Priority Badges */}
                        <div className="flex gap-3 mt-3">
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(ticket.status)}`}>
                                Status: {ticket.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getPriorityColor(ticket.priority)}`}>
                                Priority: {ticket.priority}
                            </span>
                        </div>
                    </div>

                    {/* Ticket ID */}
                    <div className="mb-6">
                        <label className="block text-[#B0B0B0] text-sm mb-2">
                            Ticket ID
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 bg-transparent border border-[#929292] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9155F7]"
                            value={`#${ticket.id}`}
                            readOnly
                        />
                    </div>

                    {/* Issue Title / Subject */}
                    <div className="mb-6">
                        <label className="block text-[#B0B0B0] text-sm mb-2">
                            Issue Title
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 bg-transparent border border-[#929292] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9155F7]"
                            value={ticket.subject || ticket.title}
                            readOnly
                        />
                    </div>

                    {/* User Description */}
                    <div className="mb-6">
                        <label className="block text-[#B0B0B0] text-sm mb-2">
                            User Description
                        </label>
                        <textarea
                            className="w-full p-3 bg-transparent border border-[#929292] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9155F7] min-h-[120px] resize-none"
                            value={ticket.description || ticket.issueDescription}
                            readOnly
                        ></textarea>
                    </div>
                    {/* Replies Section */}
                    <div className="px-20 py-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Replies</h4>
                        <div className="space-y-3 mb-4">
                            {(localTicket.replies || []).length === 0 ? (
                                <p className="text-gray-400">No replies yet.</p>
                            ) : (
                                (localTicket.replies || []).map((r) => (
                                    <div key={r.id} className="bg-[#242424] p-3 rounded border border-[#383838]">
                                        <p className="text-sm text-gray-300">{r.message || r.reply || r.body}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatDate(r.created_at)}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="space-y-2">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full p-3 bg-transparent border border-[#929292] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#9155F7] min-h-[80px]"
                                placeholder="Write a reply..."
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={async () => {
                                        if (!replyText.trim()) return toast.error('Reply cannot be empty');
                                        setIsLoading(true);
                                        const res = await supportService.createReply(ticket.id, replyText.trim());
                                        setIsLoading(false);
                                        if (res.success) {
                                            toast.success('Reply posted');
                                            setReplyText('');
                                            const details = await supportService.getTicketDetails(ticket.id);
                                            if (details.success) setLocalTicket(details.data);
                                        } else {
                                            toast.error(res.error || 'Failed to post reply');
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#00C1C9] rounded text-black font-medium"
                                    disabled={isLoading}
                                >
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" />
        </div>
    );
};

export default SupportDetailsModal;