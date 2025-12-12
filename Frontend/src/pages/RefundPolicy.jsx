import React from 'react'

const RefundPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <div className="text-center mb-12">
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Refund Policy</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className='space-y-8 text-gray-700'>


        {/* General Refund Policy */}
        <section className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            General Refund Policy
          </h2>
          <p className='mb-4 text-lg leading-relaxed'>
            At LawBridge, we understand that plans may change, and you may need to cancel a scheduled legal consultation. 
            Our refund policy is designed to be fair to both clients and legal professionals while maintaining platform integrity.
          </p>
        </section>


        {/* Cancellation Timeframes */}
        <section className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <h2 className='text-2xl font-semibold mb-6 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cancellation Timeframes
          </h2>

          <div className='grid md:grid-cols-3 gap-6'>
            {/* 24+ Hours */}
            <div className='bg-gray-50 p-5 rounded-lg border border-gray-100'>
              <div className='flex items-center text-primary mb-3'>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className='text-lg font-semibold'>24+ Hours</h3>
              </div>
              <p className='text-gray-600'>Full refund for cancellations made 24 hours or more before the scheduled appointment.</p>
            </div>

            {/* 12–24 Hours */}
            <div className='bg-gray-50 p-5 rounded-lg border border-gray-100'>
              <div className='flex items-center text-yellow-600 mb-3'>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className='text-lg font-semibold'>12–24 Hours</h3>
              </div>
              <p className='text-gray-600'>50% refund for cancellations made between 12–24 hours before the appointment.</p>
            </div>

            {/* Less Than 12h */}
            <div className='bg-gray-50 p-5 rounded-lg border border-gray-100'>
              <div className='flex items-center text-red-600 mb-3'>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className='text-lg font-semibold'>Less Than 12h</h3>
              </div>
              <p className='text-gray-600'>No refund for cancellations made less than 12 hours before the appointment.</p>
            </div>
          </div>
        </section>


        {/* Emergency Cancellations */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5 12h14" />
            </svg>
            Emergency Cancellations
          </h2>
          <p className='mb-4'>
            In cases of emergencies or unavoidable circumstances, exceptions may be considered. 
            Clients may be required to submit documentation or evidence of the emergency to be eligible.
          </p>
        </section>


        {/* Lawyer Cancellations */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            Lawyer Cancellations
          </h2>
          <p className='mb-4'>
            If a lawyer or legal professional cancels your consultation, you will receive a full refund. 
            Our team will assist in rescheduling or arranging an alternative professional.
          </p>
        </section>


        {/* Technical Issues */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6M9 8h6" />
            </svg>
            Technical Issues
          </h2>
          <p className='mb-4'>
            If you encounter technical problems that prevent you from attending your consultation, 
            contact us immediately. We will attempt to resolve the issue or provide a refund when appropriate.
          </p>
        </section>


        {/* Refund Processing */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a5 5 0 00-10 0v2m-2 4h14" />
            </svg>
            Refund Processing
          </h2>
          <p className='mb-4'>Refunds will be processed as follows:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Credit card payments: 3–5 business days</li>
            <li>Digital wallet payments: 1–3 business days</li>
            <li>Bank transfers: 5–7 business days</li>
          </ul>
        </section>


        {/* How to Request Refund */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            How to Request a Refund
          </h2>
          <p className='mb-4'>To request a refund:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Log into your LawBridge account</li>
            <li>Go to the “My Appointments” section</li>
            <li>Select the appointment you want to cancel</li>
            <li>Follow the on-screen cancellation and refund steps</li>
            <li>For special cases, contact our support team</li>
          </ul>
        </section>


        {/* Non-Refundable Services */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
            </svg>
            Non-Refundable Services
          </h2>
          <p className='mb-4'>The following services are non-refundable:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Completed consultations</li>
            <li>No-show appointments</li>
            <li>Service or convenience fees</li>
            <li>Premium subscription fees (except during trial period)</li>
          </ul>
        </section>


        {/* Dispute Resolution */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V7" />
            </svg>
            Dispute Resolution
          </h2>
          <p className='mb-4'>
            If you wish to dispute a refund decision or have concerns about our refund process, 
            please contact us at refunds@lawbridge.com. Our team will review each case thoroughly.
          </p>
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
            For questions or refund-related assistance, please reach out to us at refunds@lawbridge.com 
            or contact our customer support line for help.
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

export default RefundPolicy
