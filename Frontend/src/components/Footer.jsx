import React from 'react'
import { Link } from 'react-router-dom'; 
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Company Info */}
                    <div className="lg:col-span-5">
                        <img className="h-12 w-auto mb-6" src={assets.logo2} alt="Cure Desk Logo" />
                        <p className="text-gray-600 leading-relaxed mb-8">
                            LawBridge is committed to simplifying legal case management through advanced technology and streamlined workflows. Trusted by legal professionals, we make managing client consultations, case records, documents, and scheduling easier, faster, and more secure than ever before.

                        </p>
                        <div className="flex space-x-5">
                            <a href="https://twitter.com" className="text-gray-400 hover:text-primary transition-colors">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                </svg>
                            </a>
                            <a href="https://linkedin.com" className="text-gray-400 hover:text-primary transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>
                            <a href="https://facebook.com" className="text-gray-400 hover:text-primary transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => scrollIntoView(0, 0)}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => scrollIntoView(0, 0)}>
                                    About us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact-us" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => scrollIntoView(0, 0)}>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy-policy" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => scrollIntoView(0, 0)}>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-and-conditions" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => scrollIntoView(0, 0)}>
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund-policy" className="text-base text-gray-600 hover:text-primary transition-colors" onClick={() => scrollIntoView(0, 0)}>
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-4">
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                            Contact Us
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                </div>
                                <div className="ml-3 text-base text-gray-600">
                                    +917777777777
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <div className="ml-3 text-base text-gray-600">
                                    officialdslc1552005@gmail.com
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <div className="ml-3 text-base text-gray-600">
                                    Ghanta Ghar Chowk,<br />
                                    Near Railway Station,<br />
                                    Bhiwani-127021, Haryana
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