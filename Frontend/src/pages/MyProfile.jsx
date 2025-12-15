import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import DeleteAccountModal from './DeleteAccountModal'
import api from '../api/axiosClient'
import { toast } from 'react-toastify'

const MyProfile = () => {

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)
  const [resetLoading, setResetLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // ================= UPDATE PROFILE =================
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      image && formData.append('image', image)

      const { data } = await api.patch(
        backendUrl + '/api/user/update-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(null)
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Profile update failed')
    }
  }

  // ================= RESET PASSWORD =================
  const handlePasswordReset = async () => {
    setResetLoading(true)
    try {
      const { data } = await api.post(
        backendUrl + '/api/user/forgot-password',
        { email: userData.email }
      )
      toast.success(data.message || 'Password reset email sent!')
    } catch {
      toast.error('Could not send reset email')
    } finally {
      setResetLoading(false)
    }
  }

  if (!userData) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
        {isEdit ? (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEdit(false)}
              className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={updateUserProfileData}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/30 hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2.5 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 flex flex-col md:flex-row gap-8 items-center">

        <label className={`relative group ${isEdit ? 'cursor-pointer' : ''}`}>
          <img
            src={image ? URL.createObjectURL(image) : userData.image}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/20"
            alt="Profile"
          />
          {isEdit && (
            <>
              <input
                type="file"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  Change Photo
                </span>
              </div>
            </>
          )}
        </label>

        <div className="flex-1 space-y-3 text-center md:text-left">
          {isEdit ? (
            <input
              className="text-3xl font-bold border-b-2 border-gray-300 w-full focus:outline-none focus:border-primary bg-transparent"
              value={userData.name}
              onChange={(e) =>
                setUserData(prev => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="text-3xl font-bold text-gray-800">
              {userData.name}
            </p>
          )}
          <p className="text-gray-500 text-lg">{userData.email}</p>
        </div>
      </div>

      {/* ================= PERSONAL INFO ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Personal Information
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Phone Number
            </label>
            {isEdit ? (
              <input
                className="w-full mt-2 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                value={userData.phone || ''}
                maxLength="10"
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    phone: e.target.value.replace(/\D/g, '')
                  }))
                }
              />
            ) : (
              <p className="mt-2 text-lg">
                {userData.phone || 'Not provided'}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Gender
            </label>
            {isEdit ? (
              <select
                className="w-full mt-2 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                value={userData.gender}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, gender: e.target.value }))
                }
              >
                <option>Not Selected</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
                <option>Rather Not Say</option>
              </select>
            ) : (
              <p className="mt-2 text-lg">{userData.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Date of Birth
            </label>
            {isEdit ? (
              <input
                type="date"
                className="w-full mt-2 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                value={userData.dob || ''}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="mt-2 text-lg">
                {userData.dob || 'Not selected'}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Address
            </label>
            {isEdit ? (
              <div className="space-y-3 mt-2">
                <input
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Address Line 1"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))
                  }
                />
                <input
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Address Line 2"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))
                  }
                />
              </div>
            ) : (
              <p className="mt-2 text-lg">
                {userData.address.line1}<br />
                {userData.address.line2}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ================= ACCOUNT SECURITY ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Account Security
        </h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gray-50 rounded-xl p-6">
          <div>
            <p className="text-lg font-medium">Password Reset</p>
            <p className="text-sm text-gray-500">
              Reset your password via email verification
            </p>
          </div>
          <button
            onClick={handlePasswordReset}
            disabled={resetLoading}
            className="px-8 py-3 rounded-lg bg-primary text-white font-medium disabled:opacity-60 shadow-lg shadow-primary/30"
          >
            {resetLoading ? 'Sending...' : 'Reset Password'}
          </button>
        </div>
      </div>

      {/* ================= DANGER ZONE ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Danger Zone
        </h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-red-50 rounded-xl p-6 border border-red-200">
          <div>
            <p className="text-lg font-medium text-red-600">Delete Account</p>
            <p className="text-sm text-red-500 max-w-2xl">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-8 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}

    </div>
  )
}

export default MyProfile