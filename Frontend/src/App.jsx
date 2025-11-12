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
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
 

  return (
    <div className="mx-4 sm:max-[10%]:">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lawyers" element={<Lawyers />} />
        <Route path="/lawyers/:speciality" element={<Lawyers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:lawyerId" element={<Appointment />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/resources" element={<Resources />} />

      </Routes>

      <Footer />
      
    </div>
  )
}

export default App