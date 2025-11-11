import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'


const MyAppointments = () => {

    const { backendUrl, token, getLawyersData } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    // Months array for date formatting
    const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Helper function to check if appointment is actually cancelled
    const isAppointmentCancelled = (appointment) => {
        return appointment.cancelled && appointment.cancelled !== "Not Cancelled"
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {
            if (!token) {
                toast.error('Please login to view appointments');
                navigate('/login');
                return;
            }

            const { data } = await axios.get(backendUrl + '/api/user/appointments', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (data.success) {
                setAppointments(data.appointments); // No need to reverse, we're sorting on backend
            } else {
                toast.error(data.message || 'Failed to fetch appointments');
            }
        } catch (error) {
            console.log('Appointment fetch error:', error);
            toast.error(error.response?.data?.message || 'Failed to load appointments');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { 
                headers: {Authorization: `Bearer ${token}`,
             } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments() 
                getLawyersData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {

                console.log(response)

                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verify-razorpay", response, {
                        headers: { Authorization: `Bearer ${token}` }
                     });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { 
                headers: { Authorization: `Bearer ${token}` }
             })
            if (data.success) {
                initPay(data.order)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // // Function to make payment using stripe
    // const appointmentStripe = async (appointmentId) => {
    //     try {
    //         const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
    //         if (data.success) {
    //             const { session_url } = data
    //             window.location.replace(session_url)
    //         }else{
    //             toast.error(data.message)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         toast.error(error.message)
    //     }
    // }



    // whenever my appointment page load hote hai aur token available hai tab user appointments leke aao
    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className='max-w-7xl mx-auto px-4 py-8'>
            <div className="text-center mb-12">
                <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>My Appointments</h1>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className='space-y-6'>
                {appointments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
                        <p className="mt-1 text-gray-500">You haven't booked any appointments yet.</p>
                    </div>
                ) : (
                    appointments.map((item, index) => (
                        <div key={index} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow'>
                            <div className='flex flex-col sm:flex-row gap-6 p-6'>
                                {/* Lawyer Image */}
                                <div className='sm:w-48 flex-shrink-0'>
                                    <div className='w-full aspect-square rounded-xl overflow-hidden bg-[#EAEFFF]'>
                                        <img 
                                            className='w-full h-full object-cover' 
                                            src={item.lawyerData.image} 
                                            alt={item.lawyerData.name} 
                                        />
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className='flex-1 min-w-0'>
                                    <div className='space-y-4'>
                                        {/* Status Badge */}
                                        <div className='flex flex-wrap gap-2'>
                                            {isAppointmentCancelled(item) && (
                                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {item.cancelled}
                                                </span>
                                            )}
                                            {item.isCompleted && (
                                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Completed
                                                </span>
                                            )}
                                            {!isAppointmentCancelled(item) && item.payment && !item.isCompleted && (
                                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    Paid
                                                </span>
                                            )}
                                        </div>

                                        {/* lawyer Info */}
                                        <div>
                                            <h3 className='text-xl font-semibold text-gray-900 mb-1'>{item.lawyerData.name}</h3>
                                            <p className='text-primary font-medium'>{item.lawyerData.speciality}</p>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className='grid sm:grid-cols-2 gap-4'>
                                            <div>
                                                <h4 className='text-sm font-medium text-gray-500 mb-1'>Date & Time</h4>
                                                <p className='text-gray-900 flex items-center'>
                                                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className='text-sm font-medium text-gray-500 mb-1'>Location</h4>
                                                <p className='text-gray-900 flex items-center'>
                                                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {item.lawyerData.address.line1}, {item.lawyerData.address.line2}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='sm:w-48 flex-shrink-0 flex flex-col gap-3 justify-center'>
                                    {!isAppointmentCancelled(item) && !item.payment && !item.isCompleted && (
                                        <>
                                            {payment !== item._id ? (
                                                <button 
                                                    onClick={() => setPayment(item._id)}
                                                    className='w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2'
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    Pay Online
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => appointmentRazorpay(item._id)}
                                                    className='w-full px-4 py-2 rounded-lg bg-white border-2 border-primary text-primary hover:bg-primary/5 transition-colors flex items-center justify-center'
                                                >
                                                    <img className='max-h-6' src={assets.razorpay_logo} alt="Pay with Razorpay" />
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {!isAppointmentCancelled(item) && !item.isCompleted && (
                                        <button 
                                            onClick={() => cancelAppointment(item._id)}
                                            className='w-full px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2'
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyAppointments