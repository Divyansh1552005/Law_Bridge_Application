import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <div className="text-center mb-12">
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Privacy Policy</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      
      <div className='space-y-8 text-gray-700'>


        {/* Information We Collect */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Information We Collect
          </h2>

          <p className='mb-4'>
            At LawBridge, we collect information that you provide directly to us, such as when you create an account, 
            book a legal consultation, or reach out to our support team. This may include:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Personal information (name, email address, phone number, identification details)</li>
            <li>Case-related information shared for consultation purposes</li>
            <li>Payment information for legal service bookings</li>
            <li>Communication records between you and legal professionals</li>
          </ul>
        </section>



        {/* How We Use Your Information */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            How We Use Your Information
          </h2>

          <p className='mb-4'>We use the information we collect to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Provide, maintain, and improve our legal consultation services</li>
            <li>Facilitate communication between you and legal professionals</li>
            <li>Send confirmations, updates, and notifications</li>
            <li>Respond to inquiries and provide customer support</li>
            <li>Enhance security and prevent unauthorized access</li>
          </ul>
        </section>



        {/* Information Sharing */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Information Sharing
          </h2>

          <p className='mb-4'>
            We do not sell or rent your personal information. We only share your data under these conditions:
          </p>

          <ul className='list-disc pl-6 space-y-2'>
            <li>With legal professionals for consultations or case-related activities</li>
            <li>With trusted service providers who support our platform</li>
            <li>When required by law, court orders, or safety concerns</li>
            <li>During mergers, acquisitions, or restructuring of LawBridge</li>
          </ul>
        </section>



        {/* Data Security */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 21a7.5 7.5 0 10-15 0h15z" />
            </svg>
            Data Security
          </h2>

          <p className='mb-4'>
            We use modern security practices such as encryption, secure servers, and periodic audits 
            to protect your personal information and maintain data integrity.
          </p>
        </section>



        {/* Your Rights */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Your Rights
          </h2>

          <p className='mb-4'>You have the right to:</p>

          <ul className='list-disc pl-6 space-y-2'>
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and personal data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of the information we have collected about you</li>
          </ul>
        </section>



        {/* Contact Us */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79V18a2 2 0 01-2 2H5a2 2 0 01-2-2v-5.21M7 8a5 5 0 0110 0v4H7V8z" />
            </svg>
            Contact Us
          </h2>

          <p className='mb-4'>
            If you have any questions or concerns about this Privacy Policy, you can contact us at 
            privacy@lawbridge.com or via the support options listed on our platform.
          </p>
        </section>



        {/* Last updated */}
        <section>
          <p className='text-sm text-gray-600 mt-8'>Last updated: October 2025</p>
        </section>

      </div>
    </div>
  )
}

export default PrivacyPolicy
