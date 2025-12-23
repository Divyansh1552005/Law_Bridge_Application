import Dashboard from "../pages/Admin/Dashboard";
import AllAppointments from "../pages/Admin/AllAppointments";
import AddLawyer from "../pages/Admin/AddLawyer.jsx";
import LawyerList from "../pages/Admin/LawyerList.jsx";
import LawyerAppointments from "../pages/Lawyer/LawyerAppointments";
import LawyerDashboard from "../pages/Lawyer/LawyerDashboard";
import LawyerProfile from "../pages/Lawyer/LawyerProfile";
import LawyerVideoCall from "../pages/Lawyer/LawyerVideoCall.jsx";
import Layout from "../layouts/layout.jsx";
import Login from "../pages/Login.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Login Route (no layout) */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* INDEX → Admin Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Admin routes */}
        <Route path="admin-dashboard" element={<Dashboard />} />
        <Route path="all-appointments" element={<AllAppointments />} />
        <Route path="add-lawyer" element={<AddLawyer />} />
        <Route path="lawyer-list" element={<LawyerList />} />

        {/* Lawyer routes */}
        <Route path="lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="lawyer-appointments" element={<LawyerAppointments />} />
        <Route path="lawyer-profile" element={<LawyerProfile />} />
        <Route
          path="lawyer/video-call/:appointmentId"
          element={<LawyerVideoCall />}
        />
      </Route>
    </>,
  ),
);

export default router;
