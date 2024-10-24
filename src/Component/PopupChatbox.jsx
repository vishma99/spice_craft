import { useState } from "react";
import Chatbot from "./Chatbot";
import "../Page/Chatbot.css";

const PopupChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Chatbot Avatar */}
      <div
        className="fixed bottom-4 right-4 p-2 bg-red-500 rounded-full cursor-pointer"
        onClick={toggleChatbox}
      >
        <img
          src="https://via.placeholder.com/50?text=Chat"
          alt="Chatbot Avatar"
          className="w-12 h-12 rounded-full"
        />
      </div>

      {/* Chatbox Popup */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg">
          {/* Chatbot Content */}
          <div className="relative h-full">
            <Chatbot />
            <button
              className="absolute top-2 right-2 bg-red-400 text-white p-1 "
              onClick={toggleChatbox}
            >
              ✖️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupChatbox;
