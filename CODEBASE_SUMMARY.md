# 📋 Law Bridge FullStack Codebase Summary

## 🏗️ **Project Architecture**

### **Three-Tier Application:**
- **Frontend** (React + Vite) - User Interface
- **Admin** (React + Vite) - Admin/Lawyer Panel  
- **Backend** (Node.js + Express) - API Server

---

## 🚀 **Frontend Application** (`/Frontend/`)

### **Tech Stack:**
- React 19.1.1 + Vite
- React Router DOM 7.9.5
- Tailwind CSS 4.1.16
- Axios, React Toastify, Lucide React

### **Routes Structure:**
```jsx
/ - Home page
/lawyers - Lawyers listing
/lawyers/:speciality - Filtered lawyers by specialty  
/login - User authentication
/about - About page
/contact - Contact page
/my-profile - User profile management
/my-appointments - User's appointment history
/appointment/:lawyerId - Book appointment with specific lawyer
/privacy-policy - Privacy policy
/terms-and-conditions - Terms & conditions
/refund-policy - Refund policy
/contact-us - Contact us page
/chatbot - AI chatbot interface
/resources - Legal resources
```

### **Key Components:**
- `Navbar.jsx` - Navigation with user profile
- `Footer.jsx` - Footer with social media links
- `MyAppointments.jsx` - User appointment management
- `Appointment.jsx` - Appointment booking interface

### **Context:**
- `AppContext.jsx` - User authentication, lawyer data, profile management

---

## 🏢 **Admin Application** (`/Admin/`)

### **Tech Stack:**
- React 19.1.1 + Vite  
- Stream.io Video SDK 1.26.0 (already installed)
- React Router DOM, Tailwind CSS
- Axios, React Toastify

### **Routes Structure:**
```jsx
/ - Empty route
/admin-dashboard - Admin dashboard
/all-appointments - All appointments management
/add-lawyer - Add new lawyer
/lawyer-list - List all lawyers
/lawyer-dashboard - Lawyer dashboard  
/lawyer-appointments - Lawyer's appointments
/lawyer-profile - Lawyer profile management
```

### **Key Pages:**
**Admin Pages:**
- `Dashboard.jsx` - Admin dashboard with statistics
- `AllAppointments.jsx` - Manage all appointments
- `AddLawyer.jsx` - Add new lawyers
- `LawyerList.jsx` - Manage lawyer list

**Lawyer Pages:**  
- `LawyerDashboard.jsx` - Lawyer dashboard with earnings/appointments
- `LawyerAppointments.jsx` - Lawyer's appointment history
- `LawyerProfile.jsx` - Lawyer profile management

### **Contexts:**
- `AdminContext.jsx` - Admin authentication & data
- `LawyerContext.jsx` - Lawyer authentication & data  
- `AppContext.jsx` - Shared utilities

---

## ⚙️ **Backend API** (`/Backend/`)

### **Tech Stack:**
- Node.js + Express 5.1.0
- MongoDB + Mongoose 8.19.2
- JWT Authentication
- Cloudinary (file uploads)
- Razorpay (payments)
- Bcrypt (password hashing)

### **API Routes:**

**User Routes** (`/api/user/`):
```javascript
POST /signup - User registration
POST /login - User authentication  
GET /get-profile - Get user profile (auth required)
PATCH /update-profile - Update profile (auth + file upload)
POST /book-appointment - Book appointment (auth required)
GET /appointments - Get user appointments (auth required)
POST /cancel-appointment - Cancel appointment (auth required)
POST /payment-razorpay - Razorpay payment (auth required)
POST /verify-razorpay - Verify payment (auth required)
```

**Lawyer Routes** (`/api/lawyer/`):
```javascript
POST /change-availability - Toggle availability (auth required)
GET /list - Get all lawyers (public)
POST /login - Lawyer authentication
POST /cancel-appointment - Cancel appointment (auth required)  
POST /complete-appointment - Mark appointment complete (auth required)
GET /profile - Get lawyer profile (auth required)
PATCH /update-profile - Update profile (auth required)
GET /dashboard - Get dashboard data (auth required)
GET /appointments - Get lawyer appointments (auth required)
```

