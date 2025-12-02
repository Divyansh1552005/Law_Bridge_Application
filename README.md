# 🏛️ LawBridge - Complete Legal Services Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-FastAPI-blue.svg)](https://www.python.org/)

LawBridge is a comprehensive full-stack legal services platform that connects users with legal professionals and provides AI-powered legal assistance. The platform features lawyer consultations, appointment booking, video consultations, document analysis, and an intelligent RAG-based chatbot for legal queries.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### User Features
- 🔐 **User Authentication** - Secure JWT-based authentication system
- 👨‍⚖️ **Lawyer Directory** - Browse and search for lawyers by specialization
- 📅 **Appointment Booking** - Schedule consultations with lawyers
- 💳 **Payment Integration** - Razorpay payment gateway for secure transactions
- 🎥 **Video Consultations** - Real-time video calls using Stream.io
- 🤖 **AI Legal Assistant** - RAG-based chatbot powered by Indian Constitutional Law documents
- 📄 **Document Analysis** - AI-powered legal document analyzer
- 💬 **Chat History** - Save and manage conversation history
- 📱 **Responsive Design** - Mobile-first, fully responsive UI

### Admin Features
- 📊 **Dashboard** - Analytics and overview of platform activity
- 👥 **User Management** - Manage users and lawyers
- 📈 **Appointment Management** - Track and manage all appointments
- 💰 **Revenue Tracking** - Monitor payments and transactions

### Lawyer Features
- 📋 **Profile Management** - Create and manage professional profiles
- 📅 **Availability Management** - Set working hours and availability
- 💼 **Appointment Dashboard** - View and manage bookings
- 💵 **Earnings Tracking** - Monitor consultation fees and earnings

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.x with Typography plugin
- **Routing**: React Router DOM 7.x
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: 
  - Lucide React (Icons)
  - React Toastify (Notifications)
  - React Markdown (Markdown rendering)
  - Prism.js (Code syntax highlighting)
- **Video**: Stream.io Video React SDK
- **Date Handling**: Moment.js

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Payment Gateway**: Razorpay
- **Video Service**: Stream.io Node SDK
- **Validation**: Zod

### AI Chatbot
- **Framework**: FastAPI (Python)
- **Vector Database**: ChromaDB
- **Embeddings**: Sentence Transformers
- **LLM**: Groq API (Llama 3 models)
- **Document Processing**: LangChain
- **RAG Implementation**: Custom implementation with Indian Constitutional Law corpus

### Admin Panel
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Build**: Vite

## 📁 Project Structure

```
Law_Bridge_FullStack/
├── Frontend/                 # React user-facing application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context for state management
│   │   ├── assets/          # Static assets (images, icons)
│   │   └── main.jsx         # Application entry point
│   ├── public/              # Public static files
│   └── package.json
│
├── Backend/                  # Express.js API server
│   ├── config/              # Configuration files (DB, Cloudinary)
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & validation middleware
│   ├── utils/               # Utility functions
│   ├── validations/         # Zod validation schemas
│   └── server.js            # Server entry point
│
├── Admin/                    # React admin dashboard
│   ├── src/
│   │   ├── components/      # Admin components
│   │   ├── pages/           # Admin pages
│   │   └── context/         # Admin context
│   └── package.json
│
├── chatbot/                  # Python FastAPI RAG chatbot
│   ├── src/
│   │   ├── api/             # FastAPI endpoints
│   │   ├── embeddings/      # Vector embeddings creation
│   │   ├── rag/             # RAG implementation
│   │   └── prompts/         # LLM prompts
│   ├── data/                # Legal document corpus
│   ├── rag/                 # Virtual environment
│   ├── main.py              # FastAPI app entry point
│   └── req.txt              # Python dependencies
│
├── doc_analyser/             # Document analysis service
│   └── ...
│
├── LICENSE                   # MIT License
└── README.md                 # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **pnpm** (v10.x or higher) - `npm install -g pnpm`
- **Python** (v3.10 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Divyansh1552005/Law_Bridge_Application.git
cd Law_Bridge_FullStack
```

### 2. Install Frontend Dependencies

```bash
cd Frontend
pnpm install
```

### 3. Install Backend Dependencies

```bash
cd ../Backend
pnpm install
```

### 4. Install Admin Dependencies

```bash
cd ../Admin
pnpm install
```

### 5. Setup Python Chatbot

