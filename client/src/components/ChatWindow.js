// ChatWindow.js
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://chat-app-nine-mauve-28.vercel.app/");

export default function ChatWindow() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = {
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: socket.id
      };
      socket.emit("send_message", msgData);
      setChat((prev) => [...prev, { ...msgData, sender: socket.id }]); // Show instantly
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const isMyMessage = (msg) => msg.sender === socket.id;

  return (
    <div style={{
      maxWidth: "420px",
      margin: "40px auto",
      background: "#f5f5f5",
      height: "90vh",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        background: "#075e54",
        color: "white",
        padding: "16px",
        textAlign: "center",
        fontSize: "1.2rem",
        fontWeight: "bold"
      }}>
        💬 Real-Time Chat Room
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        background: "#e5ddd5 url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png') repeat",
        backgroundSize: "auto"
      }}>
        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: isMyMessage(msg) ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                background: isMyMessage(msg) ? "#dcf8c6" : "white",
                color: "black",
                padding: "10px 14px",
                borderRadius: "18px",
                borderBottomRightRadius: isMyMessage(msg) ? "4px" : "18px",
                borderBottomLeftRadius: isMyMessage(msg) ? "18px" : "4px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                position: "relative",
                wordWrap: "break-word"
              }}
            >
              <div style={{ fontSize: "15px", lineHeight: "1.4" }}>
                {msg.text}
              </div>
              <div style={{
                fontSize: "11px",
                color: "#999",
                textAlign: "right",
                marginTop: "4px"
              }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "12px",
        background: "#f0f0f0",
        borderTop: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "none",
            borderRadius: "25px",
            outline: "none",
            fontSize: "16px",
            background: "white",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#075e54",
            color: "white",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
