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
    <div>
      {message.role === "user" ? (
        <div className="flex items-end justify-end gap-3 mb-4">
          <div className="flex flex-col gap-1 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="bg-[#A456F7] text-white p-4 rounded-2xl rounded-br-md shadow-sm">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            <span className="text-xs text-gray-400 text-right px-1">
              {moment(message.createdAt || message.timestamp || new Date()).format('h:mm A')}
            </span>
          </div>
          <img src={assets.user_icon} alt="user" className="w-8 h-8 rounded-full border-2 border-gray-100 flex-shrink-0" />
        </div>
      ) : (
        <div className="flex items-end gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex flex-col gap-1 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-sm">
              <div className="text-sm text-gray-800 leading-relaxed reset-tw">
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