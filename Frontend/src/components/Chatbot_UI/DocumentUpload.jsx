import { useRef, useState, useEffect } from "react";
import useApp from "../../context/useApp";

// ── File-type icons shown in the "My Documents" list ─────────────────────────
const FILE_TYPE_ICON = {
  pdf: (
    <svg
      className="w-4 h-4 text-red-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  ),
  docx: (
    <svg
      className="w-4 h-4 text-blue-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  ),
  txt: (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  ),
  image: (
    <svg
      className="w-4 h-4 text-emerald-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

// bg + text colours for the file-type badge pill in "Upload New"
const FILE_TYPE_STYLE = {
  pdf: {
    bg: "bg-red-50",
    text: "text-red-500",
    label: "PDF",
    maxSize: "15 MB",
  },
  docx: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    label: "DOCX",
    maxSize: "5 MB",
  },
  txt: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    label: "TXT",
    maxSize: "2 MB",
  },
  image: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    label: "Image",
    maxSize: "5 MB",
  },
};

// ── Accepted file cards shown in the Upload New section ───────────────────────
const UPLOAD_CARDS = [
  {
    type: "pdf",
    icon: (
      <svg
        className="w-5 h-5 text-red-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    type: "docx",
    icon: (
      <svg
        className="w-5 h-5 text-blue-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    type: "txt",
    icon: (
      <svg
        className="w-5 h-5 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    type: "image",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const DocumentUpload = ({ onDocumentUploaded }) => {
  const { uploadDocument, uploadingDocument, uploadsRemaining, userDocuments } =
    useApp();

  const fileInputRef = useRef(null);
  const pickerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target))
        setShowPicker(false);
    };
    if (showPicker) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showPicker]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShowPicker(false);
    const data = await uploadDocument(file);
    if (data && onDocumentUploaded) {
      onDocumentUploaded({
        documentId: data.document._id,
        filename: data.document.filename,
        fileType: data.document.fileType,
      });
    }
    e.target.value = "";
  };

  // Select existing — zero API calls, zero credit cost
  const handleSelectExisting = (doc) => {
    setShowPicker(false);
    if (onDocumentUploaded) {
      onDocumentUploaded({
        documentId: doc._id,
        filename: doc.filename,
        fileType: doc.fileType,
      });
    }
  };

  const hasExistingDocs = userDocuments && userDocuments.length > 0;
  const limitReached = uploadsRemaining === 0;

  return (
    <div className="relative flex items-center" ref={pickerRef}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          if (!uploadingDocument) setShowPicker((p) => !p);
        }}
        disabled={uploadingDocument}
        title="Attach a document"
        className="shrink-0 p-2.5 sm:p-3 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors duration-200"
      >
        {uploadingDocument ? (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        )}
      </button>

      {/* ── Picker popover ─────────────────────────────────────────────────── */}
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* ── Upload New ── */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Upload New
            </p>

            {/* Drop-zone style button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={limitReached}
              className="w-full group relative rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-400 bg-gray-50 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 p-4"
            >
              {/* Cloud-upload icon */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-purple-300 group-hover:bg-purple-100 flex items-center justify-center transition-colors shadow-sm">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 group-hover:text-purple-700 transition-colors">
                    {limitReached
                      ? "Daily limit reached"
                      : "Click to browse files"}
                  </p>
                  {!limitReached && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      PDF, DOCX, TXT, or Image
                    </p>
                  )}
                </div>
              </div>

              {/* Credits badge */}
              {!limitReached && (
                <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">
                  {uploadsRemaining} left
                </span>
              )}
            </button>

            {/* File-type chips */}
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              {UPLOAD_CARDS.map(({ type, icon }) => {
                const s = FILE_TYPE_STYLE[type];
                return (
                  <div
                    key={type}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg ${s.bg}`}
                  >
                    {icon}
                    <div className="text-left">
                      <p
                        className={`text-[10px] font-bold leading-none ${s.text}`}
                      >
                        {s.label}
                      </p>
                      <p className="text-[9px] text-gray-400 leading-none mt-0.5">
                        up to {s.maxSize}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── My Documents ── */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                My Documents
              </p>
              {hasExistingDocs && (
                <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                  Free reuse
                </span>
              )}
            </div>

            {!hasExistingDocs ? (
              <div className="flex flex-col items-center gap-1 py-5 text-center">
                <svg
                  className="w-6 h-6 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-xs text-gray-400">No documents yet</p>
                <p className="text-[10px] text-gray-300">
                  Upload one above to get started
                </p>
              </div>
            ) : (
              <ul className="space-y-0.5 max-h-44 overflow-y-auto">
                {userDocuments.map((doc) => (
                  <li key={doc._id}>
                    <button
                      type="button"
                      onClick={() => handleSelectExisting(doc)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                    >
                      {/* Icon */}
                      <div className="shrink-0 w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-white border border-transparent group-hover:border-gray-200 flex items-center justify-center transition-all">
                        {FILE_TYPE_ICON[doc.fileType] ?? FILE_TYPE_ICON.txt}
                      </div>

                      {/* Name + type — min-w-0 needed for truncate to work */}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-medium text-gray-700 truncate leading-tight">
                          {doc.filename}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5 uppercase">
                          {doc.fileType}
                        </p>
                      </div>

                      {/* Use label */}
                      <span className="shrink-0 text-[10px] font-semibold text-gray-300 group-hover:text-purple-500 transition-colors">
                        Use
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
