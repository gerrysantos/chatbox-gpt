// src/Chat.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setIsTyping(true);

      const response = await axios.post("http://localhost:5000/api/chat", {
        question: input,
      });

      // Typing animation: reveal AI text one character at a time
      const botText = response.data.reply;
      let displayedText = "";
      const delay = 20;

      for (let i = 0; i < botText.length; i++) {
        displayedText += botText[i];
        setMessages((prev) => [
          ...prev.filter((m) => m.sender !== "AI-temp"),
          { sender: "AI-temp", text: displayedText },
        ]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // Replace temporary message with final AI message
      setMessages((prev) => [
        ...prev.filter((m) => m.sender !== "AI-temp"),
        { sender: "AI", text: botText },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
      }}
    >
      <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "2rem" }}>
        K-12 Teaching Chatbot
      </h2>
      <p style={{ textAlign: "center", marginBottom: "10px", color: "#555" }}>
        Core subjects: Math, English, Science, Filipino, AP for any grade level
      </p>

      <div
        style={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          overflowY: "scroll",
          background: "#f9f9f9",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => {
          const isAI = msg.sender.startsWith("AI");
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: isAI ? "flex-start" : "flex-end",
                margin: "5px 0",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  background: isAI ? "#e0f0ff" : "#d4ffd4",
                  color: "#000",
                  padding: "10px 15px",
                  borderRadius: "15px",
                  borderBottomLeftRadius: isAI ? "5px" : "15px",
                  borderBottomRightRadius: isAI ? "15px" : "5px",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
                  wordBreak: "break-word",
                }}
              >
                <b>{msg.sender.replace("-temp", "")}:</b> {msg.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                background: "#e0f0ff",
                padding: "10px 10px",
                borderRadius: "15px",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
                display: "flex",
                gap: "4px",
                width: "50px",
              }}
            >
              <span className="dot" style={{ animationDelay: "0s" }}>
                •
              </span>
              <span className="dot" style={{ animationDelay: "0.2s" }}>
                •
              </span>
              <span className="dot" style={{ animationDelay: "0.4s" }}>
                •
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask any K-12 question..."
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 15px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "none",
            background: "#4caf50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      {/* Dot animation style */}
      <style>
        {`
          .dot {
            font-size: 20px;
            animation: blink 1.4s infinite both;
          }
          @keyframes blink {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ChatGPT;
