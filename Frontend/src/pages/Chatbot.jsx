import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/Chatbot_UI/Sidebar';
import ChatBox from '../components/Chatbot_UI/ChatBox';
import { toast } from 'react-toastify';

const Chatbot = () => {
  const { sessionId: urlSessionId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const {
    token,
    userData,
    sessionId,
    setSessionId,
    currentSession,
    fetchUserChats,
    createNewChat
  } = useContext(AppContext);

  // Handle URL sessionId parameter
  useEffect(() => {
    if (urlSessionId && urlSessionId !== sessionId) {
      setSessionId(urlSessionId);
      // Load the specific chat session
      if (token && userData) {
        fetchUserChats(urlSessionId);
      }
    }
  }, [urlSessionId, token, userData, sessionId, setSessionId, fetchUserChats]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      toast.error("Please login to access chatbot");
      // You can redirect to login page here if needed
      return;
    }
  }, [token]);

  // Create initial chat if no session exists
  useEffect(() => {
    if (token && userData && !sessionId && !urlSessionId) {
      createNewChat();
    }
  }, [token, userData, sessionId, urlSessionId, createNewChat]);

  if (!token || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please login to access the legal chatbot</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed Sidebar - 260px width */}
      <div className={`fixed left-0 top-0 h-full w-64 z-30 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>

      {/* Main Chat Container - Fluid with proper spacing */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Toggle Button - Always visible */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 left-4 z-40 p-3 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        {/* Header - Clean light design */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Legal Assistant
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {currentSession 
                  ? `Active Session`
                  : 'Start a new legal consultation'
                }
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* ChatBox - Properly contained and responsive */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
