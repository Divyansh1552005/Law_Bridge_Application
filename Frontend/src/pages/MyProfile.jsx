import React, { useState, useEffect } from "react";
import useApp from "../context/useApp";
import DeleteAccountModal from "./DeleteAccountModal";
import {
  updateUserProfile,
  getUserUploadSignature,
  forgotPassword,
} from "../api/user.api";
import { toast } from "react-toastify";
import { setup2FA, verify2FA, disable2FA } from "../api/user.api";
import { exportAllChats } from "../api/chat.api";
import { getUserDocuments, getDocumentSignedUrl } from "../api/document.api";
import { uploadToCloudinaryDirect } from "../utils/directCloudinaryUpload";
import { KeyRound, Shield, Trash2, Download, FileText, AlertTriangle } from "lucide-react";

import Setup2FAModal from "../components/two_fa/Setup2FAModal";
import Verify2FAModal from "../components/two_fa/Verify2FAModal";
import Disable2FAModal from "../components/two_fa/Disable2FAModal";

/* ================= IMAGE VALIDATION CONFIG ================= */
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const MyProfile = () => {
  const { userData, setUserData, loadUserProfileData } = useApp();

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setup2FAData, setSetup2FAData] = useState(null);
  const [showVerify2FA, setShowVerify2FA] = useState(false);
  const [showDisable2FA, setShowDisable2FA] = useState(false);
  const [isExporting, setIsExporting] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [uploadsRemaining, setUploadsRemaining] = useState(2);
  const [activeSection, setActiveSection] = useState("personal");
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  /* ================= LOAD FRESH USER DATA ON MOUNT ================= */
  useEffect(() => {
    loadUserProfileData();
  }, []);

  // image change type
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // type check
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed");
      e.target.value = "";
      return;
    }

    // size check
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image size must be less than 2MB");
      e.target.value = "";
      return;
    }

    setImage(file);
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data } = await getUserDocuments();
        if (data.success) {
          setUserDocuments(data.documents);
          setUploadsRemaining(data.uploadsRemaining);
        }
      } catch {
        // silently fail
      } finally {
        setDocumentsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // profile update handler
  const updateUserProfileData = async () => {
    try {
      if (image && image.size > MAX_SIZE_BYTES) {
        toast.error("Invalid image selected");
        return;
      }

      setProfileUpdateLoading(true);

      let imageUrl;
      if (image) {
        const { data: signature } = await getUserUploadSignature();
        if (!signature.success) {
          toast.error(signature.message || "Could not start image upload");
          return;
        }
        const cloudinaryResult = await uploadToCloudinaryDirect(
          image,
          signature,
        );
        imageUrl = cloudinaryResult.secure_url;
      }

      const payload = {
        name: userData.name,
        phone: userData.phone,
        address: {
          Location: userData.address?.Location ?? "",
          City: userData.address?.City ?? "",
          State: userData.address?.State ?? "",
        },
        gender: userData.gender,
        dob: userData.dob,
      };
      if (imageUrl) payload.imageUrl = imageUrl;

      const { data } = await updateUserProfile(payload);

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Profile update failed");
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  // documents are private on Cloudinary — fetch a fresh short-lived signed URL to view
  const handleViewDocument = async (documentId) => {
    try {
      const { data } = await getDocumentSignedUrl(documentId);
      if (data.success) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error(data.message || "Could not open document");
      }
    } catch {
      toast.error("Could not open document");
    }
  };

  // reset password handler
  const handlePasswordReset = async () => {
    setResetLoading(true);
    try {
      const { data } = await forgotPassword(userData.email);
      toast.success(data.message || "Password reset email sent!");
    } catch {
      toast.error("Could not send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  // handlers for 2fa

  const handleEnable2FA = async () => {
    try {
      const { data } = await setup2FA();
      setSetup2FAData(data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Could not start 2FA setup";
      toast.error(message);
      console.error("2FA Setup Error:", error.response?.data);
    }
  };

  const handleVerify2FA = async (code) => {
    try {
      const { data } = await verify2FA(code);
      toast.success(data.message || "2FA enabled successfully");
      setSetup2FAData(null);
      setShowVerify2FA(false);
      await loadUserProfileData();
    } catch (error) {
      const message = error.response?.data?.message || "Invalid 2FA code";
      toast.error(message);
      console.error("2FA Verification Error:", error.response?.data);
    }
  };

  const handleDisable2FA = async (payload) => {
    try {
      const { data } = await disable2FA(payload);
      toast.success(data.message || "2FA disabled successfully");
      setShowDisable2FA(false);
      await loadUserProfileData();
    } catch (error) {
      const message = error.response?.data?.message || "Could not disable 2FA";
      toast.error(message);
      console.error("2FA Disable Error:", error.response?.data);
    }
  };

  // handler for exporting chat
  const handleExport = async (format) => {
    try {
      setIsExporting(format);
      const response = await exportAllChats(format);
      const extension = format === "pdf" ? "pdf" : "json";
      const mimeType =
        format === "pdf" ? "application/pdf" : "application/json";
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: mimeType }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `lawbridge-chats-${Date.now()}.${extension}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to export chats");
    } finally {
      setIsExporting(null);
    }
  };

  if (!userData) return null;

  const menuItems = [
    {
      id: "personal",
      label: "Personal Information",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "security",
      label: "Account Security",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: "data",
      label: "My Data",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          My Profile
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      {/* ================= MAIN CONTENT WITH SIDEBAR ================= */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* ================= SIDEBAR NAVIGATION (LEFT) ================= */}
        <div className="lg:w-72 flex-shrink-0 lg:order-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-3 lg:sticky lg:top-6">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsEdit(false);
                    setImage(null);
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-left transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                      : "text-gray-600 hover:bg-gray-50 hover:scale-[1.01]"
                  }`}
                >
                  <div className={`flex-shrink-0 ${activeSection === item.id ? "scale-110" : ""} transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ================= CONTENT AREA (RIGHT) ================= */}
        <div className="flex-1 min-w-0 lg:order-2">
          {activeSection === "personal" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
                Personal Information
              </h2>

              {/* Profile Photo and Name Section */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-10 pb-8 border-b border-gray-200">
                <label className={`relative group flex-shrink-0 ${isEdit ? "cursor-pointer" : ""}`}>
                  <img
                    src={image ? URL.createObjectURL(image) : userData.image}
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-primary/30 shadow-md"
                    alt="Profile"
                  />
                  {isEdit && (
                    <>
                      <input
                        type="file"
                        hidden
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                      />
                      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-white mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-white text-xs font-medium">
                            Change Photo
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </label>

                <div className="flex-1 text-center sm:text-left">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide block mb-3">
                    Full Name
                  </label>
                  {isEdit ? (
                    <input
                      className="text-lg md:text-xl font-bold border-2 border-gray-300 rounded-lg w-full px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-transparent transition-all"
                      value={userData.name}
                      placeholder="Enter your name"
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  ) : (
                    <p className="text-lg md:text-xl font-bold text-gray-800 mb-2">{userData.name}</p>
                  )}
                  <p className="text-sm md:text-base text-gray-500 mt-3">{userData.email}</p>
                  {userData.authProvider === "google" && (
                    <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                      <svg className="w-4 h-4" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.08-6.08C34.5 3.1 29.56 1 24 1 14.82 1 7.02 6.48 3.44 14.26l7.08 5.5C12.3 13.62 17.7 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.5 24.5c0-1.56-.14-3.08-.4-4.5H24v9h12.67c-.55 2.96-2.2 5.48-4.67 7.17l7.17 5.57C43.5 38.1 46.5 31.8 46.5 24.5z"/>
                        <path fill="#FBBC05" d="M10.52 28.76A14.6 14.6 0 0 1 9.5 24c0-1.66.29-3.26.8-4.76l-7.08-5.5A23.9 23.9 0 0 0 1 24c0 3.86.92 7.5 2.56 10.72l6.96-5.96z"/>
                        <path fill="#34A853" d="M24 47c5.56 0 10.22-1.84 13.63-5l-7.17-5.57C28.78 37.7 26.52 38.5 24 38.5c-6.3 0-11.65-4.12-13.48-9.74l-6.96 5.96C7.06 42.56 14.84 47 24 47z"/>
                      </svg>
                      <span className="text-xs font-medium text-blue-700">Google Account</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto sm:flex-shrink-0">
                  {isEdit ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEdit(false);
                          setImage(null);
                        }}
                        className="flex-1 sm:flex-none px-5 md:px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateUserProfileData}
                        disabled={profileUpdateLoading}
                        className="flex-1 sm:flex-none px-5 md:px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {profileUpdateLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEdit(true)}
                      className="w-full sm:w-auto px-5 md:px-6 py-2.5 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Other Personal Info Fields */}
              <div className="space-y-6 max-w-2xl">
                {/* Phone */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Phone Number
                  </label>
                  {isEdit ? (
                    <input
                      className="w-full mt-3 border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      value={userData.phone || ""}
                      maxLength="10"
                      placeholder="Enter phone number"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          phone: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-3 text-lg text-gray-800">{userData.phone || "Not provided"}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Gender
                  </label>
                  {isEdit ? (
                    <select
                      className="w-full mt-3 border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      value={userData.gender}
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, gender: e.target.value }))
                      }
                    >
                      <option>Not Selected</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Others</option>
                      <option>Rather Not Say</option>
                    </select>
                  ) : (
                    <p className="mt-3 text-lg text-gray-800">{userData.gender}</p>
                  )}
                </div>

                {/* DOB */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Date of Birth
                  </label>
                  {isEdit ? (
                    <input
                      type="date"
                      className="w-full mt-3 border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      value={userData.dob || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, dob: e.target.value }))
                      }
                    />
                  ) : (
                    <p className="mt-3 text-lg text-gray-800">{userData.dob || "Not selected"}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Address
                  </label>
                  {isEdit ? (
                    <div className="space-y-3 mt-3">
                      <input
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Location / Street"
                        value={userData.address?.Location ?? ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, Location: e.target.value },
                          }))
                        }
                      />
                      <input
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="City"
                        value={userData.address?.City ?? ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, City: e.target.value },
                          }))
                        }
                      />
                      <input
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="State"
                        value={userData.address?.State ?? ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, State: e.target.value },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <p className="mt-3 text-lg text-gray-800">
                      {userData.address?.Location || "—"}
                      {userData.address?.City ? `, ${userData.address.City}` : ""}
                      {userData.address?.State ? `, ${userData.address.State}` : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
                Account Security
              </h2>

              {/* Password Reset */}
              <div className="mb-8">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-primary" />
                  Password Management
                </h3>
                {userData.authProvider !== "google" ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 border border-gray-200">
                    <p className="text-sm md:text-base font-medium text-gray-800 mb-2">Password Reset</p>
                    <p className="text-xs md:text-sm text-gray-600 mb-4">
                      Reset your password via email verification
                    </p>
                    <button
                      onClick={handlePasswordReset}
                      disabled={resetLoading}
                      className="w-full sm:w-auto px-5 md:px-8 py-2.5 md:py-3 rounded-lg bg-primary text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {resetLoading ? "Sending..." : "Reset Password"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
                    <p className="text-sm md:text-base font-semibold text-blue-800 mb-2">
                      Signed in with Google
                    </p>
                    <p className="text-xs md:text-sm text-blue-600">
                      Password management is handled by your Google account.
                    </p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* Two-Factor Authentication */}
              <div className="mb-8">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Two-Factor Authentication
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 border border-gray-200">
                  <p className="text-sm md:text-base font-medium text-gray-800 mb-2">Two-Factor Authentication</p>
                  <p className="text-xs md:text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>

                  {!userData.twoFactorEnabled ? (
                    <button
                      onClick={handleEnable2FA}
                      className="w-full sm:w-auto px-5 md:px-8 py-2.5 md:py-3 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white shadow-md hover:shadow-lg transition-all"
                    >
                      Enable 2FA
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowDisable2FA(true)}
                      className="w-full sm:w-auto px-5 md:px-8 py-2.5 md:py-3 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all"
                    >
                      Disable 2FA
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* Danger Zone */}
              <div>
                <h3 className="text-base md:text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-700" />
                  Danger Zone
                </h3>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 md:p-6 border-2 border-red-200">
                  <p className="text-sm md:text-base font-medium text-red-700 mb-2">Delete Account</p>
                  <p className="text-xs md:text-sm text-red-600 mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full sm:w-auto px-5 md:px-8 py-2.5 md:py-3 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "data" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
                My Data
              </h2>

              {/* Privacy Disclaimer */}
              <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-900" />
                  Your Privacy Matters
                </h3>
                <div className="text-xs md:text-sm text-blue-800 space-y-2">
                  <p>
                    <span className="font-semibold">Data Deletion:</span> Upon account deletion, all your data including uploaded documents, chat history, appointments, and personal information will be permanently deleted from our servers.
                  </p>
                  <p>
                    <span className="font-semibold">No Data Selling:</span> We never sell your data to third parties or use it to train our AI models. Your information is used solely to provide you with our legal services.
                  </p>
                </div>
              </div>

              {/* Export Data */}
              <div className="mb-8">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Export Your Data
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 border border-gray-200">
                  <p className="text-sm md:text-base font-medium text-gray-800 mb-2">Download Chat History</p>
                  <p className="text-xs md:text-sm text-gray-600 mb-4">
                    Download all your chats in JSON or PDF format
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleExport("json")}
                      disabled={isExporting}
                      className="flex-1 sm:flex-none px-5 md:px-6 py-2.5 md:py-3 rounded-lg bg-primary text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isExporting === "json" ? "Exporting..." : "Export JSON"}
                    </button>
                    <button
                      onClick={() => handleExport("pdf")}
                      disabled={isExporting}
                      className="flex-1 sm:flex-none px-5 md:px-6 py-2.5 md:py-3 rounded-lg bg-primary text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isExporting === "pdf" ? "Exporting..." : "Export PDF"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* My Documents */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      My Documents
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Documents uploaded for legal Q&A analysis
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold px-4 py-2 rounded-lg w-fit ${
                      uploadsRemaining === 0
                        ? "bg-red-50 text-red-600 border-2 border-red-200"
                        : "bg-purple-50 text-purple-600 border-2 border-purple-200"
                    }`}
                  >
                    {uploadsRemaining}/2 uploads remaining today
                  </span>
                </div>

                {documentsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : userDocuments.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-base font-medium">No documents uploaded yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Upload documents from the chat to use them in Q&A
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {userDocuments.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl px-6 py-5 border border-gray-200 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span
                            className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg uppercase shadow-sm ${
                              doc.fileType === "pdf"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : doc.fileType === "docx"
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : doc.fileType === "txt"
                                    ? "bg-gray-200 text-gray-700 border border-gray-300"
                                    : "bg-green-100 text-green-700 border border-green-200"
                            }`}
                          >
                            {doc.fileType}
                          </span>

                          <div className="min-w-0">
                            <p className="text-base font-semibold text-gray-800 truncate">
                              {doc.filename}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                              {" · "}
                              {doc.chunksStored} chunks indexed
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleViewDocument(doc._id)}
                          className="flex-shrink-0 w-full sm:w-auto text-center px-6 py-2.5 text-sm font-medium text-primary bg-white border-2 border-primary rounded-lg hover:bg-primary hover:text-white shadow-sm hover:shadow-md transition-all"
                        >
                          View Document
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}

      {setup2FAData && (
        <Setup2FAModal
          qrCode={setup2FAData.qrCode}
          manualKey={setup2FAData.manualKey}
          onNext={() => setShowVerify2FA(true)}
          onClose={() => setSetup2FAData(null)}
        />
      )}

      {showVerify2FA && (
        <Verify2FAModal
          onVerify={handleVerify2FA}
          onClose={() => setShowVerify2FA(false)}
        />
      )}

      {showDisable2FA && (
        <Disable2FAModal
          onDisable={handleDisable2FA}
          onClose={() => setShowDisable2FA(false)}
          isGoogleUser={userData.authProvider === "google"}
        />
      )}
    </div>
  );
};

export default MyProfile;
