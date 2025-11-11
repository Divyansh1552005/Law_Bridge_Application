import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'


const Navbar = () => {

    const navigate = useNavigate()

    const [showMenu, setShowMenu] = useState(false)
    const [showMobileDropdown, setShowMobileDropdown] = useState(false)
    const { token, setToken, userData } = useContext(AppContext)
    // const [ token, setToken ] = useState(true) // Set to false to show Create account button

    // Handle clicks outside of dropdown to close it
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownButton = document.getElementById('profile-dropdown-button');
            const dropdownContent = document.getElementById('profile-dropdown-content');
            
            if (dropdownButton && dropdownContent &&
                !dropdownButton.contains(event.target) && 
                !dropdownContent.contains(event.target)) {
                setShowMobileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);



    const logout = () => {
        localStorage.removeItem('token')
        setToken(false)
        navigate('/login')
    }

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD] relative'>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo2} alt="" />
            <ul className='md:flex items-start gap-5 font-medium hidden relative z-10'>
                <NavLink to='/' className='block'>
                    <li className='py-1 px-2 hover:text-primary transition-colors cursor-pointer'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/lawyers' className='block'>
                    <li className='py-1 px-2 hover:text-primary transition-colors cursor-pointer'>ALL LAWYERS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/about' className='block'>
                    <li className='py-1 px-2 hover:text-primary transition-colors cursor-pointer'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/contact' className='block'>
                    <li className='py-1 px-2 hover:text-primary transition-colors cursor-pointer'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-4 relative z-30'>

                {
                    token && userData
                        ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <div id="profile-dropdown-button" onClick={() => setShowMobileDropdown(!showMobileDropdown)} className='flex items-center gap-2 p-1'>
                                <img className='w-8 rounded-full' src={userData.image} alt="" />
                                <img className={`w-2.5 transition-transform duration-200 ${showMobileDropdown ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="" />
                            </div>
                            {/* Desktop Dropdown (Hover) */}
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-50 hidden md:group-hover:block'>
                                <div className='min-w-48 bg-white border border-gray-200 rounded flex flex-col gap-4 p-4 shadow-xl'>
                                    <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                            {/* Mobile Dropdown (Click) */}
                            <div id="profile-dropdown-content" 
                                className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-50 md:hidden ${showMobileDropdown ? 'block' : 'hidden'}`}>
                                <div className='min-w-48 bg-white border border-gray-200 rounded flex flex-col gap-4 p-4 shadow-xl'>
                                    <p onClick={() => {
                                        navigate('/my-profile');
                                        setShowMobileDropdown(false);
                                    }} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => {
                                        navigate('/my-appointments');
                                        setShowMobileDropdown(false);
                                    }} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    <p onClick={() => {
                                        logout();
                                        setShowMobileDropdown(false);
                                    }} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                        : <button 
                            onClick={() => navigate('/login')} 
                            className='bg-[#5f6FFF] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-light text-sm sm:text-base cursor-pointer hover:bg-[#4f5fff] transition-colors duration-200'
                          >
                            Sign up
                          </button>
                }
                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

                {/* ---- Mobile Menu ---- */}
                <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <img src={assets.logo} className='w-36' alt="" />
                        <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/lawyers' ><p className='px-4 py-2 rounded full inline-block'>ALL LAWYERS</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
                        {token ? (
                            <>
                                <div className='w-full h-[1px] bg-gray-200 my-2'></div>
                                <NavLink onClick={() => setShowMenu(false)} to='/my-profile'><p className='px-4 py-2 rounded full inline-block'>MY PROFILE</p></NavLink>
                                <NavLink onClick={() => setShowMenu(false)} to='/my-appointments'><p className='px-4 py-2 rounded full inline-block'>MY APPOINTMENTS</p></NavLink>
                                <button onClick={() => { setShowMenu(false); logout(); }} className='px-4 py-2 rounded full inline-block text-red-600'>LOGOUT</button>
                            </>
                        ) : (
                            <>
                                <div className='w-full h-[1px] bg-gray-200 my-2'></div>
                                <button 
                                    onClick={() => { setShowMenu(false); navigate('/login'); }} 
                                    className='bg-[#5f6FFF] text-white px-6 py-3 rounded-full font-medium hover:bg-[#4f5fff] transition-colors duration-200'
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar