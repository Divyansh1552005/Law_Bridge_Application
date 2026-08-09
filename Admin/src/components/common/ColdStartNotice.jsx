import React, { useState, useEffect } from "react";

const ColdStartNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Check if user has already dismissed the notice in this session
    const hasDismissed = sessionStorage.getItem("coldStartDismissed");
    if (!hasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("coldStartDismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-5 sm:p-6 max-w-sm w-full relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A456F7] to-indigo-500"></div>

        {/* Header */}
        <div className="flex items-start justify-between mb-3 mt-1">
          <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
            Server Wake-up!
          </h3>
          <button
            onClick={handleDismiss}
            className="bg-red-500 text-white hover:bg-red-600 transition-colors p-1 rounded-full shadow-sm"
            aria-label="Dismiss notice"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          Our free servers sleep when they are inactive. Click the links below to wake
          them up, then wait 1-2 minutes before using the app.
        </p>

        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-r-lg">
          <p className="text-xs text-red-700 font-semibold">
            Caution: If you do not wake up the servers, you will not be able
            to access the app's services (Login, Chatbot, etc.).
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-col gap-2 mb-4">
          <a
            href="https://law-bridge-application.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-xl text-[#A456F7] text-sm font-medium transition-colors group"
          >
            <span>Wake Main Server</span>
            <svg
              className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5 duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <a
            href="https://law-bridge-application-1.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-indigo-600 text-sm font-medium transition-colors group"
          >
            <span>Wake Chatbot Server</span>
            <svg
              className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5 duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={handleDismiss}
            className="text-sm font-semibold bg-[#A456F7] text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-colors w-full"
          >
            I have started the servers
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-gray-400 italic mt-3 text-center font-bold">
          This is a student project built for learning purposes. Not intended
          for real legal advice.
        </p>
      </div>
    </div>
  );
};

export default ColdStartNotice;
