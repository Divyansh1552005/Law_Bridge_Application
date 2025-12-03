import { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Message from "./Message";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import api from "../../api/axiosClient";

const ChatBox = () => {
  const containerRef = useRef(null);
  const { sessionId } = useParams();
  
  const { 
    token, 
    userData, 
    backendUrl,
    sessionId: contextSessionId,
    setSessionId,
    currentSession,
    setCurrentSession,
    fetchUserChats,
    loadingResponse,
    setLoadingResponse
  } = useContext(AppContext);

  // Local state for prompt input and messages
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      toast.error("Login to send message");
      return;
    }
    
    if (!contextSessionId) {
      toast.error("No active chat session");
      return;
    }

    const promptCopy = prompt;
    setPrompt("");
    setLoadingResponse(true);

    try {
      
      // Add user message to local state with timestamp
      const userMessage = {
        role: "user",
        content: promptCopy,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send to backend API
      const { data } = await api.post(
        `${backendUrl}/api/message/get-message`,
        { 
          message: promptCopy,
          sessionId: contextSessionId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data) {
        const botMessage = {
          role: "assistant",
          content: data.response.content,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
        
        // Update current session with new messages (with timestamps)
        if (currentSession) {
          const userMessageWithTimestamp = { ...userMessage, createdAt: userMessage.createdAt };
          const botMessageWithTimestamp = { ...botMessage, createdAt: botMessage.createdAt };
          setCurrentSession({
            ...currentSession,
            messages: [...(currentSession.messages || []), userMessageWithTimestamp, botMessageWithTimestamp]
          });
        }
      }
    } catch (error) {
      toast.error("Error sending message");
      console.log(error);
      setPrompt(promptCopy);
    } finally {
      setLoadingResponse(false);
    }
  };

  // Load chat when sessionId from URL changes
  useEffect(() => {
    if (sessionId && sessionId !== contextSessionId) {
      setSessionId(sessionId);
      fetchUserChats(sessionId);
    }
  }, [sessionId]);

  // Update messages when currentSession changes
  useEffect(() => {
    if (currentSession && currentSession.messages) {
      setMessages(currentSession.messages);
    }
  }, [currentSession]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      {/* Chat Messages - Properly constrained container */}
      <div className="flex-1 overflow-hidden flex justify-center px-4">
        <div className="w-full max-w-4xl flex flex-col h-full">
          <div ref={containerRef} className="flex-1 overflow-y-auto py-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-gray-50">
                {/* Welcome card with fade-in animation */}
                <div className="animate-fade-in bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-10 md:p-12 shadow-lg border border-white/50 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
                  {/* Logo container with subtle hover effect */}
                  <div className="flex justify-center mb-6">
                    <div className="relative p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                      <img
                        src={assets.legallogo}
                        alt="Law Bridge Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90"
                      />
                    </div>
                  </div>
                  
                  {/* Typography with improved hierarchy */}
                  <div className="text-center space-y-3">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Legal Assistant
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium px-2">
                      Ask your legal question and get expert assistance
                    </p>
                  </div>
                  
                  {/* Subtle decorative element */}
                  <div className="flex justify-center mt-8">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-200 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}

            {/* Loading indicator with better styling */}
            {loadingResponse && (
              <div className="flex items-center gap-2 py-4">
                <div className="flex items-center gap-1.5 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-sm text-gray-500 ml-2">Thinking...</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Sticky Input Footer - Responsive */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={onSubmit}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-3 sm:p-4 flex gap-2 sm:gap-3 items-center"
          >
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="Ask your legal question..."
              className="flex-1 text-sm sm:text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent resize-none overflow-y-auto min-h-[40px] max-h-24 sm:max-h-32 leading-6"
              required
              disabled={loadingResponse}
              rows={1}
              onInput={(e) => {
                e.target.style.height = 'auto';
                const maxHeight = window.innerWidth < 640 ? 96 : 128; // 24 for mobile, 32 for desktop
                e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e);
                }
              }}
            />
            <button 
              disabled={loadingResponse} 
              type="submit"
              className="flex-shrink-0 p-2.5 sm:p-3 bg-[#A456F7] hover:bg-[#9146E6] disabled:bg-gray-300 rounded-xl transition-colors duration-200 group min-w-[40px] sm:min-w-[44px]"
            >
              <img
                src={loadingResponse ? assets.stop_icon : assets.send_icon}
                alt={loadingResponse ? "loading" : "send"}
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform duration-200 mx-auto"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;