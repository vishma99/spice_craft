import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Style components using Tailwind CSS
import "../Page/Chatbot.css";
import ChatHistory from "../Component/ChatHistory";
import Loading from "../Component/Loading";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize your Gemini API
  const genAI = new GoogleGenerativeAI(
    "AIzaSyB3dq9Qh1gKFJ5G_-MQJ3940NrnxUbr_ZQ"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Send user message to Gemini
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;

      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="chat-container bg-white shadow-md p-4 rounded-lg h-[400px] w-[300px] flex flex-col justify-between">
      <div className="chat-header">
        <span className="chatbot-name">SpiceCraft Bot</span>{" "}
        {/* Chatbot name */}
      </div>
      <div className="overflow-y-auto h-full mb-2">
        <ChatHistory chatHistory={chatHistory} />
      </div>
      <Loading isLoading={isLoading} />
      <div className="flex">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="px-1 py-1 ml-1 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
      <button
        className="mt-2 block px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-500 focus:outline-none"
        onClick={clearChat}
      >
        Clear Chat
      </button>
    </div>
  );
};

export default Chatbot;
