import React from "react";

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="chat-history">
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`message ${message.type === "user" ? "user" : "bot"}`}
        >
          <span className="message-text">{message.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
