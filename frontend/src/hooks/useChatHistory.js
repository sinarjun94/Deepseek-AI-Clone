import { useState, useEffect } from "react";

export function useChatHistory(userId) {
  const getInitialState = () => {
    if (!userId) return [];
    try {
      const storedHistory = localStorage.getItem(`chatHistory_${userId}`);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("Failed to parse chat history:", error);
      return [];
    }
  };

  const [history, setHistory] = useState(getInitialState);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(history));
    }
  }, [history, userId]);

  return [history, setHistory];
}
