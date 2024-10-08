import React, { useState } from "react";
import Chatbot from "./Chatbot";


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
        <div className="fixed bottom-4 right-4 w-80 h-auto bg-white rounded-lg shadow-lg p-4">
          <Chatbot />
          <button
            className="absolute top-2 right-2 bg-red-600 text-white hover:bg-red-800"
            onClick={toggleChatbox}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default PopupChatbox;