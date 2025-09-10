import { useState } from "react";
import Logo from "../../assets/Logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SpinnerCircularFixed } from "spinners-react";
import LoginIllustration from "../../assets/image.png";
import { APPURL } from "../Common/AppUrl";
import { useToast } from "../Common/UseToast";
import axios from "axios";

// Redux
import { store } from "../../redux/store";
import { updateLoggedInStatus } from "../../redux/DataSlice";
import { useSelector } from "react-redux";

// Background icon imports
import ChatIcon from "../../assets/Icons/Mail.svg";
import UserIcon from "../../assets/Icons/User.svg";
import ShieldIcon from "../../assets/Icons/Notification.svg";
import Lock from "../../assets/Icons/Lock.svg";
import calendar from "../../assets/Icons/calendar.svg";
import clipboard from "../../assets/Icons/clipboard.svg";

const icons = [
  ChatIcon,
  UserIcon,
  ShieldIcon,
  Lock,
  ChatIcon,
  UserIcon,
  ShieldIcon,
  calendar,
  clipboard,
];

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const loggedInStatus = useSelector((state) => state.data.loggedInStatus);

  // Generate fixed random positions for icons
  const [iconPositions] = useState(
    icons.map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.username.trim() === "" || form.password.trim() === "") {
      showToast({
        type: "error",
        heading: "Error",
        message: "Enter valid Username and password",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(APPURL.login, form);

      if (response.status === 200) {
        const data = response.data;

        showToast({
          type: "success",
          heading: "Login Successful",
          message: "Session started securely.",
        });

        window.sessionStorage.setItem("user", JSON.stringify(data));
        store.dispatch(updateLoggedInStatus(true));

        navigate("/home");
      }
    } catch (err) {
      showToast({
        type: "error",
        heading: "Invalid Credentials",
        message:
          err.response?.data?.error || "An error occurred while logging in.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gray-100 overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon}
            className="absolute w-8 h-8 opacity-40 animate-floating"
            style={{
              top: iconPositions[index].top,
              left: iconPositions[index].left,
              animationDelay: `${index * 1.5}s`,
            }}
            alt={`icon-${index}`}
          />
        ))}
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-xl shadow-xl overflow-hidden bg-white">
        {/* Left Section - Image + Logo */}
        <div className="relative md:w-1/2 h-100 md:h-auto">
          <img
            src={LoginIllustration}
            alt="Login Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/10"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl flex flex-col items-center">
              <img
                src={Logo}
                alt="Logo"
                className="w-40 md:w-70 mb-6 drop-shadow-2xl bg-white rounded-sm"
              />
              <h2 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">
                Welcome
              </h2>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <h3 className="text-2xl font-semibold text-gray-700 text-center">
              Login
            </h3>

            <div className="flex flex-col text-black">
              <label className="text-gray-600 font-medium mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col text-black">
              <label className="text-gray-600 font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg py-2 px-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                {showPassword ? (
                  <FaEyeSlash
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                    size={18}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                    size={18}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors duration-300 ${
                isLoading
                  ? "bg-[var(--primary)] opacity-60 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#694F8E] to-[#5D467F] hover:from-[#5D467F] hover:to-[#694F8E]"
              } flex justify-center items-center`}
            >
              {isLoading ? (
                <SpinnerCircularFixed size={24} color="white" thickness={200} />
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center text-gray-500 text-sm pt-4">
              <span className="hover:underline cursor-pointer text-[var(--primary)]">
                Forgot Password?
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
