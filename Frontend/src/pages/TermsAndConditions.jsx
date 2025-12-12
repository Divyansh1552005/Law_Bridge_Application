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
            By accessing and using the LawBridge platform, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms and Conditions. If you do not agree, 
            you must discontinue use of the platform immediately.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Service Description</h2>
          <p className='mb-4'>
            LawBridge is a legal consultation and appointment-booking platform that connects users 
            with lawyers and legal professionals. We facilitate scheduling, communication, and 
            discovery of legal services but do not provide legal advice ourselves.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>User Responsibilities</h2>
          <p className='mb-4'>As a user of LawBridge, you agree to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Provide accurate, updated, and complete information during registration</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Attend scheduled consultations or cancel them within the specified timeframe</li>
            <li>Treat legal professionals with respect and professionalism</li>
            <li>Pay applicable consultation or service fees</li>
            <li>Use the platform only for lawful purposes and comply with all applicable regulations</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Appointment Booking and Cancellation</h2>
          <p className='mb-4'>
            When you book a consultation through LawBridge, you enter into a direct 
            relationship with the selected lawyer or legal professional. 
            Cancellations must be made at least 24 hours prior to the scheduled time 
            to avoid cancellation charges or penalties.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Payment Terms</h2>
          <p className='mb-4'>
            Payments for legal consultations or related services are due at the time of 
            booking unless otherwise specified. We support multiple secure digital payment 
            methods. Refunds, if applicable, will be processed according to our refund policy.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Legal Disclaimer</h2>
          <p className='mb-4'>
            LawBridge does not offer legal advice, representation, or any form of legal service. 
            All advice, opinions, and services are provided solely by independent lawyers or 
            legal professionals. We are not responsible for the accuracy, quality, or outcome 
            of any legal consultation.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Limitation of Liability</h2>
          <p className='mb-4'>
            LawBridge shall not be held liable for any direct, indirect, incidental, or 
            consequential damages arising from your use of the platform, appointment 
            outcomes, or interactions with legal professionals.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Account Termination</h2>
          <p className='mb-4'>
            We reserve the right to suspend or terminate your account at any time for 
            violations of these Terms and Conditions, misuse of the platform, or any 
            activity deemed harmful to the platform or its users.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Changes to Terms</h2>
          <p className='mb-4'>
            LawBridge may update or modify these Terms and Conditions at any time. 
            Changes become effective immediately upon posting. Continued use of the 
            platform constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Contact Information</h2>
          <p className='mb-4'>
            For questions or concerns regarding these Terms and Conditions, 
            you may contact us at legal@lawbridge.com or through our support page.
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
