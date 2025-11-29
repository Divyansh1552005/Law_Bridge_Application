import { assets } from "../../assets/assets";
import { useEffect } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import moment from "moment";
import remarkGfm from 'remark-gfm';

// Custom table component for mobile responsiveness
const ResponsiveTable = ({ children, ...props }) => (
    <div className="overflow-x-auto sm:overflow-x-visible -mx-4 sm:mx-0 my-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table {...props} className="min-w-max sm:min-w-full table-auto border-collapse text-sm">
            {children}
        </table>
    </div>
)


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
                            <p className="text-base leading-relaxed break-words">{message.content}</p>
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
                    <div className="flex flex-col gap-1 w-full flex-1">
                        <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-2xl rounded-bl-md shadow-sm">
                            <div className="w-full overflow-x-auto">
                                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-purple-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-purple-400 prose-blockquote:text-gray-700 prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800">
                                    <Markdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ResponsiveTable,
                                            th: ({ children, ...props }) => (
                                                <th {...props} className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-900 whitespace-nowrap sm:whitespace-pre-wrap min-w-[120px] sm:min-w-0">
                                                    {children}
                                                </th>
                                            ),
                                            td: ({ children, ...props }) => (
                                                <td {...props} className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap sm:whitespace-pre-wrap min-w-[120px] sm:min-w-0">
                                                    {children}
                                                </td>
                                            ),
                                        }}
                                    >
                                        {message.content}
                                    </Markdown>
                                </div>
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