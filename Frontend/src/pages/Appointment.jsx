import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedLawyers from '../components/RelatedLawyers'
import api from '../api/axiosClient'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { lawyerId } = useParams()
    const { lawyers, currencySymbol, backendUrl, token, getLawyersData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [lawyerInfo, setLawyerInfo] = useState(false)
    const [lawyerSlots, setLawyerSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    const fetchLawyerInfo = async () => {
        const lawyerInfo = lawyers.find((lawyer) => lawyer._id === lawyerId)
        setLawyerInfo(lawyerInfo)
    }

    // all available slots of lawyer, will be used later to remove the booked slots from frontend
    const getAvailableSlots = async () => {

        setLawyerSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];


            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime
                
                // Check if slot is booked
                const isSlotAvailable = lawyerInfo.slots_booked && lawyerInfo.slots_booked[slotDate] && lawyerInfo.slots_booked[slotDate].includes(slotTime) ? false : true


                if (isSlotAvailable) {

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setLawyerSlots(prev => ([...prev, timeSlots]))

        }

    }

    const bookAppointment = async () => {

        // checking if user is logged in or not
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        const date = lawyerSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await api.post(backendUrl + '/api/user/book-appointment', { lawyerId, slotDate, slotTime }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
                getLawyersData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }

    }

    // fetching lawyer info on lawyerId or lawyers change
    useEffect(() => {
        if (lawyers.length > 0) {
            fetchLawyerInfo()
        }
    }, [lawyers, lawyerId])


    // getting available slots on lawyerInfo change (coz appointment book karne ke baad lawyerInfo change hoga)
    useEffect(() => {
        if (lawyerInfo) {
            getAvailableSlots()
        }
    }, [lawyerInfo])

    return lawyerInfo ? (
        <div className='max-w-7xl mx-auto px-4 py-4 sm:py-8'>
            {/* Lawyer Profile Section */}
            <div className='bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 sm:mb-8'>
                {/* Lawyer Info Section - Unified for both Mobile and Desktop */}
                <div className='bg-primary/5 p-4 sm:p-8'>
                    <div className='flex flex-col sm:flex-row gap-6 sm:gap-8'>
                            <div className='w-full sm:w-72 lg:w-80 shrink-0'>
                            <div className='aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#EAEFFF]'>
                                <img 
                                    className='w-full h-full object-cover' 
                                    src={lawyerInfo.image} 
                                    alt={lawyerInfo.name} 
                                />
                            </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                                <div>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>{lawyerInfo.name}</h1>
                                        <img className='w-5 sm:w-6 h-5 sm:h-6' src={assets.verified_icon} alt="Verified" />
                                    </div>
                                    <div className='flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600'>
                                        <span className='font-medium'>{lawyerInfo.degree}</span>
                                        <span className='hidden sm:inline'>•</span>
                                        <span className='text-primary font-medium'>{lawyerInfo.speciality}</span>
                                        <span className='px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium'>
                                            {lawyerInfo.experience}
                                        </span>
                                    </div>
                                </div>
                                <div className='bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm inline-block'>
                                    <p className='text-sm text-gray-600 mb-1'>Consultation Fee</p>
                                    <p className='text-xl sm:text-2xl font-bold text-primary'>{currencySymbol}{lawyerInfo.fees}</p>
                                </div>
                            </div>

                            <div className='mt-6'>
                                <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2'>
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    About Lawyer
                                </h2>
                                <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>{lawyerInfo.about}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className='p-4 sm:p-8 border-t border-gray-100'>
                    <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2'>
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Select Date & Time
                    </h2>

                    {/* Date Selection - Scrollable */}
                    <div className='mb-6'>
                        <div className='flex gap-3 items-center w-full overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 no-scrollbar'>
                            {lawyerSlots.length > 0 && lawyerSlots.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSlotIndex(index)}
                                    className={`text-center py-4 px-3 min-w-[4.5rem] rounded-full cursor-pointer transition-all ${
                                        slotIndex === index 
                                            ? 'bg-primary text-white' 
                                            : 'border border-[#DDDDDD] hover:bg-gray-50'
                                    }`}
                                >
                                    <p className='text-sm font-medium'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                    <p className='text-lg font-bold mt-0.5'>{item[0] && item[0].datetime.getDate()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className='mb-6 sm:mb-8'>
                        <h3 className='text-sm font-medium text-gray-700 mb-3'>Available Time Slots</h3>
                        <div className='flex gap-3 items-center w-full overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 no-scrollbar'>
                            {lawyerSlots.length > 0 && lawyerSlots[slotIndex].map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSlotTime(item.time)}
                                    className={`text-center py-2 px-5 whitespace-nowrap rounded-full cursor-pointer transition-all ${
                                        item.time === slotTime 
                                            ? 'bg-primary text-white' 
                                            : 'border border-[#B4B4B4] text-[#949494] hover:bg-gray-50'
                                    }`}
                                >
                                    <p className='text-sm font-medium'>{item.time.toLowerCase()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Button */}
                    <div className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 sm:relative sm:border-0 sm:p-0 sm:bg-transparent'>
                        <button
                            onClick={bookAppointment}
                            disabled={!slotTime}
                            className={`w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                                slotTime 
                                    ? 'bg-primary text-white hover:bg-primary/90' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {slotTime ? 'Confirm Appointment' : 'Select a Time Slot'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Lawyer Section */}
            <div className='bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8 mb-24 sm:mb-8'>
                <RelatedLawyers speciality={lawyerInfo.speciality} lawyerId={lawyerId} />
            </div>
        </div>
    ) : null
}

export default Appointment;