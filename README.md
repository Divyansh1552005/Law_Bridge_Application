# LawBridge – Complete Legal Services Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-FastAPI-blue.svg)](https://www.python.org/)

LawBridge is a full-stack legal services platform that connects users with verified legal professionals and provides AI-powered legal assistance. The system supports secure authentication with Two-Factor Authentication, lawyer consultations, appointment booking, Razorpay payment processing, Stream.io-based video consultations, a credit-gated AI legal chatbot, and a production-grade RAG pipeline built over Indian Constitutional Law documents.

---

## Schema – ER Diagram

LawBridge Database Schema:
[https://dbdocs.io/officialdslc1552005/LawBridgeSchema?view=relationships](https://dbdocs.io/officialdslc1552005/LawBridgeSchema?view=relationships)

---

## Features

### User Features

- Secure registration with email verification via hashed tokens
- **Magic link passwordless login** for seamless authentication (15-minute expiry, single-use tokens)
- **Google OAuth 2.0 login** with PKCE (Proof Key for Code Exchange) for enhanced security
- JWT-based stateless authentication using short-lived access tokens and long-lived refresh tokens stored in HttpOnly cookies
- Optional Two-Factor Authentication (TOTP) via QR code or manual key entry; supports setup, verification, and disabling with password confirmation
- Password reset via time-limited email tokens
- Account deletion with OTP confirmation sent to registered email
- Profile management including name, phone, address, gender, date of birth, and profile image upload via Cloudinary
- Browse lawyers filtered by specialisation, city, experience, and fees with search and sort functionality
- Appointment booking with slot selection and conflict prevention
- Appointment scheduling constraints (maximum 2 appointments per day, and up to 3 appointments within a 5-day period)
- Razorpay payment integration for appointment fees with signature verification
- Appointment cancellation with automatic slot release back to the lawyer
- Real-time one-on-one video consultations using Stream.io Video SDK with call lifecycle tracking (join, leave, end, duration)
- **Automatic video call termination** via BullMQ background jobs when appointment time expires
- **Asynchronous transactional email** - all outbound emails (verification, password reset, delete-account OTP, magic link) are queued via BullMQ and sent by a background worker, so the request never blocks on the email provider
- AI legal chatbot with session-based conversation history, Markdown-rendered responses, and a daily credit system (10 credits per user per day, reset at midnight)
- **Document upload and analysis** - Upload personal legal documents (PDF, DOCX, TXT, images) for AI-powered Q&A. Files are uploaded directly from the browser to Cloudinary using a backend-issued signed URL (the file bytes never pass through the API server) and stored as **private ("authenticated") assets** - every read (viewing the document, or the chatbot's ingestion pipeline) goes through a freshly generated, short-lived signed URL rather than a permanent public link
- **Hybrid RAG mode** - Query both platform knowledge base and personal uploaded documents simultaneously
- **Recency-aware web search (Tavily)** - Automatically fetches recent legal updates when users ask for latest laws, amendments, or notifications
- **User-specific document namespaces** in Pinecone for isolated document storage per user
- Resources and legal information pages
- Contact, Privacy Policy, Terms and Conditions, and Refund Policy pages

### Lawyer Features

- Professional profile management including speciality, degree, experience, fees, about section, and profile image
- Availability toggle to open or close appointment slots
- Appointment dashboard with upcoming and completed consultation history
- Earnings tracking for completed appointments
- Video call participation using Stream.io with the same call lifecycle as users
- Lawyer-specific authentication with separate JWT flow

### Admin Features

- Admin authentication with dedicated JWT flow
- Add new lawyers to the platform with full profile and image upload
- View and manage all registered lawyers and users
- View and manage all appointments across the platform
- Revenue tracking and platform-wide analytics dashboard

---

## Tech Stack

### Frontend (React Application)

- React 19.1.1
- Vite 7.x
- Tailwind CSS 4.x with Typography plugin
- React Router DOM 7.x with data router (`RouterProvider`)
- Axios with a custom interceptor for automatic silent token refresh, 429 rate-limit handling, and daily credit exhaustion handling
- React Context API for global application state (`AppContext`)
- Stream.io Video React SDK 1.26.x for video consultations
- React Markdown with remark-gfm and PrismJS for syntax-highlighted chatbot responses
- Lucide React for icons
- React Toastify for notifications
- Moment.js for date formatting

### Admin Panel (React Application)

- React 19.1.1
- Vite 7.x
- Tailwind CSS 4.x
- React Router DOM 7.x
- Axios
- Stream.io Video React SDK 1.26.x
- Lucide React
- React Toastify

### Backend (Node.js API Server)

- Node.js with ES Modules
- Express.js 5.x
- MongoDB with Mongoose 8.x
- JWT access tokens (short-lived, sent via Authorization header) and refresh tokens (long-lived, stored in HttpOnly cookies)
- **BullMQ 6.x** for background job processing across three queues: `video-call` (automatic call termination), `email` (async transactional email delivery), and `maintenance` (scheduled DB cleanup — see below)
- **Google OAuth 2.0** with `google-auth-library` for secure social login with PKCE
- Bcrypt 6.x for password hashing
- Zod 4.x for request body validation
- **Presigned/direct-to-Cloudinary uploads** - the backend never receives raw file bytes; it issues signed Cloudinary upload params (`cloudinary.utils.api_sign_request`) and the browser uploads directly. User documents use Cloudinary's `authenticated` (private) delivery type with on-demand signed read URLs (`cloudinary.utils.private_download_url`); profile pictures stay on standard public delivery
- Cloudinary 2.x SDK for signing uploads/reads and for account-deletion cleanup
- Razorpay SDK 2.x for payment order creation and signature verification
- Stream.io Node SDK for video token generation and call management
- ioredis 5.x for Redis-backed rate limiting, chatbot credit tracking, and BullMQ job queues
- Helmet for HTTP security headers
- express-mongo-sanitize for MongoDB operator injection prevention
- Brevo (Sendinblue) for transactional email delivery, dispatched from a BullMQ worker rather than inline in the request handler
- otpauth and qrcode for TOTP-based Two-Factor Authentication
- cookie-parser for HttpOnly refresh token cookies

### AI Chatbot Service (Python FastAPI)

- Python 3.12
- FastAPI 0.123.x with Uvicorn 0.38.x
- LangChain 0.3.x ecosystem (langchain, langchain-core, langchain-community, langchain-text-splitters, langchain-google-genai, langchain-pinecone, langchain-tavily)
- Google Gemini 2.5 Flash as the language model via `langchain-google-genai`
- Google `gemini-embedding-001` embedding model (3072-dimensional vectors) for document and query embeddings
- Pinecone 7.x serverless vector database for similarity search over legal documents
- Tavily Search API via `langchain-tavily` for real-time legal web retrieval
- **Multi-namespace architecture** - Separate namespaces for platform knowledge base (`__default__`) and per-user document uploads (`user-uploads-{user_id}`)
- PyPDF2 and pypdf for PDF document loading
- **python-docx** for DOCX document processing
- **Pillow (PIL)** with **pytesseract** for OCR-based text extraction from images
- LangChain `RecursiveCharacterTextSplitter` for chunking (chunk size 1000, overlap 200)
- Custom production-safe batch embedding pipeline with resume-from-checkpoint, rate-limit retry logic, daily quota detection, and per-batch progress persistence
- **Hybrid retrieval mode** - Query platform knowledge base, user uploads, or both simultaneously
- **Hybrid RAG pipeline with LLM-based intent classification** - Web search and user document retrieval are triggered only when needed, not on every query
- **Gemini-powered intent classifier** - Determines `needs_web_search` and `needs_user_docs` per query, reducing unnecessary Pinecone and Tavily calls
- **Multilingual support** - Detects the user's language (Hindi, Hinglish, Tamil, Telugu, Bengali, etc.) and responds in the same language and style
- **Translated Tavily search queries** - Web search queries are automatically translated to English before searching, ensuring accurate results regardless of input language
- Session-aware RAG pipeline passing last 10 conversation turns as chat history into the prompt
- Secure key header (`secure_key`) for backend-to-chatbot authentication
- pydantic 2.x for request/response models
- python-dotenv for environment management

---

## Architecture Overview

```
                          Browser / Mobile
                               |
                 +-------------+-------------+
                 |                           |
           Frontend (React)          Admin Panel (React)
                 |                           |
                 +-------------+-------------+
                               |
                      Backend (Express.js)
                       |         |       |
                  MongoDB    Cloudinary  Redis
                       |
              RAG Chatbot (FastAPI)
                       |
               Pinecone Vector DB
               Google Gemini 2.5 Flash
```

- The Frontend and Admin Panel are separate React applications communicating with the Backend via REST APIs.
- The Backend issues short-lived access tokens (sent in the `Authorization` header) and long-lived refresh tokens (stored in HttpOnly cookies). The frontend Axios interceptor silently refreshes access tokens on 401 responses using a queuing mechanism to prevent duplicate refresh calls.
- Redis backs both the global rate limiter (fixed-window, per-IP, 200 requests per 60 seconds across all routes) and the per-route limiter, as well as the per-user chatbot credit counter which auto-expires at midnight.
- The chatbot service is an isolated FastAPI process running on port 4000. The Express backend proxies user messages to it, attaching a shared `RAG_SECRET_KEY` header. The chatbot validates this key before processing any request.
- Conversation history is persisted in MongoDB and the last 10 messages are forwarded to the RAG pipeline on each request to maintain conversational context.
- All sensitive credentials are environment-based with no hardcoded secrets.

---

## Project Structure

```
Law_Bridge_FullStack/
├── Frontend/                        # User-facing React application
│   ├── src/
│   │   ├── api/                     # Axios API modules (user, lawyer, appointment, chat, payment, video)
│   │   ├── components/              # Shared UI components (Navbar, Footer, Sidebar, etc.)
│   │   ├── context/                 # React Context (AppContext, token helpers)
│   │   ├── layouts/                 # Route layout wrappers
│   │   ├── pages/                   # Page components (Home, Lawyers, Appointment, Chatbot, etc.)
│   │   └── routes/                  # React Router configuration
│   ├── package.json
│   └── vite.config.js
│
├── Admin/                           # Admin and Lawyer panel React application
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Admin/               # Admin pages (Dashboard, LawyerList, AllAppointments, AddLawyer)
│   │   │   └── Lawyer/              # Lawyer pages (LawyerDashboard, LawyerAppointments, LawyerProfile, LawyerVideoCall)
│   │   └── routes/
│   ├── package.json
│   └── vite.config.js
│
├── Backend/                         # Express.js REST API server
│   ├── bullmq/                      # Background job queues/workers (video-call, email, maintenance)
│   │   ├── queues/                  # Queue definitions
│   │   ├── jobs/                    # Producers (enqueue jobs) + scheduled repeatable job registration
│   │   └── workers/                 # Consumers; index.js runs all workers as a standalone process
│   ├── config/                      # MongoDB, Cloudinary (+ signed upload/read helpers), Redis, Stream.io connections
│   ├── controllers/                 # Route handlers (user, lawyer, admin, chat, message, video, document)
│   ├── middleware/                  # Auth guards, rate limiters, credit manager, mongo sanitize
│   ├── models/                      # Mongoose models (User, Lawyer, Appointment, Document, Conversation, Message)
│   ├── routes/                      # Express routers (auth, user, lawyer, admin, chat, message, video, document)
│   ├── scripts/                     # One-off maintenance/migration scripts (not run automatically)
│   ├── services/                    # Email templates and mail service (called from the email worker, not inline)
│   ├── utils/                       # Token generation, hashing, cookie options, crypto helpers
│   ├── validations/                 # Zod schemas for request and token validation
│   └── server.js                    # Application entry point
│
├── chatbot/                         # Python FastAPI RAG chatbot service
│   ├── data/                        # PDF legal documents (Indian Constitutional Law)
│   ├── src/
│   │   ├── api/
│   │   │   └── chat.py              # FastAPI endpoints (/chat, /health)
│   │   ├── config/                  # Environment, Gemini, and Pinecone initialisation
│   │   ├── embeddings/              # Embedding creation pipeline
│   │   ├── loaders/                 # PDF loader using PyPDFLoader
│   │   ├── processors/              # Text chunker using RecursiveCharacterTextSplitter
│   │   └── vectorStore_Retrieval/   # Pinecone vector store, batch uploader, retriever
│   ├── main.py                      # Entry point (setup, server, or both)
│   └── req.txt                      # Python dependencies
│
├── doc_analyser/                    # Document analyser module (in development)
├── LICENSE
└── README.md
```

---

## Data Models

### User

Fields: `name`, `email`, `password` (bcrypt hashed), `image`, `phone`, `address`, `gender`, `dob`, `emailVerified`, `emailVerificationToken`, `emailVerificationExpiry`, `resetPasswordToken`, `resetPasswordExpiry`, `deleteOtp`, `deleteOtpExpiresAt`, `refreshToken`, `twoFactorEnabled`, `twoFactorSecret`, `credits` (dailyLimit, remaining, lastReset)

All four transient token pairs (`emailVerificationToken`/`Expiry`, `resetPasswordToken`/`Expiry`, `deleteOtp`/`deleteOtpExpiresAt`) are cleared explicitly on successful use, and a daily `maintenance` queue job additionally sweeps and `$unset`s any that expired without being used (see [Scheduled Maintenance Jobs](#scheduled-maintenance-jobs-bullmq)). These are **not** backed by a MongoDB TTL index — a TTL index deletes the entire document once the indexed field's date passes, which here would mean deleting the whole user account, not just the stale token.

### Lawyer

Fields: `name`, `email`, `password` (bcrypt hashed), `image`, `speciality`, `degree`, `experience`, `about`, `available`, `fees`, `slots_booked`, `address`, `date`, `refreshToken`

### Appointment

Fields: `userId`, `lawyerId`, `slotDate`, `slotTime`, `userData` (snapshot), `lawyerData` (snapshot), `amount`, `date`, `cancelled`, `payment`, `isCompleted`, `archived`, `videoCall` (callId, roomId, status, startedAt, endedAt, duration, userJoined, lawyerJoined), `createdAt`, `updatedAt`

`archived` (default `false`) is set by a daily maintenance job for cancelled/completed appointments older than a year, and is excluded by default from the admin and lawyer appointment-listing endpoints. Appointments are never hard-deleted by this job — `amount`/`payment`/`razorpayPaymentId` are financial records, so archival only hides old rows from operational dashboards without losing data.

### Document

Fields: `userId` (ref: User), `filename`, `fileType`, `cloudinaryUrl` (informational only — not directly fetchable, see below), `cloudinaryPublicId`, `chunksStored`, `pineconeNamespace`, `uploadDate`, `createdAt`, `updatedAt`

The Cloudinary asset behind a `document` is stored with `type: authenticated` (private). `cloudinaryUrl` is recorded for reference but cannot be fetched as-is; a fresh signed URL is generated on demand via `GET /documents/:id/signed-url` (expires after 5 minutes) whenever the file needs to be read — by the chatbot's ingestion pipeline or the "View Document" UI.

### Conversation

Fields: `userId` (ref: User), `sessionId`, `title`, `messageCount`, `lastMessageAt`, `lastMessagePreview`, `isPublic`, `shareToken`, `createdAt`, `updatedAt`. Compound unique index on `(userId, sessionId)`.

Messages are **not** stored inline on this document anymore (see `Message` below) — `conversation` now only holds session metadata plus a denormalized summary (`messageCount`/`lastMessageAt`/`lastMessagePreview`) so the chat-list sidebar never has to load message content.

### Message

Fields: `conversationId` (ref: Conversation, indexed), `userId` (ref: User, indexed — denormalized for cascade-deletes), `role` (`user`/`assistant`), `content`, `attachedDocument` (`{documentId, filename, fileType}`, user messages only), `sources` (`{title, url}[]`, assistant messages only), `createdAt`, `updatedAt`. Compound index on `(conversationId, createdAt)`.

Each chat message is its own document in a dedicated `message` collection, rather than an entry in a `conversation.messages[]` array. This was a deliberate split: a single conversation document previously accumulated its entire history inline, which risked approaching MongoDB's 16MB per-document limit on long-running sessions and forced a full document rewrite on every new message. `GET /chat/:sessionId` returns up to the most recent 200 messages per session; exports (`/chat/export`, `/chat/export/:sessionId`) fetch the complete history since those are explicit, infrequent user actions. The RAG chatbot is likewise only given the last 20 messages of context per request, not the full history, to keep per-request token cost and latency bounded as a conversation grows. A one-off script (`Backend/scripts/migrateMessagesToCollection.js`) moved all pre-existing `conversation.messages[]` data into this collection.

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/refresh` | Refresh access token using HttpOnly refresh token cookie |
| POST | `/logout` | Clear refresh token and revoke session |

### User (`/api/user`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register a new user account |
| POST | `/login` | Login; returns access token and sets refresh cookie |
| GET | `/google` | Initiate Google OAuth 2.0 login with PKCE |
| GET | `/google/callback` | Handle Google OAuth callback and exchange code for tokens |
| POST | `/google/exchange` | Exchange one-time code for access and refresh tokens |
| POST | `/magic-link` | Request magic link for passwordless login (rate limited: 3/hour) |
| GET | `/verify-magic-link/:token` | Verify magic link token and authenticate user |
| POST | `/verify-email` | Verify email with hashed token from email link |
| POST | `/resend-verification` | Resend email verification link |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password` | Reset password using token from email |
| GET | `/profile` | Get authenticated user profile |
| POST | `/upload-signature` | Get signed Cloudinary upload params for a direct browser-to-Cloudinary profile picture upload |
| PATCH | `/update-profile` | Update profile fields; pass `imageUrl` (from the direct Cloudinary upload) as JSON to change the picture |
| GET | `/appointments` | List all appointments for the authenticated user |
| POST | `/cancel-appointment` | Cancel a booked appointment |
| POST | `/create-payment-order` | Create a Razorpay payment order for a lawyer appointment |
| POST | `/verify-payment-and-create-appointment` | Verify Razorpay payment and finalize appointment booking |
| POST | `/request-delete-otp` | Request OTP to confirm account deletion |
| POST | `/verify-delete-otp` | Verify OTP and permanently delete account |
| POST | `/setup-2fa` | Generate TOTP secret and QR code for 2FA setup |
| POST | `/verify-2fa` | Verify TOTP code and enable 2FA |
| POST | `/disable-2fa` | Disable 2FA after password and TOTP verification |

### Lawyer (`/api/lawyer`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/login` | Lawyer login |
| GET | `/profile` | Get authenticated lawyer profile |
| POST | `/upload-signature` | Get signed Cloudinary upload params for a direct browser-to-Cloudinary profile picture upload |
| PATCH | `/update-profile` | Update lawyer profile; pass `imageUrl` (from the direct Cloudinary upload) as JSON to change the picture |
| GET | `/appointments` | Get lawyer's appointment list |
| POST | `/cancel-appointment` | Cancel an appointment |
| POST | `/complete-appointment` | Mark appointment as completed |
| GET | `/dashboard` | Get dashboard stats (earnings, appointments) |
| POST | `/change-availability` | Toggle availability status |

### Admin (`/api/admin`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/login` | Admin login |
| POST | `/upload-signature` | Get signed Cloudinary upload params for a new lawyer's profile picture |
| POST | `/add-lawyer` | Add a new lawyer; pass `imageUrl` (from the direct Cloudinary upload) as JSON |
| GET | `/lawyers` | List all lawyers |
| GET | `/users` | List all users |
| GET | `/appointments` | List all appointments |
| POST | `/cancel-appointment` | Cancel any appointment |
| GET | `/dashboard` | Platform-wide stats and revenue data |

### Video (`/api/video`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/get-token` | Generate Stream.io token and create video call room for an appointment |
| POST | `/update-status` | Update call status (join, leave, end) and calculate duration |
| GET | `/call-details/:appointmentId` | Retrieve video call metadata for an appointment |

### Chat (`/api/chat`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/create` | Create a new chat session |
| GET | `/:sessionId` | Get a session's metadata plus its most recent messages (up to 200), fetched from the `message` collection |
| GET | `/sessions` | Get all chat sessions for the user (uses denormalized `messageCount`/`lastMessagePreview`, no message-collection reads) |
| POST | `/update-title` | Update the title of a chat session |
| DELETE | `/delete` | Delete a chat session and cascade-delete its messages |
| GET | `/export` | Export all of the user's chats (JSON/PDF) — fetches full message history per conversation |
| GET | `/export/:sessionId` | Export a single chat (JSON/PDF) — full message history |
| GET | `/share/:sessionId` | Enable public sharing for a chat, returns a share URL |
| POST | `/unshare/:sessionId` | Disable public sharing for a chat |
| GET | `/shared/:shareToken` | Public, unauthenticated fetch of a shared chat's messages |

### Message (`/api/message`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/send` | Send a message; proxies to RAG chatbot (with the last 20 messages as context, not the full history), decrements credit, saves the user + assistant messages as separate `message` documents in the background, and updates the conversation's denormalized summary fields |

### Document (`/api/documents`)

Uploads go directly from the browser to Cloudinary using a signed upload — the file never passes through this API.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/upload-signature` | Step 1: validates mimetype/size/daily-limit, returns signed Cloudinary upload params (`type: authenticated`, private) |
| POST | `/confirm-upload` | Step 2: verifies the uploaded asset exists and belongs to the user, hands the chatbot a signed URL for ingestion, saves the document record |
| GET | `/` | Get all uploaded documents for the authenticated user |
| GET | `/:id/signed-url` | Get a fresh, short-lived (5 min) signed URL to view/download a private document |

### Chatbot Service (`FastAPI` on port 4000)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Service status |
| POST | `/chat` | Accepts `sessionId`, `history`, `message`, `user_id`, and `mode` (knowledge-base/user-uploads/both); returns RAG-generated legal response. For recency-focused queries (for example latest/new/amendment/notification/current), the chatbot also enriches responses with Tavily web results from trusted legal/government domains. Requires `secure_key` header. |
| POST | `/upload-document` | Accepts `{user_id, filename, signed_url, public_id}` as JSON (not multipart) — fetches the file itself from the signed Cloudinary URL, then extracts, chunks, embeds, and stores it in the user-specific Pinecone namespace. Requires `secure_key` header. |
| GET | `/health` | Health check |

---

## Authentication and Security Model

- Stateless JWT authentication with two-token architecture
- Access tokens are short-lived and transmitted via the `Authorization: Bearer` header
- Refresh tokens are long-lived and stored exclusively in HttpOnly, secure, sameSite cookies
- Refresh tokens are stored in the database and invalidated on logout or account deletion
- Email verification is required before full platform access
- TOTP-based Two-Factor Authentication using the `otpauth` library; setup delivers a QR code and a manual base32 key; a 2-window delta is accepted to tolerate clock skew
- Brute-force protection on TOTP verification using Redis-backed attempt counters
- Password hashing with bcrypt (salted)
- Zod schema validation on all sensitive request bodies
- Role-based access control enforced via three separate middleware guards: `authUser`, `authLawyer`, `authAdmin`
- MongoDB operator injection prevention via `express-mongo-sanitize`
- HTTP security headers via Helmet
- CORS restricted to an explicit allowlist (`ALLOWED_ORIGINS` env variable); non-origin requests blocked in production
- Global Redis-backed rate limiter: 200 requests per 60 seconds per IP across all routes
- Per-route rate limiter available for sensitive endpoints (e.g. login, 2FA verification)
- Chatbot service protected by a shared `RAG_SECRET_KEY` validated on every request

---

## Chatbot Credit System

Each user is allocated 10 chatbot queries per day. Credits are tracked in two places simultaneously:

- Redis: a per-user key (`credits:<userId>`) auto-expires at midnight using a TTL calculated to the next 00:00:00
- MongoDB: `credits.remaining` on the User document, decremented atomically with Redis and reset on the next day's first request

When credits are exhausted, the backend returns HTTP 403 with a `daily credit limit` message. The frontend Axios interceptor catches this and permanently disables the chat input for the session with a persistent toast notification.

---

## Document Upload & Hybrid RAG Flow

The platform supports a comprehensive document analysis flow, allowing users to query their own uploaded legal documents alongside the platform's core legal knowledge base:

### Document Upload Pipeline

Uploads are presigned/direct-to-Cloudinary — the file's bytes never pass through the Express backend or the Python chatbot's multipart parser. This replaced an earlier design where the file was buffered through Multer, forwarded to Cloudinary, and then re-sent as multipart bytes to the chatbot.

1. **Frontend → Backend (get a signed upload)**
   - User selects a file (PDF, DOCX, TXT, or image) on the frontend
   - Frontend calls `POST /documents/upload-signature` with `{filename, mimetype, size}`
   - Backend validates the mimetype and per-type size limit, checks the Redis-backed daily upload limit (2/day), and returns signed Cloudinary upload params — `type: authenticated`, scoped to a per-user folder — via `cloudinary.utils.api_sign_request`

2. **Frontend → Cloudinary (direct upload)**
   - The browser uploads the file straight to Cloudinary using the signed params, entirely bypassing the backend
   - The document is stored as a **private** Cloudinary asset — there is no permanent public URL for it

3. **Frontend → Backend → Python Chatbot API (confirm + ingest)**
   - Frontend calls `POST /documents/confirm-upload` with the Cloudinary `public_id`/`resourceType` it got back
   - Backend re-verifies the asset actually exists and belongs to this user (`cloudinary.api.resource`), generates a short-lived (5 min) signed read URL (`cloudinary.utils.private_download_url`), and calls the chatbot's `POST /upload-document` as JSON — `{user_id, filename, signed_url, public_id}` — instead of forwarding file bytes
   - If chatbot ingestion fails, the backend deletes the just-uploaded Cloudinary asset to avoid orphaned private files
   - File metadata (`cloudinaryPublicId`, `chunksStored`, `pineconeNamespace`, etc.) is saved in MongoDB

4. **Python Pipeline (Document Ingestion)**
   - Fetches the file itself with a plain HTTP GET against the signed URL (`requests.get`)
   - **Detection:** Identifies file type (PDF, DOCX, TXT, Image)
   - **Extraction:** 
     - PDF: PyPDF2/pypdf page-by-page extraction
     - DOCX: python-docx paragraph extraction
     - TXT: Direct UTF-8 reading
     - Images: Pillow + pytesseract OCR
   - **Chunking:** RecursiveCharacterTextSplitter (1000 chars, 200 overlap)
   - **Embedding & Storage:** Chunks vectorized with Google gemini-embedding-001 and stored in Pinecone user-specific namespace (`user-uploads-{user_id}`)
   - Returns success response with chunk count and namespace

### Hybrid RAG Query Flow

5. **Chat Flow (Multi-Source Q&A)**
   - User submits question with selected mode: `knowledge-base`, `user-uploads`, or `both`
   - Backend fetches the last 20 messages of this session from the `message` collection (not the full history) and forwards to `POST /chat` with `mode`, `user_id`, `message`, and that recent `history`
   - Python API performs parallel retrieval:
     - **knowledge-base mode:** Queries `__default__` namespace (platform legal documents)
     - **user-uploads mode:** Queries `user-uploads-{user_id}` namespace (user's documents)
     - **both mode:** Merges results from both namespaces
   - Top 3 most similar chunks retrieved per namespace using cosine similarity
   - Combined context + recent message history + current question sent to Google Gemini 2.5 Flash
   - Model generates response with source attribution

6. **Real-Time Legal Web Search (Tavily API)**
   - To ensure accuracy on current events and recent amendments, the system integrates the **Tavily API**.
   - **Smart Triggering:** Web search is conditionally triggered only if the user's query contains recency keywords (e.g., "latest", "recent", "amendment", "2024", "update").
   - **Domain Filtering:** Searches are strictly scoped to highly reliable Indian legal and government domains (e.g., `indiankanoon.org`, `sci.gov.in`, `livelaw.in`, `barandbench.com`, `indiacode.nic.in`) to prevent generic or hallucinated advice.
   - **Context Injection:** The real-time search results are seamlessly injected into the LLM prompt alongside the Pinecone vector data, allowing the model to synthesize core legal principles with breaking legal news.

7. **Response Delivery**
   - Answer returned to user with Markdown formatting
   - Citations indicate source: platform knowledge base vs user uploads
   - The user message and assistant reply are each saved as separate documents in the `message` collection (not appended to an array on the conversation document), and the conversation's `messageCount`/`lastMessageAt`/`lastMessagePreview` summary fields are updated

---

## RAG Pipeline (Core Knowledge Base)

The chatbot service implements a core Retrieval Augmented Generation pipeline:

1. PDF documents from the `chatbot/data/` directory are loaded page-by-page using `PyPDFLoader` with source filename metadata tagging.
2. Documents are chunked using `RecursiveCharacterTextSplitter` with a chunk size of 1000 characters and an overlap of 200 characters.
3. Chunks are embedded using Google `gemini-embedding-001` (3072 dimensions) and stored in a Pinecone serverless index (cosine similarity, AWS us-east-1).
4. The embedding upload pipeline processes batches of 25 chunks, enforces a 1-second delay between batches, retries on HTTP 429 with exponential backoff (up to 5 retries), stops immediately on daily quota exhaustion, and persists batch progress to `progress.json` for resumable uploads.
5. At query time, the top 3 most similar chunks are retrieved from Pinecone using similarity search.
6. The retrieved context, the last 10 messages of conversation history, and the current question are combined into a structured prompt and sent to Google Gemini 2.5 Flash.
7. The prompt instructs the model to answer strictly from context when relevant, fall back to general Indian legal guidance when not, avoid referencing the context or system prompt, and use Markdown formatting when detailed output is requested.
8. For recency-sensitive questions, the chatbot additionally performs a Tavily web search (filtered to Indian legal domains) and injects recent web context into the prompt before generation.

---

## Advanced Backend Features & Security

### Background Processing with BullMQ
The backend utilizes **BullMQ** and **Redis** for handling asynchronous background jobs, across three queues (`Backend/bullmq/`). All three workers run in-process with the main API server (imported directly in `server.js`), and can alternatively run as a fully separate process via `pnpm run worker` (`Backend/bullmq/workers/index.js`), which opens its own MongoDB connection for that case.

- **`video-call` queue — Video Call Auto-Termination:** `videoWorker` automatically ends video calls when appointment time expires. Calls scheduled to end at `slotEnd + 10 minutes` with automatic status updates and duration calculation. `QueueEvents` monitor job completion and failures with detailed logging.

- **`email` queue — Asynchronous Transactional Email:** every outbound email (signup verification, resend verification, forgot-password, delete-account OTP, magic link) is enqueued via `queueEmail({to, subject, html})` instead of being awaited inline in the request handler. `emailWorker` picks the job up and calls Brevo. This means a slow/unavailable email provider no longer blocks the HTTP response for signup, password reset, etc.

- **`maintenance` queue — Scheduled DB Cleanup:** <a id="scheduled-maintenance-jobs-bullmq"></a>two repeatable jobs, registered once at startup (`scheduleMaintenanceJobs()`, deduplicated by `jobId` so re-registering on every restart is a no-op) and run daily at 3am:
  - **`cleanup-expired-tokens`** — sweeps `userModel` for expired `emailVerificationToken`/`Expiry`, `resetPasswordToken`/`Expiry`, and `deleteOtp`/`deleteOtpExpiresAt` pairs and `$unset`s them via `updateMany`. This is intentionally a manual sweep rather than a MongoDB TTL index: a TTL index deletes the entire document once its indexed date passes, and these fields live directly on the user account document, so a TTL index here would delete user accounts, not just the stale token.
  - **`archive-old-appointments`** — flags (`archived: true`) cancelled/completed appointments older than one year. Never a hard delete, since `amount`/`payment`/`razorpayPaymentId` are financial/dispute records. The admin and lawyer appointment-listing endpoints exclude archived appointments by default; a user's own appointment history is unaffected.

All three queues share the same Redis connection (`config/redis.js`) and the same `defaultJobOptions` pattern (3 attempts, exponential backoff, auto-cleanup of completed/failed jobs).

### Robust Authentication & Security
- **OAuth2 & OIDC**: Secure Google login implemented using PKCE (Proof Key for Code Exchange) with:
  - State parameter for CSRF protection
  - Code verifier and challenge stored in secure HttpOnly cookies
  - One-time code exchange mechanism to securely pass tokens to frontend
  - Automatic account creation for new Google users
  - Prevention of password-based login for Google-authenticated accounts
- **Magic Link Authentication**: Passwordless login via time-limited email tokens (15-minute expiry, single-use)
- **Two-Factor Authentication (2FA)**: TOTP-based 2FA with:
  - QR code and manual key setup
  - 2-window delta for clock skew tolerance
  - Brute-force protection via Redis attempt counters
  - Password confirmation required for disabling
- **Security Middleware**: 
  - Global rate limiting: 200 requests/60s per IP across all routes
  - Route-specific rate limiting for sensitive endpoints (login, 2FA, magic link)
  - `helmet` for secure HTTP headers
  - `express-mongo-sanitize` for NoSQL injection prevention
  - CORS restricted to explicit allowlist
- **Data Privacy**: 
  - Secure account deletion with OTP verification
  - User chat data export capability
  - Per-user document isolation via Pinecone namespaces
  - Uploaded documents are stored as private ("authenticated") Cloudinary assets with no permanent public URL; access is always via a freshly generated, short-lived (5 minute) signed URL, checked for ownership before issuing

## Prerequisites

- Node.js v18 or higher
- pnpm v10 or higher
- Python 3.12
- MongoDB Atlas or a local MongoDB instance
- Redis instance (local or hosted, e.g. Upstash)
- Pinecone account with a 3072-dimensional cosine index
- Google Cloud project with Gemini API enabled
- Tavily API key for real-time web search
- Cloudinary account
- Razorpay account
- Stream.io account
- Brevo (Sendinblue) account for transactional email

---

## Installation

Clone the repository:

```
git clone https://github.com/Divyansh1552005/Law_Bridge_Application.git
cd Law_Bridge_FullStack
```

Install Frontend dependencies:

```
cd Frontend
pnpm install
```

Install Backend dependencies:

```
cd Backend
pnpm install
```

Install Admin dependencies:

```
cd Admin
pnpm install
```

Install Chatbot dependencies:

```
cd chatbot
python3 -m venv rag
source rag/bin/activate
pip install -r req.txt
```

---

## Environment Setup

Each service requires its own `.env` file. Refer to the `.env.example` file in the `Frontend`, `Backend`, `Admin`, and `chatbot` directories for the required variables.

Key variables by service:

**Backend**
- `MONGODB_URI` – MongoDB connection string
- `REDIS_URL` – Redis connection URL
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` – JWT signing secrets
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` – Google OAuth 2.0 credentials
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `STREAM_API_KEY`, `STREAM_API_SECRET`
- `RAG_CHATBOT_API_URL` – Base URL of the FastAPI chatbot service
- `RAG_SECRET_KEY` – Shared secret for backend-to-chatbot authentication
- `ALLOWED_ORIGINS` – Comma-separated list of allowed CORS origins
- `FRONTEND_URL` – Frontend URL for OAuth redirects
- `BREVO_API_KEY` or SMTP credentials for email delivery

**Chatbot**
- `GOOGLE_API_KEY` – Google Gemini API key
- `PINECONE_API_KEY` – Pinecone API key
- `PINECONE_INDEX` – Name of the Pinecone index
- `TAVILY_API_KEY` – Tavily API key used for recency-based web search
- `APP_SECRET_KEY` – Must match `RAG_SECRET_KEY` in the Backend

**Frontend / Admin**
- `VITE_BACKEND_URL` – URL of the Express backend

---

## Running the Application

Start the Backend:

```
cd Backend
pnpm start
```

Start the Frontend:

```
cd Frontend
pnpm run dev
```

Start the Admin panel:

```
cd Admin
pnpm run dev
```

Start the Chatbot service (first-time setup, creates embeddings then starts server):

```
cd chatbot
source rag/bin/activate
python main.py
```

Start the Chatbot service (subsequent runs, embeddings already exist):

```
cd chatbot
source rag/bin/activate
python main.py server
```

Create embeddings only without starting the server:

```
python main.py setup
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes with descriptive messages
4. Open a pull request against the main branch

---

## License

This project is licensed under the GPL-3.0 License. See the `LICENSE` file for details.

---

## Support

For support, contact: [lawbridgeorg@gmail.com](mailto:lawbridgeorg@gmail.com)

---

## Disclaimer

LawBridge is an informational platform and does not constitute legal advice. AI-generated responses are based on publicly available legal documents and are intended for educational purposes only. Users must consult a qualified legal professional before making any legal decisions.

---

Built by Divyansh
