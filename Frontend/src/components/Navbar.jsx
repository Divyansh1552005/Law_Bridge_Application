import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useApp from "../context/useApp";
import api from "../api/axiosClient";
import AuthTransitionOverlay from "./common/AuthTransitionOverlay.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [dropletStyle, setDropletStyle] = useState({});
  const [loggingOut, setLoggingOut] = useState(false);
  const navRef = useRef(null);
  const { userData, setUserData } = useApp();

  // Track active link and update droplet position
  useEffect(() => {
    setActiveLink(location.pathname);

    const updateDropletPosition = () => {
      if (navRef.current) {
        const activeNavLink = navRef.current.querySelector(
          `[data-path="${location.pathname}"]`,
        );
        if (activeNavLink) {
          const navContainer = navRef.current;
          const containerRect = navContainer.getBoundingClientRect();
          const activeRect = activeNavLink.getBoundingClientRect();

          setDropletStyle({
            transform: `translateX(${activeRect.left - containerRect.left}px)`,
            width: `${activeRect.width}px`,
            opacity: 1,
          });
        } else {
          setDropletStyle({
            width: "0px",
            transform: "translateX(0px)",
            opacity: 0,
          });
        }
      }
    };

    updateDropletPosition();

    // Update position on window resize
    window.addEventListener("resize", updateDropletPosition);
    return () => window.removeEventListener("resize", updateDropletPosition);
  }, [location.pathname]);

  // Handle clicks outside of dropdown to close it
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownButton = document.getElementById("profile-dropdown-button");
      const dropdownContent = document.getElementById(
        "profile-dropdown-content",
      );

      if (
        dropdownButton &&
        dropdownContent &&
        !dropdownButton.contains(event.target) &&
        !dropdownContent.contains(event.target)
      ) {
        setShowMobileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    setLoggingOut(true);

    try {
      await api.post("/api/auth/logout");
    } catch {
      // console.error("Logout error:", err);
    }

    // UI delay for better experience
    setTimeout(() => {
      setUserData(null);
      navigate("/");
      setLoggingOut(false);
    }, 1500);
  };

  return (
    <div className="relative mb-5 flex w-full min-w-0 items-center justify-between border-b border-b-[#ADADAD] py-4 text-sm">
      {loggingOut && <AuthTransitionOverlay message="Logging you out..." />}
      <img
        onClick={() => navigate("/")}
        className="h-12 w-auto shrink-0 cursor-pointer sm:h-14 md:h-16"
        src={assets.legallogo}
        alt=""
      />
      <nav
        ref={navRef}
        className="lg:flex items-center lg:gap-0.5 xl:gap-2 font-medium hidden relative z-10"
      >
        {/* Animated Droplet Background */}
        <div
          className="absolute top-0 h-full bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-full transition-all duration-500 ease-out transform scale-100 opacity-100"
          style={dropletStyle}
        />

        <NavLink
          to="/"
          data-path="/"
          className={`relative z-10 block lg:px-3 xl:px-4 py-2 text-sm xl:text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
            activeLink === "/" ? "text-primary font-semibold" : ""
          }`}
        >
          HOME
        </NavLink>
        <NavLink
          to="/about"
          data-path="/about"
          className={`relative z-10 block lg:px-3 xl:px-4 py-2 text-sm xl:text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
            activeLink === "/about" ? "text-primary font-semibold" : ""
          }`}
        >
          ABOUT
        </NavLink>
        <NavLink
          to="/lawyers"
          data-path="/lawyers"
          className={`relative z-10 block lg:px-3 xl:px-4 py-2 text-sm xl:text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
            activeLink === "/lawyers" ? "text-primary font-semibold" : ""
          }`}
        >
          BOOK A LAWYER
        </NavLink>
        <NavLink
          to="/resources"
          data-path="/resources"
          className={`relative z-10 block lg:px-3 xl:px-4 py-2 text-sm xl:text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
            activeLink === "/resources" ? "text-primary font-semibold" : ""
          }`}
        >
          RESOURCES
        </NavLink>
        <NavLink
          to="/chatbot"
          data-path="/chatbot"
          className={`relative z-10 block lg:px-3 xl:px-4 py-2 text-sm xl:text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
            activeLink === "/chatbot" ? "text-primary font-semibold" : ""
          }`}
        >
          CHATBOT
        </NavLink>
        <NavLink
          to="/contact"
          data-path="/contact"
          className={`relative z-10 block lg:px-3 xl:px-4 py-2 text-sm xl:text-base hover:text-primary transition-colors duration-300 cursor-pointer ${
            activeLink === "/contact" ? "text-primary font-semibold" : ""
          }`}
        >
          CONTACT
        </NavLink>
        <a
          href="https://blogspace-alpha.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 block lg:px-3 xl:px-4 py-2 text-sm xl:text-base hover:text-primary transition-colors duration-300 cursor-pointer"
        >
          BLOG
        </a>
      </nav>

      <div className="relative z-30 flex shrink-0 items-center gap-2 sm:gap-4">
        {userData ? (
          <div className="flex items-center cursor-pointer relative max-[330px]:hidden">
            <div
              id="profile-dropdown-button"
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              className="flex items-center gap-2 sm:gap-3 lg:gap-1.5 xl:gap-3 p-1 sm:p-2 lg:p-1.5 xl:p-2 rounded-full hover:bg-gray-50 transition-all duration-300"
            >
              <div className="relative block lg:hidden xl:block">
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm hover:border-primary transition-all duration-300 hover:shadow-md"
                  src={
                    userData.image && userData.image.startsWith("http")
                      ? userData.image
                      : "https://res.cloudinary.com/dcvbky2xa/image/upload/v1772559451/default-img_zgazcn.png"
                  }
                  alt="User Profile"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-left">
                  <p className="text-sm xl:text-base font-medium text-gray-900 max-w-20 xl:max-w-24 overflow-hidden whitespace-nowrap">
                    {(userData.name || "User").trim().split(/\s+/)[0]}
                  </p>
                  <p className="text-[11px] xl:text-xs text-gray-500">
                    LawBridge User
                  </p>
                </div>
              </div>
              <img
                className={`w-2.5 sm:w-3 transition-transform duration-200 ${showMobileDropdown ? "rotate-180" : ""}`}
                src={assets.dropdown_icon}
                alt=""
              />
            </div>
            {/* Profile Dropdown (Click) */}
            <div
              id="profile-dropdown-content"
              className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-50 ${showMobileDropdown ? "block" : "hidden"}`}
            >
              <div className="min-w-48 bg-white border border-gray-200 rounded flex flex-col gap-4 p-4 shadow-xl">
                <p
                  onClick={() => {
                    navigate("/my-profile");
                    setShowMobileDropdown(false);
                  }}
                  className={`hover:text-black cursor-pointer ${activeLink === "/my-profile" ? "text-primary font-semibold" : ""}`}
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/my-appointments");
                    setShowMobileDropdown(false);
                  }}
                  className={`hover:text-black cursor-pointer ${activeLink === "/my-appointments" ? "text-primary font-semibold" : ""}`}
                >
                  My Appointments
                </p>
                <p
                  onClick={() => {
                    logout();
                    setShowMobileDropdown(false);
                  }}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="max-[359px]:hidden cursor-pointer rounded-full bg-[#5f6FFF] px-3 py-2 text-sm font-light text-white transition-colors duration-200 hover:bg-[#4f5fff] sm:px-6 sm:py-3 sm:text-base md:px-8"
          >
            Sign up
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 shrink-0 lg:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* ---- Mobile Menu ---- */}
        <div
          className={`lg:hidden ${showMenu ? "fixed w-full" : "h-0 w-0"} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.legallogo} className="w-auto h-14" alt="" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className="w-7"
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
              className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                activeLink === "/"
                  ? "text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                  : ""
              }`}
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/about"
              className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                activeLink === "/about"
                  ? "text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                  : ""
              }`}
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/lawyers"
              className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                activeLink === "/lawyers"
                  ? "text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                  : ""
              }`}
            >
              BOOK A LAWYER
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/resources"
              className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                activeLink === "/resources"
                  ? "text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                  : ""
              }`}
            >
              RESOURCES
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/chatbot"
              className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                activeLink === "/chatbot"
                  ? "text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                  : ""
              }`}
            >
              CHATBOT
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/contact"
              className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                activeLink === "/contact"
                  ? "text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                  : ""
              }`}
            >
              CONTACT
            </NavLink>
            <a
              href="https://blogspace-alpha.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              className="px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300"
            >
              BLOG
            </a>
            {userData ? (
              <>
                <div className="w-full h-px bg-gray-200 my-2"></div>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/my-profile"
                  className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                    activeLink === "/my-profile"
                      ? "text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                      : ""
                  }`}
                >
                  MY PROFILE
                </NavLink>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/my-appointments"
                  className={`px-4 py-2 rounded-full inline-block hover:text-primary transition-colors duration-300 ${
                    activeLink === "/my-appointments"
                      ? "text-primary font-semibold bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                      : ""
                  }`}
                >
                  MY APPOINTMENTS
                </NavLink>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    logout();
                  }}
                  className="px-4 py-2 rounded-full inline-block text-red-600 hover:text-red-700 transition-colors duration-300"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <div className="w-full h-px bg-gray-200 my-2"></div>
                <div className="w-full max-w-xs mx-auto flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/login");
                    }}
                    className="border border-[#5f6FFF] text-[#5f6FFF] px-8 py-3 rounded-xl font-medium hover:bg-[#eef0ff] transition-colors duration-200 w-full"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/login");
                    }}
                    className="bg-[#5f6FFF] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#4f5fff] transition-colors duration-200 w-full"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
