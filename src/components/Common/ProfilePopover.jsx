import { useEffect, useRef, useState } from "react";
import { TiUser } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { FiKey } from "react-icons/fi";
import { SpinnerCircular } from "spinners-react";
import { useNavigate } from "react-router-dom";
import { updateLoggedInStatus } from "../../redux/DataSlice";
import { store } from "../../redux/store";
import { postData } from "./UseFetch";
import { APPURL } from "./AppUrl";
import Model from '../Common/Modal'
import { getUsername } from "./UseFetch";


const ProfilePopover = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changeLoading, setChangeLoading] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef(null);
  const username = getUsername()

  useEffect(() => {
    const clickHandler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    window.addEventListener("click", clickHandler);
    return () => window.removeEventListener("click", clickHandler);
  }, []);

  const handleLogout = async (e) => {
    e.stopPropagation();
    if (logoutLoading) return;

    setLogoutLoading(true);
    try {
      await postData(APPURL.logout);

      // Clear session + update redux
      window.sessionStorage.clear();
      store.dispatch(updateLoggedInStatus(false));
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
    setShowPopover(false);
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setChangeLoading(true);
    try {
      await postData(APPURL.changePassword, {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      alert("Password changed successfully!");
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Change password failed:", err);
      alert("Failed to change password");
    } finally {
      setChangeLoading(false);
    }
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
        <div className="absolute top-[135%] right-0 min-w-[220px] bg-white rounded-xl shadow-xl z-[101] p-4 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 font-semibold text-base">{username}</span>
          </div>

          <hr className="my-2 text-gray-900" />

          <ul className="text-sm text-gray-600">
            {/* Change Password */}
            <li
              className="flex items-center justify-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-[var(--primary)]/10 text-[var(--primary)] mb-1"
              onClick={handleChangePasswordClick}
            >
              <FiKey size={18} /> Change Password
            </li>

            {/* Logout */}
            <li
              className={`flex items-center justify-center gap-2 px-2 py-2 rounded-md transition-all ${
                logoutLoading ? "cursor-progress" : "cursor-pointer hover:bg-red-100"
              } text-red-600`}
              onClick={handleLogout}
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

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200] text-black">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInput}
                required
                className="border px-3 py-2 rounded-md"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={handlePasswordInput}
                required
                className="border px-3 py-2 rounded-md"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInput}
                required
                className="border px-3 py-2 rounded-md"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 rounded-md border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changeLoading}
                  className="px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:bg-[var(--third)] flex items-center justify-center gap-2"
                >
                  {changeLoading ? (
                    <SpinnerCircular size={18} thickness={250} color="white" secondaryColor="#eee" />
                  ) : (
                    "Change"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePopover;
