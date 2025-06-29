import { useEffect, useRef, useState } from "react";
import { TiUser } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { PiMoonFill } from "react-icons/pi";
import { HiSun } from "react-icons/hi";
import { SpinnerCircular } from "spinners-react";
import { useNavigate } from "react-router-dom";

const ProfilePopover = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const clickHandler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };

    window.addEventListener("click", clickHandler);
    return () => window.removeEventListener("click", clickHandler);
  }, []);

  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark";
    if (dark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  return (
    <div className="relative" ref={profileRef}>
      {/* Profile Icon */}
      <div
        className={`w-fit text-gray-500 font-semibold h-fit ms-2 p-2 rounded-full border-2 border-purple-500 hover:text-white hover:bg-gradient-to-r from-purple-700 to-purple-400 transition-all duration-300 ease-in-out cursor-pointer ${
          showPopover ? "bg-gradient-to-r from-purple-700 to-purple-400 text-white" : ""
        }`}
        onClick={() => setShowPopover((prev) => !prev)}
      >
        <TiUser size={26} className="dark:text-black" />
      </div>

      {/* Popover Panel */}
      {showPopover && (
        <div className="absolute top-[135%] dark:bg-[#383838] right-0 min-w-[220px] bg-white rounded-xl shadow-xl z-[101] p-4 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 dark:text-white font-semibold text-base">Username</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleDarkMode();
              }}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all"
            >
              {darkMode ? (
                <HiSun size={20} className="text-white bg-black" />
              ) : (
                <PiMoonFill size={20} className="text-gray-900 border-gray-900" />
              )}
            </button>
          </div>

          {/* Divider */}
          <hr className="my-2 text-gray-900 dark:text-gray-400" />

          {/* Options */}
          <ul className="text-sm text-gray-600">
            {/* Logout */}
            <li
              className={`flex items-center justify-center gap-2 px-2 py-2 rounded-md transition-all ${
                logoutLoading ? "cursor-progress" : "cursor-pointer hover:bg-red-100"
              } text-red-600`}
              onClick={() => {
                if (logoutLoading) return;
                setLogoutLoading(true);

                // Wait for logout, then reset theme
                setTimeout(() => {
                  // Reset to light mode AFTER logout is finished
                  localStorage.setItem("theme", "light");
                  document.documentElement.classList.remove("dark");
                  setDarkMode(false);

                  setLogoutLoading(false);
                  navigate("/");
                }, 3000);
              }}
            >
              {logoutLoading ? (
                <SpinnerCircular size={18} thickness={250} color="red" secondaryColor="#eee" />
              ) : (
                <>
                  <IoLogOut size={18} /> Logout
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePopover;
