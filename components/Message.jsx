"use client";

import socket from "../lib/socket";

export default function Message({
  msg,
  messages,
  setMessages,
  setReplyingTo,
  userId,
}) {

  // REALTIME REACTION
  const react = (emoji) => {

    // update local instantly
    const updated = messages.map((m) => {

      if (m.id === msg.id) {

        return {
          ...m,
          reactions: {
            ...m.reactions,
            [emoji]:
              (m.reactions?.[emoji] || 0) + 1,
          },
        };

      }

      return m;

    });

    setMessages(updated);

    // send realtime update
    socket.emit("add-reaction", {
      messageId: msg.id,
      emoji,
    });

  };

  return (

  <div
    className={`message-row ${
      msg.userId === userId
        ? "own"
        : "other"
    }`}
  >

    <div className="chat-bubble">

      {msg.replyTo && (

        <div className="mb-3 p-3 rounded-2xl bg-black/10">

          <div className="text-xs opacity-70">
            Replying to
          </div>

          <div className="font-bold text-sm">
            {msg.replyTo.username}
          </div>

          <div className="text-sm opacity-80">
            {msg.replyTo.text}
          </div>

        </div>

      )}

      <div className="message-top">

        <div className="avatar">
          {msg.username.charAt(0)}
        </div>

        <div>

          <div className="message-name">
            {msg.username}
          </div>

          <div className="message-id">
            {msg.userId}
          </div>

        </div>

        <div className="message-time ml-auto">
          {msg.time}
        </div>

      </div>

      <div className="message-text">
        {msg.text}
      </div>

      <div className="message-actions">

        <button
          onClick={() =>
            setReplyingTo(msg)
          }
          className="action-btn"
        >
          Reply
        </button>

        {["👍","🔥","😂","❤️"].map((emoji) => (

          <button
            key={emoji}
            onClick={() =>
              react(emoji)
            }
            className="action-btn"
          >
            {emoji}{" "}
            {msg.reactions?.[emoji] || 0}
          </button>

        ))}

      </div>

    </div>

  </div>

);

}
