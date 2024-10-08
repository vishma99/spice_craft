import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Style components using Tailwind CSS
import "../Page/Chatbot.css";
import ChatHistory from "../Component/ChatHistory";
import Loading from "../Component/Loading";
import { Icon } from "@mui/material";
import { IconsManifest } from "react-icons/lib";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // inislize your Gemeni Api
  const genAI = new GoogleGenerativeAI(
    "AIzaSyB3dq9Qh1gKFJ5G_-MQJ3940NrnxUbr_ZQ"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Function to send user message to Gemini
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      // call Gemini Api to get a response
      const result = await model.generateContent(userInput);
      const response = await result.response;
      console.log(response);
      // add Gemeni's response to the chat history
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

  // Function to clear the chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="chatbot">
        <header>
        <h2>Chatbot</h2>
        </header>
      <ul className="chatbox">
        <li className="chat incoming">
            <span></span>
            <p>Hi!</p>
        </li>
      </ul>

      <div className="chat-container rounded-lg shadow-md p-5">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        </div>
        <button
          className="px-2 py-1 ml-1 rounded-lg bg-red-500 text-white hover:bg-red-800 focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      
      <button
        className="mt-4 block px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-800 focus:outline-none"
        onClick={clearChat}
      >
        Clear
      </button>
    </div>
  );
};

export default Chatbot;
