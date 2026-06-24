"use client";

import socket from "../lib/socket";

export default function Message(
  msg,
  messages,
  setMessages,
  setReplyingTo,
  userId,
}) {

  // REALTIME REACTION
  const react = (emoji) => {

    socket.emit(
      "add-reaction",
      {
        messageId: msg.id,
        emoji,
        userId,
      }
    );

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

        {/* REPLY */}

        {msg.replyTo && (

          <div className="mb-3 p-3 rounded-2xl bg-black/10 dark:bg-white/10">

            <div className="text-xs opacity-70">
              Replying to
            </div>

            <div className="font-bold text-sm">
              {
                msg.replyTo
                  .username
              }
            </div>

            <div className="text-sm opacity-80 break-words">
              {
                msg.replyTo.text
              }
            </div>

          </div>

        )}

        {/* TOP */}

        <div className="message-top">

          <div className="avatar">
            {msg.username
              ?.charAt(0)
              ?.toUpperCase()}
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

        {/* MESSAGE */}

        <div className="message-text">
          {msg.text}
        </div>

        {/* ACTIONS */}

        <div className="message-actions">

          <button
            onClick={() =>
              setReplyingTo(msg)
            }
            className="action-btn"
          >
            Reply
          </button>

          {[
            "👍",
            "🔥",
            "😂",
            "❤️",
          ].map((emoji) => (

            <button
              key={emoji}
              onClick={() =>
                react(emoji)
              }
              className="action-btn"
            >
              <span>
                {emoji}
              </span>

              <span>
                {msg.reactions?.[
                  emoji
                ] || 0}
              </span>

            </button>

          ))}

        </div>

      </div>

    </div>

  );

}
