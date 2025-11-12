import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'

const Footer = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");          // Go to homepage
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    };
    return (
        <footer className="border-t border-gray-200 bg-gray-50 py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Company Info */}
                    <div className="lg:col-span-5">
                        <img
                            className="h-20 w-auto mb-6 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                            src={assets.legallogo}
                            alt="LawBridge Logo"
                            onClick={handleClick}
                        />

                        <p className="text-gray-600 leading-relaxed mb-8">
                            LawBridge is committed to simplifying legal case management through advanced technology and streamlined workflows. Trusted by legal professionals, we make managing client consultations, case records, documents, and scheduling easier, faster, and more secure than ever before.

                        </p>
                        <div className="flex space-x-4">
                            {/* X (formerly Twitter) */}
                            <a href="https://x.com" className="bg-black p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-black/50 group">
                                <span className="sr-only">X (formerly Twitter)</span>
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a href="https://linkedin.com" className="bg-blue-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-600/50 group">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>

                            {/* Facebook */}
                            <a href="https://facebook.com" className="bg-blue-700 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-700/50 group">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>

                            {/* Reddit */}
                            <a href="https://reddit.com" className="bg-orange-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-orange-600/50 group">
                                <span className="sr-only">Reddit</span>
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-3 mt-4 lg:mt-4">
                        <h3 className="text-medium font-semibold text-gray-900 tracking-wider uppercase mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                                    About us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact-us" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy-policy" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-and-conditions" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund-policy" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-4 mt-4 lg:mt-4">
                        <h3 className="text-medium font-semibold text-gray-900 tracking-wider uppercase mb-4">
                            Contact Us
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div className="shrink-0 bg-blue-100 p-2 rounded-lg">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="ml-4 text-base text-gray-600">
                                    <a href="tel:+917777777777" className="hover:text-blue-600 transition-colors duration-200">
                                        +917777777777
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="shrink-0 bg-red-100 p-2 rounded-lg">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4 text-base text-gray-600">
                                    <a href="mailto:officialdslc1552005@gmail.com" className="hover:text-red-600 transition-colors duration-200">
                                        officialdslc1552005@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="shrink-0 bg-green-100 p-2 rounded-lg">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4 text-base text-gray-600">
                                    <a
                                        href="https://maps.google.com/?q=Ghanta+Ghar+Chowk,+Near+Railway+Station,+Bhiwani-127021,+Haryana"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-green-600 transition-colors duration-200"
                                    >
                                        Ghanta Ghar Chowk,<br />
                                        Near Railway Station,<br />
                                        Bhiwani-127021, Haryana
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-base text-gray-500 text-center">
                        &copy; {new Date().getFullYear()} Law Bridge. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;