import React from 'react'

const RefundPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <div className="text-center mb-12">
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Refund Policy</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      
      <div className='space-y-8 text-gray-700'>
        <section className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            General Refund Policy
          </h2>
          <p className='mb-4 text-lg leading-relaxed'>
            At Cure Desk, we understand that sometimes circumstances change and you may need to cancel your appointment. 
            Our refund policy is designed to be fair to both patients and healthcare providers.
          </p>
        </section>

        <section className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <h2 className='text-2xl font-semibold mb-6 text-gray-800 flex items-center'>
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cancellation Timeframes
          </h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='bg-gray-50 p-5 rounded-lg border border-gray-100'>
              <div className='flex items-center text-primary mb-3'>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className='text-lg font-semibold'>24+ Hours</h3>
              </div>
              <p className='text-gray-600'>Full refund available for cancellations made 24 hours or more before the scheduled appointment time.</p>
            </div>
            <div className='bg-gray-50 p-5 rounded-lg border border-gray-100'>
              <div className='flex items-center text-yellow-600 mb-3'>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className='text-lg font-semibold'>12-24 Hours</h3>
              </div>
              <p className='text-gray-600'>50% refund available for cancellations made between 12-24 hours before the appointment.</p>
            </div>
            <div className='bg-gray-50 p-5 rounded-lg border border-gray-100'>
              <div className='flex items-center text-red-600 mb-3'>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className='text-lg font-semibold'>Less Than 12h</h3>
              </div>
              <p className='text-gray-600'>No refund available for cancellations made less than 12 hours before the appointment time.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Emergency Cancellations</h2>
          <p className='mb-4'>
            In case of medical emergencies or unforeseen circumstances, we may consider exceptions to our standard 
            refund policy. Please contact our support team with documentation of the emergency situation.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Doctor Cancellations</h2>
          <p className='mb-4'>
            If a healthcare provider cancels your appointment for any reason, you will receive a full refund. 
            We will also assist you in rescheduling with the same provider or finding an alternative appointment.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Technical Issues</h2>
          <p className='mb-4'>
            If you experience technical issues that prevent you from attending your virtual appointment, 
            please contact us immediately. We will work to resolve the issue or provide a full refund if necessary.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Refund Processing</h2>
          <p className='mb-4'>Refunds will be processed as follows:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Credit card payments: 3-5 business days</li>
            <li>Digital wallet payments: 1-3 business days</li>
            <li>Bank transfers: 5-7 business days</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>How to Request a Refund</h2>
          <p className='mb-4'>To request a refund:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Log into your Cure Desk account</li>
            <li>Go to My Appointments section</li>
            <li>Select the appointment you wish to cancel</li>
            <li>Click Cancel Appointment and follow the prompts</li>
            <li>For special circumstances, contact our support team</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Non-Refundable Services</h2>
          <p className='mb-4'>The following services are non-refundable:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Completed appointments</li>
            <li>No-show appointments</li>
            <li>Platform convenience fees (where applicable)</li>
            <li>Premium membership fees (unless cancelled within trial period)</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Dispute Resolution</h2>
          <p className='mb-4'>
            If you have concerns about our refund policy or need to dispute a refund decision, 
            please contact our customer service team at refunds@curedesk.com. We are committed to 
            resolving all disputes fairly and promptly.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Contact Us</h2>
          <p className='mb-4'>
            For questions about refunds or to request a refund outside of the standard process, 
            please contact us at refunds@curedesk.com or call our support line.
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