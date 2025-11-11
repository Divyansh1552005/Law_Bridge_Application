import React, { useContext, useEffect, useState } from 'react'
import { LawyerContext } from '../../context/LawyerContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const LawyerProfile = () => {

    const { lToken, profileData, setProfileData, getProfileData } = useContext(LawyerContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(true)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.patch(backendUrl + '/api/lawyer/update-profile', updateData, { 
                headers: {
                    'Authorization': `Bearer ${lToken}`,
                    'Content-Type': 'application/json'
                }
            })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (lToken) {
            getProfileData().finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [lToken])

    if (loading) {
        return (
            <div className="flex justify-center items-center m-5 h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!profileData) {
        return (
            <div className="flex justify-center items-center m-5 h-64">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">Unable to load profile data</p>
                    <button 
                        onClick={() => {
                            setLoading(true)
                            getProfileData().finally(() => setLoading(false))
                        }}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                    {/* ----- Lawyer Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
                    </div>

                    {/* ----- Lawyer About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About :</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {
                                isEdit
                                    ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} type='text' className='w-full outline-primary p-2' rows={8} value={profileData.about} />
                                    : profileData.about
                            }
                        </p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-800'>{currency} {isEdit ? <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}</span>
                    </p>

                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <div className='text-sm flex-1'>
                            {isEdit ? (
                                <div className='space-y-2'>
                                    <input 
                                        type='text' 
                                        placeholder='Location/Street Address'
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, Location: e.target.value } }))} 
                                        value={profileData.address?.Location || ''} 
                                        className='w-full p-2 border rounded'
                                    />
                                    <input 
                                        type='text' 
                                        placeholder='City'
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, City: e.target.value } }))} 
                                        value={profileData.address?.City || ''} 
                                        className='w-full p-2 border rounded'
                                    />
                                    <input 
                                        type='text' 
                                        placeholder='State'
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, State: e.target.value } }))} 
                                        value={profileData.address?.State || ''} 
                                        className='w-full p-2 border rounded'
                                    />
                                </div>
                            ) : (
                                <div>
                                    <p>{profileData.address?.Location || 'Location not provided'}</p>
                                    <p>{profileData.address?.City || 'City not provided'}</p>
                                    <p>{profileData.address?.State || 'State not provided'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex gap-1 pt-2'>
                        <input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} />
                        <label htmlFor="">Available</label>
                    </div>

                    {
                        isEdit
                            ? <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all cursor-pointer'>Save</button>
                            : <button onClick={() => setIsEdit(prev => !prev)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all cursor-pointer'>Edit</button>
                    }

                </div>
            </div>
        </div>
    )
}

export default LawyerProfile