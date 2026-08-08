import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "../../context/LawyerContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import api from "../../api/axiosClient";
import Loader from "../../components/common/Loader";
import { Pencil, Save, X } from "lucide-react";
import { uploadToCloudinaryDirect } from "../../utils/directCloudinaryUpload";

const LawyerProfile = () => {
  const { profileData, setProfileData, getProfileData } =
    useContext(LawyerContext);
  const { currency, lawyerData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const updateProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available,
      };

      if (imageFile) {
        const { data: signature } = await api.post(
          "/api/lawyer/upload-signature",
        );
        if (!signature.success) {
          toast.error(signature.message || "Could not start image upload");
          return;
        }
        const cloudinaryResult = await uploadToCloudinaryDirect(
          imageFile,
          signature,
        );
        payload.imageUrl = cloudinaryResult.secure_url;
      }

      const { data } = await api.patch("/api/lawyer/update-profile", payload);

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        setImageFile(null);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setImageFile(null);
    getProfileData();
  };

  useEffect(() => {
    if (lawyerData) {
      getProfileData().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [lawyerData]);

  if (loading) return <Loader />;

  if (!profileData) {
    return (
      <div className="flex justify-center items-center m-5 h-64">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Unable to load profile data</p>
          <button
            onClick={() => {
              setLoading(true);
              getProfileData().finally(() => setLoading(false));
            }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 px-4 py-6 sm:px-6 md:px-8 max-w-2xl">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm md:text-base">
          View and manage your professional information.
        </p>
      </div>

      {/* ── Identity Row ── */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8 text-center sm:text-left">
        <div className="relative inline-block shrink-0">
          <label htmlFor="profile-image">
            <img
              src={
                imageFile ? URL.createObjectURL(imageFile) : profileData.image
              }
              alt={profileData.name}
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover object-top bg-gray-100 ${isEdit ? "cursor-pointer opacity-80 hover:opacity-100 transition-opacity" : ""}`}
            />
            {isEdit && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Change
                </span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="profile-image"
            hidden
            disabled={!isEdit}
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 break-words">
            {profileData.name}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg mt-1 break-words">
            {profileData.degree} &mdash; {profileData.speciality}
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#F2F3FF] text-primary border border-primary/20 rounded-full text-xs font-semibold">
            {profileData.experience}
          </span>
        </div>
      </div>

      <hr className="border-gray-100 mb-8" />

      {/* ── About ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            About
          </p>
          <div className="flex items-center gap-2">
            {isEdit ? (
              <>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <X size={15} />
                  Cancel
                </button>
                <button
                  onClick={updateProfile}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  <Save size={15} />
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Pencil size={15} />
                Edit
              </button>
            )}
          </div>
        </div>
        {isEdit ? (
          <textarea
            value={profileData.about}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, about: e.target.value }))
            }
            rows={6}
            placeholder="Write a professional bio..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
          />
        ) : (
          <p className="text-base text-gray-700 leading-relaxed">
            {profileData.about || (
              <span className="text-gray-400 italic">No bio added yet.</span>
            )}
          </p>
        )}
      </div>

      <hr className="border-gray-100 mb-8" />

      {/* ── Appointment Fee ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Appointment Fee
        </p>
        {isEdit ? (
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500 font-medium">
              {currency}
            </span>
            <input
              type="number"
              value={profileData.fees}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, fees: e.target.value }))
              }
              className="w-36 px-3 py-2 border border-gray-200 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        ) : (
          <p className="text-lg font-semibold text-gray-800">
            {currency} {profileData.fees}
          </p>
        )}
      </div>

      <hr className="border-gray-100 mb-8" />

      {/* ── Office Address ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Office Address
        </p>
        {isEdit ? (
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              placeholder="Location / Street"
              value={profileData.address?.Location || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  address: { ...prev.address, Location: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            <input
              type="text"
              placeholder="City"
              value={profileData.address?.City || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  address: { ...prev.address, City: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            <input
              type="text"
              placeholder="State"
              value={profileData.address?.State || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  address: { ...prev.address, State: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        ) : (
          <div className="text-base text-gray-700 leading-7">
            <p>{profileData.address?.Location || "—"}</p>
            <p>{profileData.address?.City || "—"}</p>
            <p>{profileData.address?.State || "—"}</p>
          </div>
        )}
      </div>

      <hr className="border-gray-100 mb-8" />

      {/* ── Availability ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Availability
        </p>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={profileData.available}
              disabled={!isEdit}
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors duration-200 peer-checked:bg-green-500 bg-gray-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm ${!isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </label>
          <span
            className={`text-base font-medium ${profileData.available ? "text-green-600" : "text-gray-400"}`}
          >
            {profileData.available
              ? "Available for appointments"
              : "Not accepting appointments"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;
