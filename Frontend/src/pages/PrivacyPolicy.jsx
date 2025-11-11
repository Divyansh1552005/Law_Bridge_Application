import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <div className="text-center mb-12">
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Privacy Policy</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      
      <div className='space-y-8 text-gray-700'>
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Information We Collect</h2>
          <p className='mb-4'>
            At Cure Desk, we collect information you provide directly to us, such as when you create an account, 
            book an appointment, or contact us for support. This may include:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Personal information (name, email address, phone number, date of birth)</li>
            <li>Medical information relevant to your appointments</li>
            <li>Payment information for appointment bookings</li>
            <li>Communication records between you and healthcare providers</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>How We Use Your Information</h2>
          <p className='mb-4'>We use the information we collect to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Provide, maintain, and improve our medical appointment booking services</li>
            <li>Process appointments and communicate with healthcare providers</li>
            <li>Send you confirmations, updates, and other service-related communications</li>
            <li>Respond to your comments, questions, and provide customer service</li>
            <li>Ensure the security and integrity of our platform</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Information Sharing</h2>
          <p className='mb-4'>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
            except in the following circumstances:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>With healthcare providers for appointment and treatment purposes</li>
            <li>With service providers who assist us in operating our platform</li>
            <li>When required by law or to protect our rights and safety</li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Data Security</h2>
          <p className='mb-4'>
            We implement appropriate security measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Your Rights</h2>
          <p className='mb-4'>You have the right to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and personal data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your personal information</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Contact Us</h2>
          <p className='mb-4'>
            If you have any questions about this Privacy Policy, please contact us at privacy@curedesk.com 
            or through our contact page.
          </p>
        </section>

        <section>
          <p className='text-sm text-gray-600 mt-8'>
            Last updated: October 2025
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy