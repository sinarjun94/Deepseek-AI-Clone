import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { LogOut, X, Plus, LoaderCircle } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

function Sidebar({ onClose, logo }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  // --- NEW FUNCTION ---
  const handleNewChat = () => {
    if (user?._id) {
      // 1. Remove the chat history for the current user from localStorage.
      localStorage.removeItem(`chatHistory_${user._id}`);
    }
    // 2. Reload the page. This is a simple and effective way to reset the UI.
    window.location.reload();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading("Logging out...");

    try {
      await axios.get("http://localhost:4002/api/v1/user/logout", {
        withCredentials: true,
      });

      localStorage.clear(); // Clear all localStorage on logout for safety
      setAuthUser(null);

      toast.success("Logged out successfully!", { id: toastId });
      // Use a simple navigate here, as localStorage is already cleared
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.errors || "Logout Failed", {
        id: toastId,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#232327] text-white">
      {/* Header */}
      <header className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          {logo && <img src={logo} alt="DeepSeek Logo" className="h-7" />}
          <h1 className="text-xl font-bold">DeepSeek</h1>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Use the new handleNewChat function */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Chat
        </button>
        <div className="text-gray-500 text-sm text-center pt-8">
          No chat history yet
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 p-4 border-t border-gray-700 space-y-2">
        {user && (
          <>
            <Link
              to="/profile"
              onClick={() => handleNavigate("/profile")}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700"
            >
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.firstName
                  )}&background=3730a3&color=fff`
                }
                alt="User Avatar"
                className="rounded-full w-8 h-8 object-cover"
              />
              <span className="font-semibold text-gray-200 truncate">
                {user.firstName} {user.lastName}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 text-red-400 text-sm font-semibold px-2 py-2 rounded-lg hover:bg-red-900/50"
            >
              {isLoggingOut ? (
                <LoaderCircle className="animate-spin" size={18} />
              ) : (
                <LogOut size={18} />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </>
        )}
      </footer>
    </div>
  );
}

export default Sidebar;
