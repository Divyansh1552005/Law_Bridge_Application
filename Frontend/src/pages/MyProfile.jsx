import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import api from '../api/axiosClient'
import { toast } from 'react-toastify'

const MyProfile = () => {

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)
  const [resetLoading, setResetLoading] = useState(false)

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
              className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={updateUserProfileData}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/30"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2.5 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all duration-200"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 flex flex-col md:flex-row gap-8 items-center hover:shadow-xl transition-shadow duration-300">

        <label className={`relative group ${isEdit ? 'cursor-pointer' : ''}`}>
          <img
            src={image ? URL.createObjectURL(image) : userData.image}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
            alt="Profile"
          />
          {isEdit && (
            <>
              <input
                type="file"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Change Photo</span>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-primary text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                📷
              </span>
            </>
          )}
        </label>

        <div className="flex-1 space-y-3 text-center md:text-left">
          {isEdit ? (
            <input
              className="text-3xl font-bold border-b-2 border-gray-300 w-full focus:outline-none focus:border-primary transition-colors duration-200 bg-transparent"
              value={userData.name}
              onChange={(e) =>
                setUserData(prev => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="text-3xl font-bold text-gray-800">{userData.name}</p>
          )}
          <p className="text-gray-500 text-lg flex items-center gap-2 justify-center md:justify-start">
            <span>✉️</span>
            {userData.email}
          </p>
        </div>
      </div>

      {/* ================= PERSONAL INFO ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <span>👤</span>
          Personal Information
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone Number</label>
            {isEdit ? (
              <input
                className="w-full mt-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors duration-200"
                placeholder="Enter phone number"
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
              <p className="mt-1 text-gray-800 text-lg font-medium">{userData.phone || 'Not provided'}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Gender</label>
            {isEdit ? (
              <select
                className="w-full mt-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors duration-200 bg-white"
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
              <p className="mt-1 text-gray-800 text-lg font-medium">{userData.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Date of Birth</label>
            {isEdit ? (
              <input
                type="date"
                className="w-full mt-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors duration-200"
                value={userData.dob || ''}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="mt-1 text-gray-800 text-lg font-medium">{userData.dob || 'Not selected'}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address</label>
            {isEdit ? (
              <div className="space-y-3 mt-1">
                <input
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors duration-200"
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
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors duration-200"
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
              <p className="mt-1 text-gray-800 text-lg font-medium leading-relaxed">
                {userData.address.line1}<br />
                {userData.address.line2}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ================= ACCOUNT SECURITY ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span>🔐</span>
          Account Security
        </h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gray-50 rounded-xl p-6">
          <div>
            <p className="text-gray-800 font-medium text-lg">Password Reset</p>
            <p className="text-gray-500 text-sm mt-1">Reset your password via email verification</p>
          </div>
          <button
            onClick={handlePasswordReset}
            disabled={resetLoading}
            className="px-8 py-3 rounded-lg bg-primary text-white font-medium disabled:opacity-60 hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/30 whitespace-nowrap"
          >
            {resetLoading ? 'Sending...' : 'Reset Password'}
          </button>
        </div>
      </div>

    </div>
  )
}

export default MyProfile