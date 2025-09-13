import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { ArrowUp } from "lucide-react";
import logo from "../assets/logo.png";
import MessageBubble from "./MessageBubble"; // We will improve this component
import { useChatHistory } from "../hooks/useChatHistory"; // Assumes you have this custom hook

function Prompt() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }, []);

  const [chatHistory, setChatHistory] = useChatHistory(user?._id);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || loading) return;

    const newUserMessage = { role: "user", content: trimmedInput };
    setInputValue("");
    // Optimistic UI update: Show user's message immediately
    setChatHistory((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/deepseekai/prompt",
        { content: trimmedInput },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = {
        role: "assistant",
        content: "❌ An error occurred. Please try again.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter to send, Shift+Enter for new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full h-full max-h-screen bg-[#1e1e1e]">
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex flex-col space-y-4">
          {chatHistory.length === 0 ? (
            <WelcomeScreen />
          ) : (
            chatHistory.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))
          )}
          {loading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 md:px-6 pt-2 pb-4 border-t border-gray-700 bg-[#1e1e1e]">
        <div className="w-full max-w-4xl mx-auto bg-[#2f2f2f] rounded-2xl p-2 flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message DeepSeek..."
            rows="1"
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none resize-none p-2 text-base max-h-40"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className="bg-blue-600 text-white rounded-lg p-3 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center">
    <img src={logo} alt="DeepSeek Logo" className="h-12 mb-4" />
    <h1 className="text-4xl font-semibold text-white">
      How can I help you today?
    </h1>
  </div>
);

const TypingIndicator = () => (
  <MessageBubble
    message={{ role: "assistant", content: "Thinking..." }}
    isTyping={true}
  />
);

export default Prompt;
