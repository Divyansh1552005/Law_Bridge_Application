import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <div className="text-center mb-12">
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Terms and Conditions</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      
      <div className='space-y-8 text-gray-700'>
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Acceptance of Terms</h2>
          <p className='mb-4'>
            By accessing and using Cure Desk platform, you accept and agree to be bound by the terms and 
            provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Service Description</h2>
          <p className='mb-4'>
            Cure Desk is a medical appointment booking platform that connects patients with healthcare providers. 
            We facilitate appointment scheduling but do not provide medical services directly.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>User Responsibilities</h2>
          <p className='mb-4'>As a user of Cure Desk, you agree to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Provide accurate and complete information when creating your account</li>
            <li>Keep your account credentials secure and confidential</li>
            <li>Attend scheduled appointments or cancel them within the specified timeframe</li>
            <li>Treat healthcare providers and staff with respect and courtesy</li>
            <li>Pay applicable fees for appointments and services</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Appointment Booking and Cancellation</h2>
          <p className='mb-4'>
            When you book an appointment through our platform, you enter into a direct relationship with the healthcare provider. 
            Appointment cancellations must be made at least 24 hours in advance to avoid cancellation fees.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Payment Terms</h2>
          <p className='mb-4'>
            Payment for appointments is due at the time of booking unless otherwise specified. We accept various 
            payment methods including credit cards and digital payments. Refunds are subject to our refund policy.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Medical Disclaimer</h2>
          <p className='mb-4'>
            Cure Desk is not a healthcare provider and does not practice medicine. We do not provide medical advice, 
            diagnosis, or treatment. All medical decisions should be made in consultation with qualified healthcare professionals.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Limitation of Liability</h2>
          <p className='mb-4'>
            Cure Desk shall not be liable for any direct, indirect, incidental, special, or consequential damages 
            resulting from the use or inability to use our platform or services.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Account Termination</h2>
          <p className='mb-4'>
            We reserve the right to terminate or suspend your account at any time for violation of these terms or 
            for any other reason deemed necessary to protect our platform and users.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Changes to Terms</h2>
          <p className='mb-4'>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
            Your continued use of the platform constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Contact Information</h2>
          <p className='mb-4'>
            If you have any questions about these Terms and Conditions, please contact us at legal@curedesk.com 
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

export default TermsAndConditions