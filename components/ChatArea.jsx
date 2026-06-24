"use client";

import { useEffect, useRef, useState } from "react";

import socket from "../lib/socket";

import Message from "./Message";

export default function ChatArea({
  username,
  userId,
}) {

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [replyingTo, setReplyingTo] =
    useState(null);

  const bottomRef = useRef();

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

    // RECEIVE REACTION
    socket.on(
      "reaction-updated",
      ({ messageId, emoji }) => {

        setMessages((prev) =>
          prev.map((msg) => {

            if (msg.id === messageId) {

              return {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [emoji]:
                    (msg.reactions?.[emoji] || 0) + 1
                }
              };

            }

            return msg;

          })
        );

      }
    );

    return () => {
      socket.off("receive-message");
      socket.off("reaction-updated");
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

      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

      reactions: {},

      replyTo: replyingTo,

    };

    socket.emit("send-message", data);

    setMessage("");

    setReplyingTo(null);

  };

  return (

    <div className="flex-1 flex flex-col bg-[#f5f7fb] dark:bg-[#313338]">

      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-[#f5f7fb] to-[#e9eef8] dark:from-[#313338] dark:to-[#1e1f22]">

        {messages.map((msg) => (

          <Message
            key={msg.id}
            msg={msg}
            messages={messages}
            setMessages={setMessages}
            setReplyingTo={
              setReplyingTo
            }
          />

        ))}

        <div ref={bottomRef}></div>

      </div>

      {/* REPLY BAR */}

      {replyingTo && (

        <div className="mx-4 mb-2 px-5 py-3 rounded-2xl bg-blue-100 dark:bg-[#383a40] flex justify-between items-center shadow-sm">

          <span className="text-sm">
            Replying to{" "}
            <strong>
              {replyingTo.username}
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

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#2b2d31]/90 backdrop-blur-md">

        <div className="chat-input flex items-center gap-3 bg-gray-100 dark:bg-[#383a40] rounded-2xl px-4 py-3">

          <input
            type="text"
            placeholder="Message..."
            className="flex-1 bg-transparent outline-none"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                sendMessage();
              }

              if (
                e.key === "Backspace" &&
                message === ""
              ) {
                setReplyingTo(null);
              }

            }}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white px-5 py-2 rounded-xl shadow-md"
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );

           }
