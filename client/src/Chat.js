import React, { useEffect, useState } from "react";

import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat({ socket, username, room }) {
  const [curMessage, setCurMessage] = useState(``);
  const [messList, setMessList] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(`received message data`, data);
      setMessList((list) => [...list, data]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (curMessage !== null) {
      const messageData = {
        room: room,
        author: username,
        message: curMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessList((list) => [...list, messageData]);
      setCurMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messList.map((messContent) => {
            return (
              <div
                className="message"
                id={username === messContent.author ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    <p>{messContent.message} </p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messContent.time}</p>
                    <p id="author">{messContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={curMessage}
          placeholder="Hey..."
          onChange={(e) => setCurMessage(e.target.value)}
        />
        <button
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
          onClick={sendMessage}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}
