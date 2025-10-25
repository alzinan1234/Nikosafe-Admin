"use client";

import { profileService } from "@/lib/profileService";
import React, { useState } from "react";


export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!currentPassword || !newPassword || !confirmedPassword) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmedPassword) {
      setMessage("New password and confirmed password do not match.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setMessageType("error");
      return;
    }

    setLoading(true);

    const result = await profileService.changePassword({
      oldPassword: currentPassword,
      newPassword: newPassword,
      newPassword2: confirmedPassword
    });

    if (result.success) {
      setMessage(result.message || "Password changed successfully!");
      setMessageType("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmedPassword("");
    } else {
      setMessage(result.error || "Failed to change password");
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col items-center">
      {message && (
        <div
          className={`w-full max-w-[982px] mb-4 p-3 rounded ${
            messageType === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500"
              : "bg-red-500/20 text-red-400 border border-red-500"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mb-4 w-full max-w-[982px]">
        <label
          htmlFor="currentPassword"
          className="block text-white text-sm font-bold mb-2"
        >
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="mb-4 w-full max-w-[982px]">
        <label
          htmlFor="newPassword"
          className="block text-white text-sm font-bold mb-2"
        >
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="mb-6 w-full max-w-[982px]">
        <label
          htmlFor="confirmedPassword"
          className="block text-white text-sm font-bold mb-2"
        >
          Confirmed Password
        </label>
        <input
          type="password"
          id="confirmedPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="flex items-center justify-center mt-6 md:w-[982px]">
        <button
          type="submit"
          className="bg-[#00C1C9] hover:bg-opacity-80 text-white font-bold w-full py-3 px-4 rounded-[4px] focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: "3px 3px 0px 0px #71F50C",
          }}
          disabled={loading}
        >
          {loading ? "Changing Password..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}