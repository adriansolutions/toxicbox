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

  const bottomRef = useRef(null);

  // RECEIVE MESSAGE
  useEffect(() => {

    socket.on(
      "receive-message",
      (data) => {

        setMessages((prev) => [
          ...prev,
          data,
        ]);

      }
    );

    socket.on(
      "reaction-updated",
      ({ messageId, emoji }) => {

        setMessages((prev) =>
          prev.map((msg) => {

            if (
              msg.id === messageId
            ) {

              return {

                ...msg,

                reactions: {

                  ...msg.reactions,

                  [emoji]:
                    (
                      msg.reactions?.[
                        emoji
                      ] || 0
                    ) + 1,

                },

              };

            }

            return msg;

          })
        );

      }
    );

    return () => {

      socket.off(
        "receive-message"
      );

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

  // SEND
  const sendMessage = () => {

    if (!message.trim())
      return;

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

    <div className="chat-wrapper">

      {/* MESSAGES */}

      <div className="chat-messages">

        {messages.map((msg) => (

          <Message
            key={msg.id}
            msg={msg}
            messages={messages}
            setMessages={
              setMessages
            }
            setReplyingTo={
              setReplyingTo
            }
            currentUserId={userId}
          />

        ))}

        <div ref={bottomRef} />

      </div>

      {/* REPLY BAR */}

      {replyingTo && (

        <div className="px-4 py-3 border-t border-white/10 bg-black/10 backdrop-blur-xl flex items-center justify-between">

          <div className="text-sm truncate">

            Replying to{" "}

            <strong>
              {
                replyingTo.username
              }
            </strong>

          </div>

          <button
            onClick={() =>
              setReplyingTo(null)
            }
            className="action-btn"
          >
            ✕
          </button>

        </div>

      )}

      {/* INPUT */}

      <div className="chat-input-area">

        <div className="chat-input">

          <input
            type="text"
            placeholder="Message..."
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
