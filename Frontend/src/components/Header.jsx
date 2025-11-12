import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='relative flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20 overflow-hidden'>
            
            {/* --------- Background Image --------- */}
            <div className='absolute inset-0 z-0'>
                <img 
                    className='w-full h-full object-cover object-center' 
                    src={assets.homepgpic} 
                    alt="" 
                />
                {/* Overlay for better text readability */}
                <div className='absolute inset-0 bg-black/50'></div>
            </div>

            {/* --------- Header Content --------- */}
            <div className='relative z-10 w-full flex flex-col items-center justify-center gap-6 py-16 md:py-[12vw] text-center'>
                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight max-w-4xl'>
                    Book Appointment with Lawyers or Chat with Our Trusted Legal AI Assistant
                </p>
                <div className='flex flex-col items-center gap-3 text-white font-light max-w-2xl'>
                    <img className='w-32' src={assets.group_profiles} alt="" />
                    <p className="text-base md:text-lg">Simply browse through our extensive list of trusted lawyers or get instant answers from our AI assistant.</p>
                </div>
                <div className='flex flex-col sm:flex-row items-center gap-4 mt-2'>
                    <Link to='/lawyers' className='flex items-center gap-2 bg-white px-8 py-3.5 rounded-full text-[#595959] text-base md:text-lg font-medium hover:scale-105 transition-all duration-300'>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/>
                        </svg>
                        Book appointment <img className='w-3.5' src={assets.arrow_icon} alt="" />
                    </Link>
                    <Link to='/chatbot' className='flex items-center gap-2 bg-transparent border-2 border-white px-8 py-3.5 rounded-full text-white text-base md:text-lg font-medium hover:scale-105 hover:bg-white hover:text-[#595959] transition-all duration-300'>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04.97 4.43L1 23l6.57-1.97C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10zm-1 15h-2v-2h2v2zm0-4h-2V9h2v4z'/>
                        </svg>
                        Talk to AI Assistant <img className='w-3.5' src={assets.arrow_icon} alt="" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header