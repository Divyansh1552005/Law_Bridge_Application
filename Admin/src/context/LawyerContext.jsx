import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const LawyerContext = createContext()

const LawyerContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [lToken, setLToken] = useState(localStorage.getItem('lToken') ? localStorage.getItem('lToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Getting Lawyer appointment data from Database using API
    const getAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/lawyer/appointments', { 
                headers: {Authorization: `Bearer ${lToken}`}
            })

            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Lawyer profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/lawyer/profile', { 
                headers: {Authorization: `Bearer ${lToken}`}
             })
            console.log('Profile API Response:', data)
            console.log('Profile Data Address:', data.profileData?.address)
            
            if (data.success) {
                setProfileData(data.profileData)
            } else {
                toast.error(data.message)
                console.error('Profile fetch failed:', data.message)
            }

        } catch (error) {
            console.log('Profile fetch error:', error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Function to cancel lawyer appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/lawyer/cancel-appointment', { appointmentId }, { 
                headers: {Authorization: `Bearer ${lToken}`}
             })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // after creating dashboard
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/lawyer/complete-appointment', { appointmentId }, { 
                headers: {Authorization: `Bearer ${lToken}`}
            })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Later after creating getDashData Function
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting lawyer dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/lawyer/dashboard', { 
                headers: {Authorization: `Bearer ${lToken}`}
             })

            console.log('Dashboard API Response:', data)

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
                console.error('Dashboard fetch failed:', data.message)
            }

        } catch (error) {
            console.log('Dashboard fetch error:', error)
            toast.error(error.response?.data?.message || error.message)
        }

    }

    const value = {
        lToken, setLToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <LawyerContext.Provider value={value}>
            {props.children}
        </LawyerContext.Provider>
    )


}

export default LawyerContextProvider

