import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import api from '../api/axiosClient'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)

    const [image, setImage] = useState(false)



    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            // if user wanna update image only then we append it to formData
            image && formData.append('image', image)

            const { data } = await api.patch(backendUrl + '/api/user/update-profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    return userData ? (
        <div className='max-w-3xl mx-auto px-4 py-8'>
            <div className="text-center mb-12">
                <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>My Profile</h1>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
                <div className='flex flex-col items-center mb-8'>
                    {isEdit ? (
                        <label htmlFor='image' className='relative group cursor-pointer'>
                            <div className='w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20'>
                                <img 
                                    className='w-full h-full object-cover group-hover:opacity-75 transition-opacity' 
                                    src={image ? URL.createObjectURL(image) : userData.image} 
                                    alt="" 
                                />
                            </div>
                            <div className='absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg'>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                        </label>
                    ) : (
                        <div className='w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20'>
                            <img className='w-full h-full object-cover' src={userData.image} alt="" />
                        </div>
                    )}

                    {isEdit ? (
                        <input
                            className='mt-4 text-2xl font-semibold text-center bg-gray-50 border-b-2 border-primary/20 focus:border-primary focus:outline-none px-4 py-1 rounded transition-colors'
                            type="text"
                            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                            value={userData.name}
                        />
                    ) : (
                        <h2 className='mt-4 text-2xl font-semibold text-gray-800'>{userData.name}</h2>
                    )}
                </div>

                <div className='grid md:grid-cols-2 gap-8'>
                    {/* Contact Information */}
                    <div className='bg-gray-50 rounded-xl p-6'>
                        <h3 className='flex items-center text-lg font-semibold text-gray-800 mb-4'>
                            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Information
                        </h3>
                        <div className='space-y-4'>
                            <div className='space-y-1'>
                                <label className='text-sm text-gray-600 font-medium'>Email</label>
                                <p className='text-primary font-medium'>{userData.email}</p>
                            </div>
                            <div className='space-y-1'>
                                <label className='text-sm text-gray-600 font-medium'>Phone</label>
                                {isEdit ? (
                                    <input 
                                        className='w-full px-3 py-2 bg-white rounded border border-gray-200 focus:border-primary focus:outline-none transition-colors'
                                        type="tel"
                                        placeholder="Enter 10-digit phone number"
                                        maxLength="10"
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                                            setUserData(prev => ({ ...prev, phone: value }));
                                        }}
                                        value={userData.phone || ''}
                                    />
                                ) : (
                                    <p className='text-primary font-medium'>{userData.phone || 'Not provided'}</p>
                                )}
                            </div>
                            <div className='space-y-1'>
                                <label className='text-sm text-gray-600 font-medium'>Address</label>
                                {isEdit ? (
                                    <div className='space-y-2'>
                                        <>
                                            <input 
                                                className='w-full px-3 py-2 bg-white rounded border border-gray-200 focus:border-primary focus:outline-none transition-colors'
                                                type="text"
                                                placeholder="Address Line 1"
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                                value={userData.address.line1}
                                            />
                                            <input 
                                                className='w-full px-3 py-2 bg-white rounded border border-gray-200 focus:border-primary focus:outline-none transition-colors'
                                                type="text"
                                                placeholder="Address Line 2"
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                                value={userData.address.line2}
                                            />
                                        </>
                                    </div>
                                ) : (
                                    <p className='text-gray-700'>{userData.address.line1}<br />{userData.address.line2}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className='bg-gray-50 rounded-xl p-6'>
                        <h3 className='flex items-center text-lg font-semibold text-gray-800 mb-4'>
                            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Basic Information
                        </h3>
                        <div className='space-y-4'>
                            <div className='space-y-1'>
                                <label className='text-sm text-gray-600 font-medium'>Gender</label>
                                {isEdit ? (
                                    <select 
                                        className='w-full px-3 py-2 bg-white rounded border border-gray-200 focus:border-primary focus:outline-none transition-colors'
                                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                        value={userData.gender}
                                    >
                                        <option value="Not Selected">Not Selected</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                ) : (
                                    <p className='text-gray-700'>{userData.gender}</p>
                                )}
                            </div>
                            <div className='space-y-1'>
                                <label className='text-sm text-gray-600 font-medium'>Birthday</label>
                                {isEdit ? (
                                    <input 
                                        className='w-full px-3 py-2 bg-white rounded border border-gray-200 focus:border-primary focus:outline-none transition-colors'
                                        type='date'
                                        onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                        value={userData.dob && userData.dob !== 'Not Selected' ? userData.dob : ''}
                                    />
                                ) : (
                                    <p className='text-gray-700'>{userData.dob && userData.dob !== 'Not Selected' ? userData.dob : 'Not Selected'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-8 flex justify-center'>
                    {isEdit ? (
                        <button 
                            onClick={updateUserProfileData} 
                            className='bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium'
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsEdit(true)} 
                            className='bg-white text-primary px-8 py-3 rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-2 font-medium'
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile