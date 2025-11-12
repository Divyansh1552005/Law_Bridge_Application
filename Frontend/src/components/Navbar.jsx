import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'


const Navbar = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const [showMenu, setShowMenu] = useState(false)
    const [showMobileDropdown, setShowMobileDropdown] = useState(false)
    const [activeLink, setActiveLink] = useState('/')
    const [dropletStyle, setDropletStyle] = useState({})
    const navRef = useRef(null)
    const { token, setToken, userData } = useContext(AppContext)
    // const [ token, setToken ] = useState(true) // Set to false to show Create account button

    // Track active link and update droplet position
    useEffect(() => {
        setActiveLink(location.pathname)
        
        const updateDropletPosition = () => {
            if (navRef.current) {
                const activeNavLink = navRef.current.querySelector(`[data-path="${location.pathname}"]`)
                if (activeNavLink) {
                    const navContainer = navRef.current
                    const containerRect = navContainer.getBoundingClientRect()
                    const activeRect = activeNavLink.getBoundingClientRect()
                    
                    setDropletStyle({
                        transform: `translateX(${activeRect.left - containerRect.left}px)`,
                        width: `${activeRect.width}px`,
                    })
                }
            }
        }

        updateDropletPosition()
        
        // Update position on window resize
        window.addEventListener('resize', updateDropletPosition)
        return () => window.removeEventListener('resize', updateDropletPosition)
    }, [location.pathname])

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
            <img onClick={() => navigate('/')} className='w-auto h-16 cursor-pointer' src={assets.legallogo} alt="" />
            <nav ref={navRef} className='md:flex items-center gap-2 font-medium hidden relative z-10'>
                {/* Animated Droplet Background */}
                <div 
                    className='absolute top-0 h-full bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-full transition-all duration-500 ease-out transform scale-100 opacity-100'
                    style={dropletStyle}
                />
                
                <NavLink 
                    to='/' 
                    data-path='/'
                    className={`relative z-10 block px-4 py-2 text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
                        activeLink === '/' ? 'text-primary font-semibold' : ''
                    }`}
                >
                    HOME
                </NavLink>
                <NavLink 
                    to='/about' 
                    data-path='/about'
                    className={`relative z-10 block px-4 py-2 text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
                        activeLink === '/about' ? 'text-primary font-semibold' : ''
                    }`}
                >
                    ABOUT
                </NavLink>
                <NavLink 
                    to='/lawyers' 
                    data-path='/lawyers'
                    className={`relative z-10 block px-4 py-2 text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
                        activeLink === '/lawyers' ? 'text-primary font-semibold' : ''
                    }`}
                >
                    ALL LAWYERS
                </NavLink>
                <NavLink 
                    to='/resources' 
                    data-path='/resources'
                    className={`relative z-10 block px-4 py-2 text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
                        activeLink === '/resources' ? 'text-primary font-semibold' : ''
                    }`}
                >
                    RESOURCES
                </NavLink>
                <NavLink 
                    to='/chatbot' 
                    data-path='/chatbot'
                    className={`relative z-10 block px-4 py-2 text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
                        activeLink === '/chatbot' ? 'text-primary font-semibold' : ''
                    }`}
                >
                    CHATBOT
                </NavLink>
                <NavLink 
                    to='/contact' 
                    data-path='/contact'
                    className={`relative z-10 block px-4 py-2 text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
                        activeLink === '/contact' ? 'text-primary font-semibold' : ''
                    }`}
                >
                    CONTACT
                </NavLink>
            </nav>

            <div className='flex items-center gap-4 relative z-30'>

                {
                    token && userData
                        ? <div className='flex items-center cursor-pointer group relative'>
                            <div id="profile-dropdown-button" onClick={() => setShowMobileDropdown(!showMobileDropdown)} className='flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-full hover:bg-gray-50 transition-all duration-300'>
                                <div className='relative'>
                                    <img 
                                        className='w-auto h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm hover:border-primary transition-all duration-300 hover:shadow-md' 
                                        src={userData.image} 
                                        alt="User Profile" 
                                    />
                                    <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full shadow-sm'></div>
                                </div>
                                <div className='hidden sm:flex items-center gap-2'>
                                    <div className='text-left'>
                                        <p className='text-medium font-medium text-gray-900 truncate max-w-24'>{userData.name}</p>
                                        <p className='text-xs text-gray-500'>Online</p>
                                    </div>
                                </div>
                                <img className={`w-2.5 sm:w-3 transition-transform duration-200 ${showMobileDropdown ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="" />
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
                        <img src={assets.legallogo} className='w-auto h-14' alt="" />
                        <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink 
                            onClick={() => setShowMenu(false)} 
                            to='/' 
                            className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                                activeLink === '/' ? 'text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10' : ''
                            }`}
                        >
                            HOME
                        </NavLink>
                        <NavLink 
                            onClick={() => setShowMenu(false)} 
                            to='/about' 
                            className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                                activeLink === '/about' ? 'text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10' : ''
                            }`}
                        >
                            ABOUT
                        </NavLink>
                        <NavLink 
                            onClick={() => setShowMenu(false)} 
                            to='/lawyers' 
                            className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                                activeLink === '/lawyers' ? 'text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10' : ''
                            }`}
                        >
                            ALL LAWYERS
                        </NavLink>
                        <NavLink 
                            onClick={() => setShowMenu(false)} 
                            to='/resources' 
                            className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                                activeLink === '/resources' ? 'text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10' : ''
                            }`}
                        >
                            RESOURCES
                        </NavLink>
                        <NavLink 
                            onClick={() => setShowMenu(false)} 
                            to='/chatbot' 
                            className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                                activeLink === '/chatbot' ? 'text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10' : ''
                            }`}
                        >
                            CHATBOT
                        </NavLink>
                        <NavLink 
                            onClick={() => setShowMenu(false)} 
                            to='/contact' 
                            className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                                activeLink === '/contact' ? 'text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10' : ''
                            }`}
                        >
                            CONTACT
                        </NavLink>
                        {token ? (
                            <>
                                <div className='w-full h-px bg-gray-200 my-2'></div>
                                <NavLink 
                                    onClick={() => setShowMenu(false)} 
                                    to='/my-profile'
                                    className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                                        activeLink === '/my-profile' ? 'text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10' : ''
                                    }`}
                                >
                                    MY PROFILE
                                </NavLink>
                                <NavLink 
                                    onClick={() => setShowMenu(false)} 
                                    to='/my-appointments'
                                    className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                                        activeLink === '/my-appointments' ? 'text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10' : ''
                                    }`}
                                >
                                    MY APPOINTMENTS
                                </NavLink>
                                <button onClick={() => { setShowMenu(false); logout(); }} className='px-4 py-2 rounded-full inline-block text-red-600 hover:text-red-700 transition-colors duration-300'>LOGOUT</button>
                            </>
                        ) : (
                            <>
                                <div className='w-full h-px bg-gray-200 my-2'></div>
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