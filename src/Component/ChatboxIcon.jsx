import { useState } from "react";
import Chatbot from "./Chatbot";
import "../Page/Chatbot.css";

const ChatboxIcon = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Chatbot Icon */}
      {!isChatVisible && (
        <div
          className="p-2 bg-red-500 rounded-full cursor-pointer"
          onClick={toggleChat}
        >
          <img
            src="https://via.placeholder.com/50?text=Chat"
            alt="Chatbot Icon"
            className="w-12 h-12 rounded-full"
          />
        </div>
      )}

      {/* Chatbot Interface */}
      {isChatVisible && (
        <div className="relative">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <Chatbot />
          </div>
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            onClick={toggleChat}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatboxIcon;
