import React from "react";

const Chat = ({ message, type }) => {
//   console.log("Chats Component:", message);
//   console.log("Chats Component Type:", type);
  return (
    <div>
      <>
        {type == "ai" ? (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-primary text-sm">
              {message}
            </div>
          </div>
        ) : (
          <div className="chat chat-end">
            <div className="chat-bubble chat-bubble-success text-sm">
              {message}
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Chat;
