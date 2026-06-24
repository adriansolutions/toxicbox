"use client";

import socket from "../lib/socket";

export default function Message({
  msg,
  messages,
  setMessages,
  setReplyingTo,
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

    <div className="chat-bubble bg-white dark:bg-[#1e1f22] p-4 rounded-2xl shadow-sm hover:shadow-md max-w-[85%]">

      {/* REPLY */}

      {msg.replyTo && (

        <div className="mb-3 p-3 rounded-xl bg-gray-100 dark:bg-[#383a40] border-l-4 border-blue-500">

          <div className="text-xs text-gray-500 mb-1">
            Replying to
          </div>

          <div className="font-semibold text-sm">
            {msg.replyTo.username}
          </div>

          <div className="text-sm opacity-80 truncate">
            {msg.replyTo.text}
          </div>

        </div>

      )}

      {/* TOP */}

      <div className="flex items-center gap-2 flex-wrap mb-2">

        <div className="font-semibold text-[15px] text-blue-600">
          {msg.username}
        </div>

        <div className="text-xs text-gray-400">
          {msg.userId}
        </div>

        <div className="text-xs text-gray-500">
          {msg.time}
        </div>

      </div>

      {/* MESSAGE */}

      <div className="text-[15px] break-words leading-relaxed">
        {msg.text}
      </div>

      {/* BUTTONS */}

      <div className="flex gap-2 mt-4 flex-wrap">

        {/* REPLY */}

        <button
          onClick={() =>
            setReplyingTo(msg)
          }
          className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#383a40] hover:scale-105 transition text-sm"
        >
          Reply
        </button>

        {/* REACTIONS */}

        {["👍", "🔥", "😂", "❤️"].map((emoji) => (

          <button
            key={emoji}
            onClick={() =>
              react(emoji)
            }
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#383a40] hover:scale-110 transition text-sm"
          >
            {emoji} {msg.reactions?.[emoji] || 0}
          </button>

        ))}

      </div>

    </div>

  );

}
