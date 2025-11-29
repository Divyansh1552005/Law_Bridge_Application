import { assets } from "../../assets/assets";
import { useEffect } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import moment from "moment";

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div className="w-full">
      {message.role === "user" ? (
        /* User message - responsive layout with proper spacing */
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end gap-2 sm:gap-3 mb-4 w-full">
          {/* Message content container */}
          <div className="flex flex-col gap-1 w-full sm:w-auto sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="bg-[#A456F7] text-white p-3 sm:p-4 rounded-2xl rounded-br-md shadow-sm ml-auto sm:ml-0">
              <p className="text-sm leading-relaxed break-words">{message.content}</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 px-1">
              <span className="text-xs text-gray-400 sm:text-right">
                {moment(message.createdAt || message.timestamp || new Date()).format('h:mm A')}
              </span>
              {/* Avatar on mobile - inline with timestamp */}
              <img 
                src={assets.user_icon} 
                alt="user" 
                className="w-6 h-6 sm:hidden rounded-full border border-gray-100 flex-shrink-0" 
              />
            </div>
          </div>
          {/* Avatar on desktop - separate column */}
          <img 
            src={assets.user_icon} 
            alt="user" 
            className="hidden sm:block w-8 h-8 rounded-full border-2 border-gray-100 flex-shrink-0" 
          />
        </div>
      ) : (
        /* Assistant message - responsive layout */
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 mb-4 w-full">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 sm:self-end">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          {/* Message content container */}
          <div className="flex flex-col gap-1 flex-1 sm:flex-initial sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-2xl rounded-bl-md shadow-sm">
              <div className="text-sm text-gray-800 leading-relaxed reset-tw break-words">
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
            <span className="text-xs text-gray-400 px-1">
              {moment(message.createdAt || message.timestamp || new Date()).format('h:mm A')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;