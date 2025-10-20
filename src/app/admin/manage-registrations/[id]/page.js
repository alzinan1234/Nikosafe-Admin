"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { registrationService } from '@/lib/registrationService';

import checkmarkIcon from "../../../../../public/icon/right.svg";
import crossIcon from "../../../../../public/icon/trash.svg";
import fileIcon from "../../../../../public/icon/file-icon.svg";

export default function RegistrationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch registration details
  useEffect(() => {
    fetchRegistrationDetails();
  }, [id]);

  const fetchRegistrationDetails = async () => {
    setLoading(true);
    try {
      const result = await registrationService.getRegistrationDetail(id);

      if (result.success) {
        setRegistration(result.data);
      } else {
        toast.error(result.error || 'Failed to load registration details');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load registration details');
    } finally {
      setLoading(false);
    }
  };

  // Handle Approve action
  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const result = await registrationService.updateRegistrationStatus(id, 'approve');

      if (result.success) {
        toast.success(result.message || 'Registration approved successfully');
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to approve registration');
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve registration');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject button click
  const handleRejectClick = () => {
    setShowRejectReasonModal(true);
  };

  // Handle submission of reject reason
  const handleSubmitRejectReason = async () => {
    if (rejectReason.trim() === "") {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    setActionLoading(true);
    try {
      const result = await registrationService.updateRegistrationStatus(
        id, 
        'reject', 
        rejectReason
      );

      if (result.success) {
        toast.success(result.message || 'Registration rejected successfully');
        setShowRejectReasonModal(false);
        setRejectReason("");
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to reject registration');
      }
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject registration');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Block button click
  const handleBlockClick = () => {
    setShowBlockModal(true);
  };

  // Handle submission of block reason
  const handleSubmitBlockReason = async () => {
    if (blockReason.trim() === "") {
      toast.error("Please provide a reason for blocking.");
      return;
    }

    setActionLoading(true);
    try {
      const result = await registrationService.updateRegistrationStatus(
        id, 
        'block', 
        blockReason
      );

      if (result.success) {
        toast.success(result.message || 'Registration blocked successfully');
        setShowBlockModal(false);
        setBlockReason("");
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to block registration');
      }
    } catch (error) {
      console.error('Block error:', error);
      toast.error('Failed to block registration');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Unblock
  const handleUnblock = async () => {
    setActionLoading(true);
    try {
      const result = await registrationService.updateRegistrationStatus(id, 'unblock');

      if (result.success) {
        toast.success(result.message || 'Registration unblocked successfully');
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to unblock registration');
      }
    } catch (error) {
      console.error('Unblock error:', error);
      toast.error('Failed to unblock registration');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#343434] text-white">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p>Loading registration details...</p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#343434] text-white">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="bg-[#1E1E1E] p-8 rounded-lg shadow-lg text-center border border-[#3A3A3A]">
          <h1 className="text-3xl font-bold mb-4">Registration Not Found</h1>
          <p className="text-gray-400 mb-6">
            The registration with ID &quot;{id}&quot; could not be found.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-[#00C1C9] hover:bg-[#009da3] text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#343434] p-4 sm:p-8">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Main Details Modal Container */}
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-md relative border border-[#3A3A3A] font-sans">
        {/* Close Button (X icon) */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Conditional Details Content based on registration type */}
        {registration.type === "Hospitality Venue" || registration.type === "Vendor" ? (
          // Vendor/Hospitality Venue Details
          <div className="text-white text-base sm:text-lg space-y-3 mt-4">
            <p>
              <span className="font-semibold text-[#00C1C9]">Name:</span> {registration.name}
            </p>
            <p>
              <span className="font-semibold text-[#00C1C9]">Email:</span> {registration.email}
            </p>
            <p>
              <span className="font-semibold text-[#00C1C9]">Phone number:</span>{" "}
              {registration.phone_number || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-[#00C1C9]">Location:</span>{" "}
              {registration.location || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-[#00C1C9]">Type:</span>{" "}
              <span className="text-[#FF4D00]">{registration.type}</span>
            </p>
            <p>
              <span className="font-semibold text-[#00C1C9]">Subscription Type:</span>{" "}
              {registration.subscription_type}
            </p>
            <p>
              <span className="font-semibold text-[#00C1C9]">Registration Date:</span>{" "}
              {registration.registration_date}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Verified:</span>{" "}
              {registration.is_verified ? (
                <Image src={checkmarkIcon} alt="Yes" width={20} height={20} />
              ) : (
                <Image src={crossIcon} alt="No" width={20} height={20} />
              )}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Active:</span>{" "}
              {registration.is_active ? (
                <Image src={checkmarkIcon} alt="Yes" width={20} height={20} />
              ) : (
                <Image src={crossIcon} alt="No" width={20} height={20} />
              )}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Blocked:</span>{" "}
              {registration.is_blocked ? (
                <Image src={checkmarkIcon} alt="Yes" width={20} height={20} />
              ) : (
                <Image src={crossIcon} alt="No" width={20} height={20} />
              )}
            </p>
          </div>
        ) : registration.type === "Service Provider" ? (
          // Service Provider Details
          <div className="text-white text-base sm:text-lg space-y-3 mt-4">
            <p>
              <span className="font-semibold text-white">Full Name:</span> {registration.name}
            </p>
            <p>
              <span className="font-semibold text-white">Email:</span> {registration.email}
            </p>
            <p>
              <span className="font-semibold text-white">Phone number:</span>{" "}
              {registration.phone_number || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-white">Location:</span>{" "}
              {registration.location || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-white">Type:</span>{" "}
              <span className="text-[#4976F4]">{registration.type}</span>
            </p>
            <p>
              <span className="font-semibold text-white">Subscription Type:</span>{" "}
              {registration.subscription_type}
            </p>
            <p>
              <span className="font-semibold text-white">Registration Date:</span>{" "}
              {registration.registration_date}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Verified:</span>{" "}
              {registration.is_verified ? (
                <Image src={checkmarkIcon} alt="Yes" width={20} height={20} />
              ) : (
                <Image src={crossIcon} alt="No" width={20} height={20} />
              )}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Active:</span>{" "}
              {registration.is_active ? (
                <Image src={checkmarkIcon} alt="Yes" width={20} height={20} />
              ) : (
                <Image src={crossIcon} alt="No" width={20} height={20} />
              )}
            </p>
          </div>
        ) : (
          // Basic User Details
          <div className="text-white text-base sm:text-lg space-y-3 mt-4">
            <p>
              <span className="font-semibold text-[#3CC668]">Name:</span> {registration.name}
            </p>
            <p>
              <span className="font-semibold text-white">Email:</span> {registration.email}
            </p>
            <p>
              <span className="font-semibold text-white">Phone number:</span>{" "}
              {registration.phone_number || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-white">Location:</span>{" "}
              {registration.location || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-white">Type:</span>{" "}
              <span className="text-[#3CC668]">{registration.type}</span>
            </p>
            <p>
              <span className="font-semibold text-white">Subscription Type:</span>{" "}
              {registration.subscription_type}
            </p>
            <p>
              <span className="font-semibold text-white">Registration Date:</span>{" "}
              {registration.registration_date}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Verified:</span>{" "}
              {registration.is_verified ? (
                <Image src={checkmarkIcon} alt="Yes" width={20} height={20} />
              ) : (
                <Image src={crossIcon} alt="No" width={20} height={20} />
              )}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Active:</span>{" "}
              {registration.is_active ? (
                <Image src={checkmarkIcon} alt="Yes" width={20} height={20} />
              ) : (
                <Image src={crossIcon} alt="No" width={20} height={20} />
              )}
            </p>
          </div>
        )}

        {/* Action Buttons at the bottom */}
        <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-[#3A3A3A]">
          {!registration.is_blocked ? (
            <>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex items-center bg-transparent border border-[#3CC668] text-[#3CC668] px-4 py-2 rounded-full hover:bg-[#3CC668] hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 inline-block mr-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {actionLoading ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={handleRejectClick}
                disabled={actionLoading}
                className="flex items-center bg-transparent border border-[#EF4444] text-[#EF4444] px-4 py-2 rounded-full hover:bg-[#EF4444] hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 inline-block mr-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
              <button
                onClick={handleBlockClick}
                disabled={actionLoading}
                className="flex items-center bg-transparent border border-[#FF9800] text-[#FF9800] px-4 py-2 rounded-full hover:bg-[#FF9800] hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 inline-block mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                Block
              </button>
            </>
          ) : (
            <button
              onClick={handleUnblock}
              disabled={actionLoading}
              className="flex items-center bg-transparent border border-[#3CC668] text-[#3CC668] px-6 py-2 rounded-full hover:bg-[#3CC668] hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 inline-block mr-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              {actionLoading ? "Processing..." : "Unblock"}
            </button>
          )}
        </div>
      </div>

      {/* Reject Reason Modal */}
      {showRejectReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-sm relative border border-[#3A3A3A] font-sans">
            <button
              onClick={() => {
                setShowRejectReasonModal(false);
                setRejectReason("");
              }}
              className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors"
              aria-label="Close reject reason modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-white text-xl font-semibold mb-4 text-center">
              Reason for Rejection
            </h2>
            <textarea
              className="w-full p-3 bg-[#343434] text-white rounded-md border border-[#3A3A3A] focus:outline-none focus:ring-1 focus:ring-[#00C1C9] mb-4 h-28 resize-none"
              placeholder="Enter rejection reason here..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectReasonModal(false);
                  setRejectReason("");
                }}
                className="bg-transparent border border-gray-600 text-gray-400 px-4 py-2 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRejectReason}
                disabled={actionLoading}
                className="bg-[#EF4444] text-white px-4 py-2 rounded-full hover:bg-[#DC2626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Reason Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-sm relative border border-[#3A3A3A] font-sans">
            <button
              onClick={() => {
                setShowBlockModal(false);
                setBlockReason("");
              }}
              className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors"
              aria-label="Close block reason modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-white text-xl font-semibold mb-4 text-center">
              Reason for Blocking
            </h2>
            <textarea
              className="w-full p-3 bg-[#343434] text-white rounded-md border border-[#3A3A3A] focus:outline-none focus:ring-1 focus:ring-[#00C1C9] mb-4 h-28 resize-none"
              placeholder="Enter blocking reason here..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockReason("");
                }}
                className="bg-transparent border border-gray-600 text-gray-400 px-4 py-2 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBlockReason}
                disabled={actionLoading}
                className="bg-[#FF9800] text-white px-4 py-2 rounded-full hover:bg-[#F57C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}