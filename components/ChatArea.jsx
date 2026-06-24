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

    return () => {
      socket.off("receive-message");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
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

      {replyingTo && (
        <div className="px-5 py-2 bg-gray-200 dark:bg-gray-700 flex justify-between">
          <span>
            Replying to{" "}
            {replyingTo.username}
          </span>

          <button
            onClick={() =>
              setReplyingTo(null)
            }
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-5 bg-white dark:bg-gray-800 flex gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-4 rounded-xl border outline-none dark:bg-gray-700"
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
        }
