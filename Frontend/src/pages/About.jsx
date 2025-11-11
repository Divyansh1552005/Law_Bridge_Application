import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Us</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl transform rotate-3"></div>
          <img 
            className="relative w-full rounded-3xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300" 
            src={assets.about_image} 
            alt="About Cure Desk" 
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              Welcome to Cure Desk, your trusted partner in managing your healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <p className="text-lg">
              Cure Desk is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service.
            </p>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Vision</h3>
              <p className="text-lg text-gray-600">
                To create a seamless healthcare experience for every user, bridging the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white mb-3 transition-colors">Efficiency</h3>
            <p className="text-gray-600 group-hover:text-white/90 transition-colors">Streamlined appointment scheduling that fits into your busy lifestyle.</p>
          </div>

          <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white mb-3 transition-colors">Convenience</h3>
            <p className="text-gray-600 group-hover:text-white/90 transition-colors">Access to a network of trusted healthcare professionals in your area.</p>
          </div>

          <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2 0 4.5.37 6.879 1.804M12 2a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white mb-3 transition-colors">Personalization</h3>
            <p className="text-gray-600 group-hover:text-white/90 transition-colors">Tailored recommendations and reminders to help you stay on top of your health.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About