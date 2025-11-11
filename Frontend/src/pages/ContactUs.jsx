import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    toast.success('Thank you for your message! We will get back to you soon.')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <div className="text-center mb-12">
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Contact Us</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          We're here to help you with any questions or concerns about our medical appointment booking platform.
          Reach out to us through any of the following methods:
        </p>
      </div>
      
      <div className='grid md:grid-cols-2 gap-12'>
        {/* Contact Information */}
        <div className='space-y-8'>
          <section className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold mb-6 text-gray-800 flex items-center'>
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Contact Information
            </h2>
            <div className='space-y-4'>
              <div className='flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors'>
                <div className='text-primary mt-1'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className='block font-semibold text-gray-800'>Email</span>
                  <span className='text-gray-600'>support@curedesk.com</span>
                </div>
              </div>
              <div className='flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors'>
                <div className='text-primary mt-1'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className='block font-semibold text-gray-800'>Phone</span>
                  <span className='text-gray-600'>+91 88888 88888</span>
                </div>
              </div>
              <div className='flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors'>
                <div className='text-primary mt-1'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className='block font-semibold text-gray-800'>Address</span>
                  <span className='text-gray-600'>Ghanta Ghar Chowk, Near Railway Station, Bhiwani-127021, Haryana</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-3 text-gray-800'>Business Hours</h3>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-700'>Monday - Friday:</span>
                <span className='text-gray-600'>8:00 AM - 8:00 PM</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-700'>Saturday:</span>
                <span className='text-gray-600'>9:00 AM - 6:00 PM</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-700'>Sunday:</span>
                <span className='text-gray-600'>10:00 AM - 4:00 PM</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-3 text-gray-800'>Department Contacts</h3>
            <div className='space-y-2'>
              <div>
                <span className='font-semibold text-gray-700'>Technical Support:</span>
                <span className='text-gray-600 ml-2'>tech@curedesk.com</span>
              </div>
              <div>
                <span className='font-semibold text-gray-700'>Billing Inquiries:</span>
                <span className='text-gray-600 ml-2'>billing@curedesk.com</span>
              </div>
              <div>
                <span className='font-semibold text-gray-700'>Medical Partnerships:</span>
                <span className='text-gray-600 ml-2'>partnerships@curedesk.com</span>
              </div>
              <div>
                <span className='font-semibold text-gray-700'>Privacy Concerns:</span>
                <span className='text-gray-600 ml-2'>privacy@curedesk.com</span>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Form */}
        <div>
          <section>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Send us a Message</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                  Full Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter your full name'
                />
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter your email address'
                />
              </div>

              <div>
                <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-1'>
                  Subject
                </label>
                <select
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select a subject</option>
                  <option value='technical'>Technical Support</option>
                  <option value='billing'>Billing Question</option>
                  <option value='appointment'>Appointment Issue</option>
                  <option value='feedback'>Feedback</option>
                  <option value='partnership'>Partnership Inquiry</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Please describe your question or concern in detail...'
                ></textarea>
              </div>

              <button
                type='submit'
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200'
              >
                Send Message
              </button>
            </form>
          </section>

          <section className='mt-8'>
            <h3 className='text-lg font-semibold mb-3 text-gray-800'>Emergency Support</h3>
            <div className='bg-red-50 border border-red-200 rounded-md p-4'>
              <p className='text-red-800 text-sm'>
                <strong>Medical Emergency:</strong> If you are experiencing a medical emergency, 
                please call 911 or go to your nearest emergency room immediately. Do not use this 
                contact form for emergency medical situations.
              </p>
            </div>
          </section>
        </div>
      </div>

      <section className='mt-12 text-center'>
        <h3 className='text-lg font-semibold mb-3 text-gray-800'>Follow Us</h3>
        <p className='text-gray-600 mb-4'>Stay connected with us on social media for updates and health tips:</p>
        <div className='flex justify-center space-x-6'>
          <a href='#' className='text-blue-600 hover:text-blue-800'>Facebook</a>
          <a href='#' className='text-blue-400 hover:text-blue-600'>Twitter</a>
          <a href='#' className='text-blue-700 hover:text-blue-900'>LinkedIn</a>
          <a href='#' className='text-pink-600 hover:text-pink-800'>Instagram</a>
        </div>
      </section>
    </div>
  )
}

export default ContactUs