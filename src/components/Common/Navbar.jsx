import React, { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { FaStore, FaUsers, FaUserPlus } from "react-icons/fa";
import Logo from "../../assets/Logo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import ProfilePopover from "./ProfilePopover";
import SideBarProfile from "./SideBarProfile";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const Location = useLocation();

  const MenuData = [
    { display: "Home", link: "/home" },
    { display: "SC Management", link: "/sc-management" },
    { display: "Work Order Management", link: "/workorder" },
    { display: "Report Management", link: "/report-management" },
    {
      display: "Admin Tools",
      children: [
        { display: "Store Management", link: "/admin-tools/store-management", icon: <FaStore /> },
        { display: "User Management", link: "/admin-tools/user-management", icon: <FaUsers /> },
        { display: "Register User", link: "/admin-tools/register-user", icon: <FaUserPlus /> },
      ],
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="h-[70px] py-3 px-4 bg-white dark:bg-[#383838] flex justify-between items-center shadow z-1000">
        <Link to={"/home"} className="flex items-center p-1 rounded-lg bg-gradient-to-r from-purple-200 to-purple-50">
          <img src={Logo} width={130} alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-6 items-center relative">
          <ul className="flex gap-4 items-center">
            {MenuData.map((menu, index) => (
              <li key={index} className="relative">
                {menu.children ? (
                  <>
                    <button
                      onMouseEnter={() => setIsAdminOpen(true)}
                      onMouseLeave={() => setIsAdminOpen(false)}
                      className={`flex items-center gap-1 px-3 py-2 font-semibold rounded-md transition ${
                        Location.pathname.includes("/admin-tools")
                          ? "text-purple-700 underline"
                          : "text-gray-600 dark:text-white hover:text-purple-500"
                      }`}
                    >
                      {menu.display} <TiArrowSortedDown />
                    </button>
                    {isAdminOpen && (
                      <div
                        onMouseEnter={() => setIsAdminOpen(true)}
                        onMouseLeave={() => setIsAdminOpen(false)}
                        className="absolute top-full left-0 bg-white dark:bg-[#383838] shadow-lg rounded-md py-2 min-w-[200px] z-1000 animate-slide-down"
                      >
                        {menu.children.map((child, i) => (
                          <Link
                            key={i}
                            to={child.link}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-purple-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-white"
                          >
                            {child.icon} {child.display}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={menu.link}
                    className={`px-3 py-2 rounded-md font-semibold transition ${
                      Location.pathname.includes(menu.link)
                        ? "text-purple-700 underline"
                        : "text-gray-600 dark:text-white hover:text-purple-500"
                    }`}
                  >
                    {menu.display}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Profile + Mobile Menu */}
        <div className="flex items-center gap-4">
          <ProfilePopover />
          <button
            className="lg:hidden text-2xl text-purple-700 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <RxCross2 /> : <GiHamburgerMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#383838] px-4 py-4 shadow z-1000">
          <ul className="flex flex-col gap-2">
            {MenuData.map((menu, index) => (
              <li key={index} className="relative">
                {menu.children ? (
                  <>
                    <button
                      onClick={() => setIsAdminOpen(!isAdminOpen)}
                      className={`w-full flex justify-between items-center px-3 py-2 font-medium rounded-md ${
                        Location.pathname.includes("/admin-tools")
                          ? "text-purple-700"
                          : "text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {menu.display} <TiArrowSortedDown />
                    </button>
                    {isAdminOpen && (
                      <ul className="pl-4 mt-1 flex flex-col gap-1">
                        {menu.children.map((child, i) => (
                          <li key={i}>
                            <Link
                              to={child.link}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-1 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                              {child.icon} {child.display}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={menu.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md font-medium ${
                      Location.pathname.includes(menu.link)
                        ? "text-purple-700"
                        : "text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {menu.display}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-grow grid lg:grid-cols-5 h-[calc(100vh-70px)] overflow-hidden">
        <div className="lg:col-span-4 bg-gray-100 overflow-y-hidden py-4 rounded-sm px-1">
          <Outlet />
        </div>
        <div className="hidden lg:block lg:col-span-1 bg-gray-100 overflow-y-auto py-4 px-1">
          <SideBarProfile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
