"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { authService } from '@/lib/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Call resend OTP API for password reset
      const result = await authService.resendOtp(email, 'password_reset');

      if (result.success) {
        toast.success(result.message || "OTP sent successfully!");
        setStep(2); // Move to OTP verification step
      } else {
        setError(result.error || "Failed to send OTP.");
        toast.error(result.error || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("OTP request error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp) {
      setError("Please enter the OTP.");
      toast.error("Please enter the OTP.");
      setLoading(false);
      return;
    }

    try {
      // Verify OTP for password reset
      const result = await authService.passwordResetVerifyOtp(email, otp);

      if (result.success) {
        toast.success(result.message || "OTP verified successfully!");
        setStep(3); // Move to new password step
      } else {
        setError(result.error || "Invalid OTP. Please try again.");
        toast.error(result.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const result = await authService.resendOtp(email, 'password_reset');
      
      if (result.success) {
        toast.success(result.message || "OTP resent successfully!");
      } else {
        toast.error(result.error || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("Please enter both new password and confirm password.");
      toast.error("Please enter both new password and confirm password.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      toast.error("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Confirm password reset with new password
      const result = await authService.passwordResetConfirm(
        email, 
        otp, 
        newPassword, 
        confirmPassword
      );

      if (result.success) {
        toast.success(result.message || "Password reset successfully!");
        // Redirect to login page
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setError(result.error || "Failed to reset password.");
        toast.error(result.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Step 1: Email Input */}
      {step === 1 && (
        <div className="backdrop-blur-custom p-8 rounded-2xl w-[562px] border border-[#FFFFFF4D]">
          <h2 className="text-white text-3xl font-bold text-center mb-8">
            Forgot Password
          </h2>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 text-white rounded-[6px] border border-[#DCDCDC] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              style={{
                width: "112px",
                height: "40px",
                boxShadow: "1.5px 1.5px 0px 0px #71F50C",
                border: "1px solid #00C1C9",
                borderRadius: "4px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              type="submit"
              className={`mx-auto text-[#00C1C9] font-semibold transition duration-300 ease-in-out
                ${loading ? "bg-gray-600 cursor-not-allowed" : ""}
              `}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <div className="p-8 rounded-2xl backdrop-blur-custom w-full max-w-md border border-gray-700 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">OTP Verification</h2>
          <p className="text-gray-300 mb-6">
            An OTP has been sent to <span className="font-semibold">{email}</span>.
            Please enter it below to proceed.
          </p>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-gray-400 text-sm font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full p-3 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-xl"
                placeholder="______"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            <button
              style={{
                width: "112px",
                height: "40px",
                boxShadow: "1.5px 1.5px 0px 0px #71F50C",
                border: "1px solid #00C1C9",
                borderRadius: "4px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: loading ? '#4B5563' : '#00C1C9',
              }}
              type="submit"
              className={`py-3 mx-auto text-white font-semibold transition duration-300 ease-in-out
                ${loading ? 'cursor-not-allowed' : 'hover:opacity-90'}
              `}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <p className="mt-6 text-gray-400 text-sm">
            Didn't receive the OTP?{' '}
            <button 
              onClick={handleResendOtp}
              disabled={loading}
              className="text-blue-400 hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          </p>
        </div>
      )}

      {/* Step 3: Set New Password */}
      {step === 3 && (
        <div className="backdrop-blur-custom p-8 rounded-2xl w-[562px] border border-[#FFFFFF4D] text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Set a New Password</h2>
          <p className="text-gray-300 text-sm mb-8">
            Create a new password. Ensure it differs from previous ones for security.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-white text-sm font-normal mb-2 text-left">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="w-full p-3 text-white rounded-lg border border-[#DBDBDB] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white text-sm font-normal mb-2 text-left">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full p-3 text-white rounded-lg border border-[#DBDBDB] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              style={{
                width: "180px",
                height: "40px",
                boxShadow: "1.5px 1.5px 0px 0px #71F50C",
                border: "1px solid #00C1C9",
                borderRadius: "4px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className={`mx-auto text-[#00C1C9] font-semibold transition duration-300 ease-in-out
                ${loading ? "bg-gray-600 cursor-not-allowed opacity-70" : "hover:opacity-90"}
              `}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}