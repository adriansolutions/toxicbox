"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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

  const [typing, setTyping] =
    useState("");

  // NEW
  const [selectedImages, setSelectedImages] =
    useState([]);

  const [previewImage, setPreviewImage] =
    useState("");

  const bottomRef = useRef();

  // RECEIVE EVENTS
  useEffect(() => {

    socket.on(
      "receive-message",
      (data) => {

        setMessages((prev) => {

          const exists =
            prev.some(
              (msg) =>
                msg.id === data.id
            );

          if (exists) return prev;

          return [
            ...prev,
            data,
          ];

        });

      }
    );

    // REACTION
    socket.on(
      "reaction-updated",
      ({
        messageId,
        emoji,
        userId:
          reactedUserId,
      }) => {

        setMessages((prev) =>
          prev.map((msg) => {

            if (
              msg.id !==
              messageId
            ) {
              return msg;
            }

            const reactedUsers =
              msg.reactedUsers ||
              {};

            const emojiUsers =
              reactedUsers[
                emoji
              ] || [];

            const alreadyReacted =
              emojiUsers.includes(
                reactedUserId
              );

            // UNREACT
            if (
              alreadyReacted
            ) {

              return {
                ...msg,

                reactions: {
                  ...msg.reactions,

                  [emoji]:
                    Math.max(
                      (
                        msg
                          .reactions?.[
                          emoji
                        ] || 1
                      ) - 1,
                      0
                    ),
                },

                reactedUsers:
                  {
                    ...reactedUsers,

                    [emoji]:
                      emojiUsers.filter(
                        (
                          id
                        ) =>
                          id !==
                          reactedUserId
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
                  (
                    msg
                      .reactions?.[
                      emoji
                    ] || 0
                  ) + 1,
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

    // TYPING
    socket.on(
      "typing",
      (name) => {

        if (
          name === username
        )
          return;

        setTyping(name);

        setTimeout(() => {

          setTyping("");

        }, 1500);

      }
    );

    return () => {

      socket.off(
        "receive-message"
      );

      socket.off(
        "reaction-updated"
      );

      socket.off(
        "typing"
      );

    };

  }, [username]);

  // AUTO SCROLL
  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // SEND MESSAGE
  const sendMessage = () => {

    if (
      !message.trim() &&
      selectedImages.length === 0
    )
      return;

    const data = {

      id: Date.now(),

      username,

      userId,

      text: message,

      images: selectedImages,

      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour:
              "2-digit",

            minute:
              "2-digit",
          }
        ),

      reactions: {},

      reactedUsers: {},

      replyTo:
        replyingTo,

    };

    socket.emit(
      "send-message",
      data
    );

    setMessage("");

    setSelectedImages([]);

    setReplyingTo(null);

  };

  // MULTIPLE IMAGE UPLOAD
  const uploadImage = (
    e
  ) => {

    const files =
      Array.from(
        e.target.files
      );

    if (!files.length)
      return;

    files.forEach((file) => {

      const reader =
        new FileReader();

      reader.onload =
        () => {

          setSelectedImages(
            (prev) => [
              ...prev,
              reader.result,
            ]
          );

        };

      reader.readAsDataURL(
        file
      );

    });

  };

  return (

    <div className="chat-wrapper flex-1 flex flex-col overflow-hidden relative">

      {/* IMAGE VIEWER */}

      {previewImage && (

        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">

          <button
            onClick={() =>
              setPreviewImage("")
            }
            className="absolute top-5 right-5 text-white text-3xl"
          >
            ✕
          </button>

          <a
            href={previewImage}
            download
            className="absolute top-5 left-5 bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Save
          </a>

          <img
            src={previewImage}
            className="max-w-full max-h-full rounded-2xl"
          />

        </div>

      )}

      {/* MESSAGES */}

      <div className="chat-messages flex-1 overflow-y-auto">

        {messages.map(
          (msg) => (

            <Message
              key={msg.id}
              msg={msg}
              messages={
                messages
              }
              setMessages={
                setMessages
              }
              setReplyingTo={
                setReplyingTo
              }
              userId={
                userId
              }
              setPreviewImage={
                setPreviewImage
              }
            />

          )
        )}

        <div
          ref={bottomRef}
        ></div>

      </div>

      {/* TYPING */}

      {typing && (

        <div className="px-5 pb-2 text-sm opacity-70">

          {typing} is typing...

        </div>

      )}

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
              setReplyingTo(
                null
              )
            }
            className="text-lg"
          >
            ✕
          </button>

        </div>

      )}

      {/* SELECTED IMAGES */}

      {selectedImages.length >
        0 && (

        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">

          {selectedImages.map(
            (
              img,
              index
            ) => (

              <div
                key={index}
                className="relative"
              >

                <img
                  src={img}
                  onClick={() =>
                    setPreviewImage(
                      img
                    )
                  }
                  className="w-20 h-20 rounded-2xl object-cover border border-white/10 cursor-pointer"
                />

                <button
                  onClick={() => {

                    setSelectedImages(
                      (
                        prev
                      ) =>
                        prev.filter(
                          (
                            _,
                            i
                          ) =>
                            i !==
                            index
                        )
                    );

                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                >
                  ✕
                </button>

              </div>

            )
          )}

        </div>

      )}

      {/* INPUT */}

      <div className="chat-input-area">

        <div className="chat-input flex items-center gap-3">

          {/* IMAGE */}

          <input
            type="file"
            accept="image/*,image/gif"
            multiple
            hidden
            id="imageUpload"
            onChange={
              uploadImage
            }
          />

          <label
            htmlFor="imageUpload"
            className="action-btn cursor-pointer"
          >
            📷
          </label>

          {/* INPUT */}

          <textarea
            placeholder="Message..."
            rows={1}
            className="
              flex-1
              bg-transparent
              outline-none
              text-black
              dark:text-white
              resize-none
              max-h-[120px]
            "
            value={message}
            onChange={(
              e
            ) => {

              setMessage(
                e.target.value
              );

              socket.emit(
                "typing",
                username
              );

            }}

            onKeyDown={(
              e
            ) => {

              if (
                e.key ===
                  "Enter" &&
                !e.shiftKey
              ) {

                e.preventDefault();

                sendMessage();

              }

              if (
                e.key ===
                  "Backspace" &&
                message ===
                  ""
              ) {

                setReplyingTo(
                  null
                );

              }

            }}
          />

          {/* SEND */}

          <button
            onClick={
              sendMessage
            }
            className="send-btn"
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );

}
