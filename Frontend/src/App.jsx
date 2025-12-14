import { useState } from 'react'
import './index.css'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Lawyers from './pages/Lawyers.jsx'
import Login from './pages/Login.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MyProfile from './pages/MyProfile.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import Appointment from './pages/Appointment.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './pages/Chatbot.jsx'
import Resources from './pages/Resources.jsx'
import VideoCall from './pages/VideoCall.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ResetPassword from './pages/ResetPassword.jsx'
import Verify from "./pages/Verify.jsx"
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
 

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>
      
      <Routes>
        {/* Chatbot routes - separate layout without navbar/footer */}
        <Route path="/chatbot" element={
          <ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/chatbot/:sessionId" element={
          <ProtectedRoute><Chatbot /></ProtectedRoute>} />
        
        {/* Main app routes - with navbar and footer */}
        <Route path="/*" element={
          <div className="mx-4 sm:max-[10%]:">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lawyers" element={<Lawyers />} />
              <Route path="/lawyers/:speciality" element={<Lawyers />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
              <Route path="/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
              <Route path="/appointment/:lawyerId" element={<Appointment />} />
              <Route path="/video-call/:appointmentId" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/verify-email/:token" element={<Verify />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
            <Footer />
          </div>
        } />

      </Routes>
      
    </div>
  )
}

export default App