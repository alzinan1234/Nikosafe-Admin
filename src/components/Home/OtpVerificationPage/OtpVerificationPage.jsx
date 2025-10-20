'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Child component that uses useSearchParams
function OtpVerificationForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setVerificationError(''); // Clear previous internal error message
    setVerificationLoading(true);

    if (!otp) {
      setVerificationError('Please enter the OTP.');
      toast.error('Please enter the OTP.'); // Show toast for this validation
      setVerificationLoading(false);
      return;
    }

    console.log(`Verifying OTP: ${otp} for email: ${email}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call delay

      if (otp === '123456') { // Simulated successful OTP
        toast.success('OTP Verified! Redirecting to password reset...');
        router.push(`/set-new-password?email=${encodeURIComponent(email || '')}`); // Ensure email is encoded and handled if null
      } else { // Simulated invalid OTP
        setVerificationError('Invalid OTP. Please try again. (Simulated)');
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setVerificationError('An error occurred during OTP verification.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl backdrop-blur-custom w-full max-w-md border border-gray-700 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">OTP Verification</h2>
      <p className="text-gray-300 mb-6">
        An OTP has been sent to <span className="font-semibold">{email || 'your email'}</span>.
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

        {verificationError && (
          <p className="text-red-400 text-sm text-center">
            {verificationError}
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
            // Adjusted background style for the button to match your previous LoginPage's button
            background: verificationLoading ? '#4B5563' : '#00C1C9',
          }}
          type="submit"
          className={`py-3 mx-auto text-white font-semibold transition duration-300 ease-in-out
            ${verificationLoading ? 'cursor-not-allowed' : 'hover:opacity-90'}
          `}
          disabled={verificationLoading}
        >
          {verificationLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <p className="mt-6 text-gray-400 text-sm">
        Didn't receive the OTP? <Link href="#" className="text-blue-400 hover:underline">Resend OTP</Link>
      </p>
    </div>
  );
}

// Parent component with Suspense
export default function OtpVerificationPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      // Assuming you want a background style similar to your LoginPage
      style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%), url("/image/your-background-image.jpg")', // Replace with your actual background image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <OtpVerificationForm />
      </Suspense>
    </div>
  );
}