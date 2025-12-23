import Home from "../pages/Home.jsx";
import Lawyers from "../pages/Lawyers.jsx";
import Login from "../pages/Login.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import MyProfile from "../pages/MyProfile.jsx";
import MyAppointments from "../pages/MyAppointments.jsx";
import Appointment from "../pages/Appointment.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import TermsAndConditions from "../pages/TermsAndConditions.jsx";
import RefundPolicy from "../pages/RefundPolicy.jsx";
import ContactUs from "../pages/ContactUs.jsx";
import Chatbot from "../pages/Chatbot.jsx";
import Resources from "../pages/Resources.jsx";
import VideoCall from "../pages/VideoCall.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import Verify from "../pages/Verify.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import Layout from "../layouts/layout.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Chatbot – separate layout */}
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatbot/:sessionId"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      {/* Main app layout */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lawyers" element={<Lawyers />} />
        <Route path="lawyers/:speciality" element={<Lawyers />} />
        <Route path="login" element={<Login />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        <Route
          path="my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route path="appointment/:lawyerId" element={<Appointment />} />

        <Route
          path="video-call/:appointmentId"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />

        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="resources" element={<Resources />} />
        <Route path="verify-email/:token" element={<Verify />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>
    </>
  )
);


export default router
