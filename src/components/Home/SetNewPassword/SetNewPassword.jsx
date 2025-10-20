'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirection after password update
import toast, { Toaster } from 'react-hot-toast'; // For toast notifications
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Install if you want actual icons

export default function SetNewPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (!newPassword || !confirmPassword) {
      setError('Please enter both new password and confirm password.');
      toast.error('Please enter both new password and confirm password.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      toast.error('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) { // Basic password length check
      setError('Password must be at least 6 characters long.');
      toast.error('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    console.log('Attempting to update password with:', newPassword);

    try {
      // --- Simulate API Call to Update Password ---
      // In a real application, you would send the new password (and a verification token
      // received from the OTP verification) to your backend:
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: 'user@example.com', newPassword, token: 'your_otp_token' }),
      // });
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate successful password update
      if (newPassword === "newpassword123") { // Example success condition
        toast.success('Password updated successfully! Redirecting to login...');
        console.log('Password updated successfully!');
        // Redirect to login page after successful password update
        router.push('/');
      } else {
        setError('Failed to update password. Please try again. (Simulated)');
        toast.error('Failed to update password. Please try again.');
      }
    } catch (err) {
      console.error('Password update error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      // Background style to match the overall theme, as in previous components
    
    >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="backdrop-blur-custom p-8 rounded-2xl w-[562px] border border-[#FFFFFF4D] text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Set a New Password</h2>
        <p className="text-gray-300 text-sm mb-8">
          Create a new password. Ensure it differs from previous ones of security.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              {/* Optional: Eye icon for toggling password visibility. You might need to install Heroicons or use an SVG. */}
              {/* If you use Heroicons: npm install @heroicons/react */}
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
              border:"1px solid #00C1C9",
             // Solid green-teal color as per image
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
    </div>
  );
}