**Admin Routes** (`/api/admin/`):
```javascript
POST /add-lawyer - Add new lawyer (file upload)
POST /login - Admin authentication
GET /all-lawyers - Get all lawyers (auth required)
GET /all-appointments - Get all appointments (auth required)
POST /cancel-appointment - Cancel any appointment (auth required)
GET /dashboard - Get admin dashboard (auth required)
POST /change-availability - Change lawyer availability (auth required)
```

### **Data Models:**

**User Model:**
- Personal info, email, password, phone, address, gender, DOB

**Lawyer Model:**  
- Personal info, speciality, degree, experience, about, fees, availability, slots

**Appointment Model:**
```javascript
{
  userId, lawyerId, slotDate, slotTime,
  userData, lawyerData, amount, date,
  cancelled, payment, isCompleted
}
```

### **Authentication:**
- JWT tokens for users (`token`)
- JWT tokens for lawyers (`lToken`)  
- JWT tokens for admin (`aToken`)
- Middleware: `authUser.js`, `authLawyer.js`, `authAdmin.js`

---

## 🎯 **Video Calling Integration Requirements**

### **Current State:**
- Stream.io SDK installed in Admin panel (v1.26.0)
- No video calling functionality implemented yet
- Appointment system fully functional with payment integration

### **Integration Points Needed:**

1. **Join Meeting Buttons:**
   - `MyAppointments.jsx` - Add "Join Meeting" for paid appointments
   - `LawyerDashboard.jsx` - Add "Join Meeting" for lawyers

2. **New Routes Required:**
   - Frontend: `/video-call/:appointmentId`
   - Admin: `/lawyer/video-call/:appointmentId`

3. **New Components Needed:**
   - `Frontend/src/pages/VideoCall.jsx` - User video interface
   - `Admin/src/pages/Lawyer/LawyerVideoCall.jsx` - Lawyer video interface

4. **Backend API Extensions:**
   - Video session token generation
   - Appointment validation for video calls
   - Stream.io server configuration

5. **Authentication Flow:**
   - Validate appointment exists and is paid
   - Generate Stream.io tokens for user/lawyer
   - Ensure both parties can join same room

### **Key Features to Implement:**
- ✅ **Appointment-based video calls** (only for paid appointments)
- ✅ **Role-based access** (user vs lawyer interfaces)  
- ✅ **Video/audio controls** (mute, camera, screen share)
- ✅ **Session management** (join/leave handling)
- ✅ **Real-time communication** via Stream.io

---

## 📁 **Project Structure:**

```
Law_Bridge_FullStack/
├── Frontend/                 # User Interface (React + Vite)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Route components
│   │   ├── context/         # React Context (AppContext.jsx)
│   │   └── assets/          # Static assets
│   └── package.json         # Dependencies
│
├── Admin/                   # Admin/Lawyer Panel (React + Vite)
│   ├── src/
│   │   ├── components/      # Admin components
│   │   ├── pages/
│   │   │   ├── Admin/       # Admin-specific pages
│   │   │   └── Lawyer/      # Lawyer-specific pages
│   │   └── context/         # AdminContext, LawyerContext
│   └── package.json         # Dependencies (includes Stream.io)
│
└── Backend/                 # API Server (Node.js + Express)
    ├── config/              # Database & third-party configs
    ├── controllers/         # Route handlers
    ├── middleware/          # Authentication middleware
    ├── models/              # MongoDB schemas
    ├── routes/              # API route definitions
    └── server.js           # Entry point
```

---

## 🔧 **Environment Variables Needed:**

### Backend (.env):
```bash
MONGODB_URI=mongodb://localhost:27017/lawbridge
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STREAM_API_KEY=your_stream_api_key      # For video calling
STREAM_SECRET=your_stream_secret        # For video calling
```

### Frontend (.env):
```bash
VITE_BACKEND_URL=http://localhost:3000
```

### Admin (.env):
```bash
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🚀 **Getting Started:**

1. **Backend Setup:**
   ```bash
   cd Backend
   pnpm install
   pnpm start
   ```

2. **Frontend Setup:**
   ```bash
   cd Frontend  
   pnpm install
   pnpm run dev
   ```

3. **Admin Setup:**
   ```bash
   cd Admin
   pnpm install  
   pnpm run dev
   ```

---

**This codebase is ready for Stream.io video calling integration! 🎥**