```bash
cd ../chatbot
python3 -m venv rag
source rag/bin/activate  # On Windows: rag\Scripts\activate
pip install -r req.txt
```

## 🔧 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lawbridge
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lawbridge

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stream.io Configuration
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Server Configuration
PORT=4000
NODE_ENV=development

# Admin Configuration
ADMIN_EMAIL=admin@lawbridge.com
ADMIN_PASSWORD=admin123
```

### Frontend Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CHATBOT_URL=http://localhost:8000
```

### Admin Environment Variables

Create a `.env` file in the `Admin/` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Chatbot Environment Variables

Create a `.env` file in the `chatbot/` directory:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# ChromaDB Configuration
CHROMA_DB_PATH=./chroma_db

# Model Configuration
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=llama-3.3-70b-versatile

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

## 🏃 Running the Application

### Start MongoDB

Ensure MongoDB is running on your system:

```bash
# macOS/Linux
sudo systemctl start mongodb
# or
mongod

# Windows
net start MongoDB
```

### Start Backend Server

```bash
cd Backend
pnpm start
```

The backend will start on `http://localhost:4000`

### Start Frontend Development Server

```bash
cd Frontend
pnpm run dev
```

The frontend will start on `http://localhost:5173`

### Start Admin Panel

```bash
cd Admin
pnpm run dev
```

The admin panel will start on `http://localhost:5174`

### Start Chatbot Service

```bash
cd chatbot
source rag/bin/activate  # Activate virtual environment
python main.py
```

The chatbot API will start on `http://localhost:8000`

## 🌐 Application URLs

- **User Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:4000
- **Chatbot API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (FastAPI Swagger UI)

## 📚 API Documentation

### Backend API Endpoints

#### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/get-profile` - Get user profile (protected)

#### Lawyers
- `GET /api/user/lawyers` - Get all lawyers
- `GET /api/user/lawyers/:id` - Get lawyer by ID
- `POST /api/user/book-appointment` - Book appointment (protected)

#### Appointments
- `GET /api/user/appointments` - Get user appointments (protected)
- `POST /api/user/cancel-appointment` - Cancel appointment (protected)

#### Payments
- `POST /api/user/payment-razorpay` - Process Razorpay payment (protected)

#### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/appointments` - Get all appointments
- `POST /api/admin/add-lawyer` - Add new lawyer
- `GET /api/admin/dashboard` - Admin dashboard stats

#### Lawyer Routes
- `POST /api/lawyer/login` - Lawyer login
- `GET /api/lawyer/appointments` - Get lawyer appointments
- `POST /api/lawyer/complete-appointment` - Mark appointment complete
- `GET /api/lawyer/profile` - Get lawyer profile
- `PUT /api/lawyer/profile` - Update lawyer profile

### Chatbot API Endpoints

- `POST /chat` - Send message to chatbot
- `POST /chat/session` - Create new chat session
- `GET /chat/history` - Get chat history
- `DELETE /chat/session/{session_id}` - Delete chat session

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- CORS configuration
- Input validation with Zod
- Rate limiting (recommended to add)
- Environment variable protection

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd Frontend
npm test

# Chatbot tests
cd chatbot
pytest
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd Frontend
pnpm run build
```

2. Deploy the `dist/` folder to your hosting service

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. Set environment variables on your hosting platform
2. Deploy the Backend directory
3. Ensure MongoDB connection string points to production database

### Chatbot Deployment (Railway/Render)

1. Build Docker image or deploy directly
2. Set environment variables
3. Ensure ChromaDB persistence volume is configured

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Follow ESLint configuration for JavaScript/React
- Use PEP 8 style guide for Python
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Divyansh** - [@Divyansh1552005](https://github.com/Divyansh1552005)

## 🙏 Acknowledgments

- Indian Constitutional Law corpus for chatbot training
- Stream.io for video consultation infrastructure
- Razorpay for payment processing
- Cloudinary for media management
- Groq for LLM API access
- Open source community for various libraries and tools

## 📞 Support

For support, email support@lawbridge.com or open an issue in the GitHub repository.

## 🗺️ Roadmap

- [ ] Add email notifications for appointments
- [ ] Implement SMS reminders
- [ ] Add more payment gateway options
- [ ] Enhance AI chatbot with more legal domains
- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with legal case management systems

## ⚠️ Disclaimer

This platform is for informational purposes only and does not constitute legal advice. Users should consult with qualified legal professionals for specific legal matters.

---

Made with ❤️ by the LawBridge Team
