import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { clearAdminAuth, clearLawyerAuth } from "../context/auth.tokens";
import { toast } from "react-toastify";
import { Menu } from "lucide-react";
import AuthTransitionOverlay from "./common/AuthTransitionOverlay";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { adminData, setAdminData, lawyerData, setLawyerData } =
    useContext(AppContext);

  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);

    try {
      if (adminData) {
        // Admin logout
        await api.post("/api/admin/logout");
        clearAdminAuth();
        setAdminData(null);
        toast.success("Admin logged out successfully");
      } else if (lawyerData) {
        // Lawyer logout
        await api.post("/api/lawyer/logout");
        clearLawyerAuth();
        setLawyerData(null);
        toast.success("Lawyer logged out successfully");
      }

      setTimeout(() => {
        navigate("/login");
        setLoggingOut(false);
      }, 1000);
    } catch (error) {
      // console.error("Logout error:", error);
      toast.error("Logout failed");

      // Even if logout fails, clear local state and redirect
      clearAdminAuth();
      clearLawyerAuth();
      setAdminData(null);
      setLawyerData(null);
      setTimeout(() => {
        navigate("/login");
        setLoggingOut(false);
      }, 1000);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 sm:py-4 border-b border-gray-100 bg-white shadow-sm transition-all">
      {loggingOut && <AuthTransitionOverlay message="Logging you out..." />}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-primary transition-colors hover:bg-gray-50 rounded-lg active:scale-95 flex items-center justify-center mr-1"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>
        <img
          onClick={() =>
            navigate(adminData ? "/admin-dashboard" : "/lawyer-dashboard")
          }
          className="w-28 sm:w-44 lg:w-48 cursor-pointer hover:opacity-90 transition-opacity shrink min-w-24"
          src={assets.legallogo}
          alt="Legal Logo"
        />
        <p className="border border-primary/20 bg-primary/10 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider shrink-0 hidden min-[320px]:block">
          {adminData ? "Admin" : "Lawyer"}
        </p>
      </div>
      <button
        onClick={() => logout()}
        className="bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium px-5 sm:px-8 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
