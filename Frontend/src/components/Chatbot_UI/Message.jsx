import { assets } from "../../assets/assets";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import moment from "moment";
import remarkGfm from "remark-gfm";
import { toast } from "react-toastify";
import { getDocumentSignedUrl } from "../../api/document.api";

// Custom table component for mobile responsiveness
const ResponsiveTable = ({ children, ...props }) => (
  <div className="overflow-x-auto sm:overflow-x-visible -mx-4 sm:mx-0 my-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    <table
      {...props}
      className="min-w-max sm:min-w-full table-auto border-collapse text-sm"
    >
      {children}
    </table>
  </div>
);

const Message = ({ message }) => {
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  // documents are private on Cloudinary — fetch a fresh short-lived signed URL to view
  const handleOpenAttachedDocument = async () => {
    try {
      const { data } = await getDocumentSignedUrl(
        message.attachedDocument.documentId,
      );
      if (data.success) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error(data.message || "Could not open document");
      }
    } catch {
      toast.error("Could not open document");
    }
  };

  return (
    <div className="w-full">
      {message.role === "user" ? (
        /* User message - responsive layout with proper spacing */
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end gap-2 sm:gap-3 mb-4 w-full">
          {/* Message content container */}
          <div className="flex flex-col gap-1 w-full sm:w-auto sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
            {message.attachedDocument && (
              <button
                type="button"
                onClick={handleOpenAttachedDocument}
                className="flex items-center gap-2 mb-1 p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-purple-700 text-sm transition-colors self-end w-fit max-w-full"
              >
                <span className="flex-shrink-0">📎</span>
                <span className="truncate font-medium">
                  {message.attachedDocument.filename}
                </span>
              </button>
            )}
            <div className="bg-[#A456F7] text-white p-3 sm:p-4 rounded-2xl rounded-br-md shadow-sm ml-auto sm:ml-0">
              <p className="text-base leading-relaxed break-words">
                {message.content}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 px-1">
              <span className="text-xs text-gray-400 sm:text-right">
                {moment(
                  message.createdAt || message.timestamp || new Date(),
                ).format("h:mm A")}
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
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
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
                        <th
                          {...props}
                          className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-900 whitespace-nowrap sm:whitespace-pre-wrap min-w-[120px] sm:min-w-0"
                        >
                          {children}
                        </th>
                      ),
                      td: ({ children, ...props }) => (
                        <td
                          {...props}
                          className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap sm:whitespace-pre-wrap min-w-[120px] sm:min-w-0"
                        >
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

            {/* Sources Section */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${showSources ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span>Sources ({message.sources.length})</span>
                </button>
                {showSources && (
                  <div className="mt-2 flex flex-col gap-1.5 bg-gray-50/80 border border-gray-100 p-2.5 rounded-xl w-fit max-w-full">
                    {message.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-600 hover:text-purple-600 transition-colors group"
                      >
                        <svg
                          className="w-3.5 h-3.5 mt-0.5 text-gray-400 group-hover:text-purple-500 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <span className="break-words line-clamp-2">
                          {src.title}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <span className="text-xs text-gray-400 px-1 mt-0.5">
              {moment(
                message.createdAt || message.timestamp || new Date(),
              ).format("h:mm A")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
