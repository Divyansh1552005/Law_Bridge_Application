import { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Message from "./Message";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";

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
      
      // Add user message to local state
      const userMessage = {
        role: "user",
        content: promptCopy,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send to backend API
      const { data } = await axios.post(
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
        };
        setMessages((prev) => [...prev, botMessage]);
        
        // Update current session with new messages
        if (currentSession) {
          setCurrentSession({
            ...currentSession,
            messages: [...(currentSession.messages || []), userMessage, botMessage]
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
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md">
                  <img
                    src={assets.legallogo}
                    alt="Law Bridge Logo"
                    className="w-20 h-20 mx-auto mb-4 opacity-80"
                  />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Legal Assistant
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Ask your legal question and get expert assistance
                  </p>
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
      
      {/* Sticky Input Footer - Properly positioned */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={onSubmit}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex gap-3 items-center"
          >
            <input
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              type="text"
              placeholder="Ask your legal question..."
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              required
              disabled={loadingResponse}
            />
            <button 
              disabled={loadingResponse} 
              type="submit"
              className="p-2 bg-[#A456F7] hover:bg-[#9146E6] disabled:bg-gray-300 rounded-xl transition-colors duration-200 group"
            >
              <img
                src={loadingResponse ? assets.stop_icon : assets.send_icon}
                alt={loadingResponse ? "loading" : "send"}
                className="w-5 h-5 group-hover:scale-105 transition-transform duration-200"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;