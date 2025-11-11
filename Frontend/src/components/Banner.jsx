import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Banner = () => {

    const navigate = useNavigate()
    const { token } = useContext(AppContext)

    return (
        <div className='flex bg-primary rounded-lg  px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>

            {/* ------- Left Side ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    <p>Book Appointment</p>
                    <p className='mt-4'>With 100+ Trusted Lawyers</p>
                </div>
                <button 
                    onClick={() => { 
                        navigate(token ? '/my-profile' : '/login'); 
                        scrollTo(0, 0) 
                    }} 
                    className='bg-white px-8 py-3.5 rounded-full text-[#595959] text-base md:text-lg font-medium mt-6 hover:scale-105 transition-all duration-300'
                >
                    {token ? 'Go to My Profile' : 'Create account'}
                </button>
            </div>

            {/* ------- Right Side ------- */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
            </div>
        </div>
    )
}

export default Banner