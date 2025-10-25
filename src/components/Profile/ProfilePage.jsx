
"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { profileService } from "@/lib/profileService";

// Separate ChangePasswordForm component
function ChangePasswordForm() {
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
        <label htmlFor="currentPassword" className="block text-white text-sm font-bold mb-2">
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
        <label htmlFor="newPassword" className="block text-white text-sm font-bold mb-2">
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
        <label htmlFor="confirmedPassword" className="block text-white text-sm font-bold mb-2">
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
          style={{ boxShadow: "3px 3px 0px 0px #71F50C" }}
          disabled={loading}
        >
          {loading ? "Changing Password..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// Main ProfilePage component
export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("changePassword");
  const [profileImage, setProfileImage] = useState("/image/userImage.png");
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fileInputRef = useRef(null);

  // Profile form fields
  const [formData, setFormData] = useState({
    venue_name: "",
    hospitality_venue_type: "restaurant",
    capacity: "",
    hours_of_operation: "",
    location: "",
    mobile_number: "",
  });

  const handleBackClick = () => {
    router.back();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage("Please select a valid image file");
        setMessageType("error");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should not exceed 5MB");
        setMessageType("error");
        return;
      }

      const newImageUrl = URL.createObjectURL(file);
      setProfileImage(newImageUrl);
      setProfileFile(file);
      setMessage("");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = { ...formData };
      
      // Add profile picture if selected
      if (profileFile) {
        submitData.profile_picture = profileFile;
      }

      const result = await profileService.updateProfile(submitData);

      if (result.success) {
        setMessage(result.message || "Profile updated successfully!");
        setMessageType("success");
        setProfileFile(null);
      } else {
        setMessage(result.error || "Failed to update profile");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.message || "An error occurred");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#343434] text-white flex justify-center items-start pt-8 pb-8 rounded-lg">
      <div className="flex items-center gap-4 cursor-pointer ml-5" onClick={handleBackClick}>
        <div>
          <ArrowLeft className="text-white bg-[#FFFFFF1A] rounded-full p-2" size={40} />
        </div>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="p-6">
          <div className="flex justify-center gap-[18px] items-center mb-6">
            <div className="relative rounded-full border-4 border-gray-600 cursor-pointer" onClick={handleImageClick}>
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <Image
                  src={profileImage}
                  alt="User Profile"
                  width={100}
                  height={100}
                  className="rounded-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-[#343434]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-7.793 7.793a.5.5 0 01-.128.093l-3 1a.5.5 0 01-.611-.611l1-3a.5.5 0 01.093-.128l7.793-7.793zM10.707 6.293a1 1 0 00-1.414 1.414L12 9.414l1.293-1.293a1 1 0 00-1.414-1.414L10.707 6.293z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className="flex flex-col gap-[12px]">
              <h2 className="text-[24px] font-bold mt-3 text-white">Lukas Wagner</h2>
              <p className="text-white font-[400] text-xl">Admin</p>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              className={`py-2 px-6 text-[16px] font-semibold ${
                activeTab === "editProfile"
                  ? "border-b-2 border-[#17787C] text-[#17787C]"
                  : "text-white hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </button>
            <button
              className={`py-2 px-6 text-[16px] font-semibold ${
                activeTab === "changePassword"
                  ? "border-b-2 border-[#17787C] text-[#17787C]"
                  : "text-white hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("changePassword")}
            >
              Change Password
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/png, image/jpeg, image/jpg"
          />

          {activeTab === "editProfile" && (
            <div className="p-6 flex flex-col items-center">
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

              <form onSubmit={handleProfileSubmit} className="w-full max-w-[982px]">
                <div className="mb-4">
                  <label htmlFor="venue_name" className="block text-white text-sm font-bold mb-2">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    id="venue_name"
                    name="venue_name"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3]"
                    value={formData.venue_name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="hospitality_venue_type" className="block text-white text-sm font-bold mb-2">
                    Venue Type
                  </label>
                  <input
                    type="text"
                    id="hospitality_venue_type"
                    name="hospitality_venue_type"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3]"
                    value={formData.hospitality_venue_type}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="capacity" className="block text-white text-sm font-bold mb-2">
                    Capacity
                  </label>
                  <input
                    type="text"
                    id="capacity"
                    name="capacity"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3]"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="hours_of_operation" className="block text-white text-sm font-bold mb-2">
                    Hours of Operation
                  </label>
                  <input
                    type="text"
                    id="hours_of_operation"
                    name="hours_of_operation"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3]"
                    value={formData.hours_of_operation}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="location" className="block text-white text-sm font-bold mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3]"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="mobile_number" className="block text-white text-sm font-bold mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="mobile_number"
                    name="mobile_number"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent text-white leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3]"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-[#00C1C9] hover:bg-opacity-80 text-white font-bold w-full py-3 px-4 rounded-[4px] focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ boxShadow: "3px 3px 0px 0px #71F50C" }}
                    disabled={loading}
                  >
                    {loading ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "changePassword" && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
}