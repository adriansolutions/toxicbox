"use client";

import { useEffect, useRef, useState } from "react";

import socket from "../lib/socket";

import Message from "./Message";

export default function ChatArea({
  username,
  userId,
}) {

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [replyingTo, setReplyingTo] =
    useState(null);

  const bottomRef = useRef();

  // RECEIVE MESSAGE
  useEffect(() => {

    socket.on(
      "receive-message",
      (data) => {

        setMessages((prev) => {

          // prevent duplicate message
          const exists = prev.some(
            (msg) => msg.id === data.id
          );

          if (exists) return prev;

          return [...prev, data];

        });

      }
    );

    // RECEIVE REACTION
    socket.on(
      "reaction-updated",
      ({
        messageId,
        emoji,
        userId: reactedUserId,
      }) => {

        setMessages((prev) =>
          prev.map((msg) => {

            if (msg.id !== messageId)
              return msg;

            // users who reacted
            const reactedUsers =
              msg.reactedUsers || {};

            const emojiUsers =
              reactedUsers[emoji] || [];

            const alreadyReacted =
  emojiUsers.includes(
    reactedUserId
  );

// UNREACT
if (alreadyReacted) {

  return {
    ...msg,

    reactions: {
      ...msg.reactions,

      [emoji]: Math.max(
        (msg.reactions?.[
          emoji
        ] || 1) - 1,
        0
      ),
    },

    reactedUsers: {
      ...reactedUsers,

      [emoji]:
        emojiUsers.filter(
          (id) =>
            id !== reactedUserId
        ),
    },
  };

}

// REACT
return {
  ...msg,

  reactions: {
    ...msg.reactions,

    [emoji]:
      (msg.reactions?.[
        emoji
      ] || 0) + 1,
  },

  reactedUsers: {
    ...reactedUsers,

    [emoji]: [
      ...emojiUsers,
      reactedUserId,
    ],
  },
};

          })
        );

      }
    );

    return () => {

      socket.off("receive-message");

      socket.off(
        "reaction-updated"
      );

    };

  }, []);

  // AUTO SCROLL
  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // SEND MESSAGE
  const sendMessage = () => {

    if (!message.trim()) return;

    const data = {

      id: Date.now(),

      username,

      userId,

      text: message,

      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),

      reactions: {},

      reactedUsers: {},

      replyTo: replyingTo,

    };

    socket.emit(
      "send-message",
      data
    );

    setMessage("");

    setReplyingTo(null);

  };

  return (

    <div className="chat-wrapper flex-1 flex flex-col overflow-hidden">

      {/* MESSAGES */}

      <div className="chat-messages flex-1 overflow-y-auto">

        {messages.map((msg) => (

          <Message
            key={msg.id}
            msg={msg}
            messages={messages}
            setMessages={setMessages}
            setReplyingTo={
              setReplyingTo
            }
            userId={userId}
          />

        ))}

        <div ref={bottomRef}></div>

      </div>

      {/* REPLY BAR */}

      {replyingTo && (

        <div className="mx-4 mb-2 px-5 py-3 rounded-2xl bg-blue-100 dark:bg-[#383a40] flex justify-between items-center shadow-sm text-black dark:text-white">

          <span className="text-sm">
            Replying to{" "}
            <strong>
              {
                replyingTo.username
              }
            </strong>
          </span>

          <button
            onClick={() =>
              setReplyingTo(null)
            }
            className="text-lg"
          >
            ✕
          </button>

        </div>

      )}

      {/* INPUT */}

      <div className="chat-input-area">

        <div className="chat-input flex items-center gap-3">

          <input
            type="text"
            placeholder="Message..."
            className="flex-1 bg-transparent outline-none text-black dark:text-white"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (
                e.key === "Enter"
              ) {
                sendMessage();
              }

              if (
                e.key ===
                  "Backspace" &&
                message === ""
              ) {
                setReplyingTo(
                  null
                );
              }

            }}
          />

          <button
            onClick={sendMessage}
            className="send-btn"
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );

}
