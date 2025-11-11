import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Contact = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl transform -rotate-2"></div>
          <img 
            className="relative w-full rounded-3xl shadow-lg" 
            src={assets.contact_image} 
            alt="Contact Cure Desk" 
          />
        </div>

        <div className="space-y-8">
          {/* Office Information */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Office</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ghanta Ghar Chowk<br />
                  Near Railway Station<br />
                  Bhiwani-127021, Haryana
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Get in Touch</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tel: +918888888888<br />
                  Email: officialdslc1552005@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Careers Section */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Careers at Cure Desk</h3>
            <p className="text-gray-600 mb-6">Join our team and help us revolutionize healthcare access. Learn more about our teams and job openings.</p>
            <button 
              onClick={() => {
                navigate('/contact-us');
                scrollTo(0, 0);
              }}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Explore Jobs
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact