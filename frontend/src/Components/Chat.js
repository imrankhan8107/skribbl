import React, { useContext, useState } from "react";
import "../styles/Chat.css";
import { SocketContext } from "../App";
export default function Chat() {
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  socket.on("message", (data) => {
    console.log(data);
    setMessages([...messages, data]);
  });
  function sendMessage(message) {
    if (!message) return;
    socket.emit("message", message);
    setMessages([...messages, message]);
  }
  return (
    <div>
      <h1>Chat Messages</h1>
      <div className="message-container">
        {messages.map((message, index) => {
          return (
            <div className="message" key={index}>
              {message}
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
        />
        <button
          onClick={() => {
            sendMessage(message);
            setMessage("");
            setMessages([...messages, message]);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
