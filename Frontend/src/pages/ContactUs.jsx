import React from "react";

const ContactUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Contact Us
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We're here to help with any questions or concerns regarding our legal
          consultation and appointment platform. Reach out to us through the
          following contact methods.
        </p>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Email Card */}
          <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors">
              Email Us
            </h3>
            <a
              href="mailto:support@lawbridge.com"
              className="text-primary group-hover:text-white font-semibold text-sm break-all transition-colors block mb-2"
            >
              support@lawbridge.com
            </a>
            <p className="text-gray-500 group-hover:text-white/80 transition-colors text-sm">
              We'll respond within 24 hours
            </p>
          </div>

          {/* Phone Card */}
          <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors">
              Call Us
            </h3>
            <a
              href="tel:+918888888888"
              className="text-primary group-hover:text-white font-semibold text-lg transition-colors block mb-2"
            >
              +91 88888 88888
            </a>
            <p className="text-gray-500 group-hover:text-white/80 transition-colors text-sm">
              Mon-Fri: 9AM - 7PM
            </p>
          </div>

          {/* Location Card */}
          <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors">
              Visit Our Office
            </h3>
            <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm leading-relaxed">
              Court Road, Near District Court
              <br />
              Bhiwani-127021, Haryana
            </p>
          </div>
        </div>

        {/* Business Hours */}
        <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-100 rounded-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Business Hours</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
              <span className="font-semibold text-gray-800 text-base">
                Monday - Friday
              </span>
              <span className="font-bold text-primary text-base">
                9:00 AM - 7:00 PM
              </span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
              <span className="font-semibold text-gray-800 text-base">
                Saturday
              </span>
              <span className="font-bold text-primary text-base">
                10:00 AM - 5:00 PM
              </span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
              <span className="font-semibold text-gray-800 text-base">
                Sunday
              </span>
              <span className="font-bold text-red-600 text-base">Closed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Department Contacts
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-white transition-colors">
              Technical Support
            </h3>
            <a
              href="mailto:tech@lawbridge.com"
              className="text-gray-600 group-hover:text-white/90 transition-colors text-sm hover:underline"
            >
              tech@lawbridge.com
            </a>
          </div>
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-white transition-colors">
              Billing Inquiries
            </h3>
            <a
              href="mailto:billing@lawbridge.com"
              className="text-gray-600 group-hover:text-white/90 transition-colors text-sm hover:underline"
            >
              billing@lawbridge.com
            </a>
          </div>
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-white transition-colors">
              Lawyer Partnerships
            </h3>
            <a
              href="mailto:partners@lawbridge.com"
              className="text-gray-600 group-hover:text-white/90 transition-colors text-sm hover:underline"
            >
              partners@lawbridge.com
            </a>
          </div>
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:bg-primary text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-white transition-colors">
              Privacy Concerns
            </h3>
            <a
              href="mailto:privacy@lawbridge.com"
              className="text-gray-600 group-hover:text-white/90 transition-colors text-sm hover:underline"
            >
              privacy@lawbridge.com
            </a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <svg
              className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Important Notice
              </h3>
              <p className="text-yellow-800 text-sm leading-relaxed">
                For legal emergencies, please contact your nearest police
                station or legal authority. Do not rely on this platform for
                urgent legal matters.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <svg
              className="w-6 h-6 text-red-600 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Emergency Legal Support
              </h3>
              <p className="text-red-800 text-sm leading-relaxed">
                <strong>Urgent Legal Situations:</strong> If you require
                immediate legal assistance (e.g., FIR issues, police matters),
                please reach out to your local legal help center or emergency
                services. This page is not monitored for emergency requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
