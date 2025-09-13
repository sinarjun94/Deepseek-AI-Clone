import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Prompt from "./Prompt";
import { Menu } from "lucide-react";
import logo from "../assets/logo.png";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden">
      {/* --- Desktop Sidebar --- */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0">
        <Sidebar logo={logo} />
      </div>

      {/* --- Mobile Sidebar --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#232327] transform transition-transform duration-300 ease-in-out md:hidden
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onClose={closeSidebar} logo={logo} />
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-700 px-4 md:hidden">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="DeepSeek Logo" className="h-7" />
            <span className="text-xl font-bold">DeepSeek</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-gray-300" />
          </button>
        </header>

        {/* Chat/Prompt Area */}
        <main className="flex-1 overflow-y-auto">
          <Prompt />
        </main>
      </div>
    </div>
  );
}

export default Home;
