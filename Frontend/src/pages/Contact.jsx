import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Contact = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We're here to help you with your legal needs. Get in touch with us through any of the channels below.
        </p>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-6"></div>
      </div>

      {/* Contact Information Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {/* Office Location */}
        <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
            <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors">Visit Our Office</h3>
          <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm leading-relaxed">
            Ghanta Ghar Chowk<br />
            Near Railway Station<br />
            Bhiwani-127021, Haryana
          </p>
        </div>

        {/* Phone */}
        <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
            <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors">Call Us</h3>
          <a href="tel:+918888888888" className="text-primary group-hover:text-white font-semibold text-lg transition-colors block mb-2">
            +91 88888 88888
          </a>
          <p className="text-gray-500 group-hover:text-white/80 transition-colors text-sm">Monday - Friday<br />9:00 AM - 6:00 PM</p>
        </div>

        {/* Email */}
        <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
            <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors">Email Us</h3>
          <a href="mailto:lawbridge.recruit@lawbridge.com" className="text-primary group-hover:text-white font-semibold text-sm break-all transition-colors block mb-2">
            lawbridge.recruit@lawbridge.com
          </a>
          <p className="text-gray-500 group-hover:text-white/80 transition-colors text-sm">We'll respond within 24 hours</p>
        </div>
      </div>

      {/* Join Our Team Section */}
      <div className="mb-20">
        <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Join LawBridge</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Interested in being part of our team? We're always looking for talented and passionate individuals who want to make a difference in revolutionizing legal access.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200 max-w-md mx-auto">
              <p className="text-gray-700 text-sm mb-4 font-medium">Ready to join our legal professionals?</p>
              <a
                href="https://tally.so/r/QKobgl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Apply as a Lawyer
              </a>
            </div>
            <p className="text-gray-700 text-sm mt-3">Fill out the application form and join our team of legal experts</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Why Join Us</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1 */}
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-800 mb-2 group-hover:text-white transition-colors">Fast Processing</h4>
            <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm">
              Experience quick and hassle-free application handling.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-800 mb-2 group-hover:text-white transition-colors">Trusted & Reliable</h4>
            <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm">
              Built with industry-grade security and reliability.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-800 mb-2 group-hover:text-white transition-colors">Qualified Professionals</h4>
            <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm">
              Get guidance from experienced and certified experts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-800 mb-2 group-hover:text-white transition-colors">Dedicated Support</h4>
            <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm">
              Get help whenever you need with our friendly team.
            </p>
          </div>

        </div>
      </div>



    </div>
  )
}

export default Contact