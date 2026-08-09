import React from "react";

/*
  Full-screen overlay shown during brief auth transitions (login/logout)
  so the app never looks frozen while we wait out a deliberate UX delay
  or a redirect.
*/
const AuthTransitionOverlay = ({ message = "Please wait..." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-4 bg-white px-10 py-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute w-14 h-14 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-700 font-medium tracking-wide animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default AuthTransitionOverlay;
