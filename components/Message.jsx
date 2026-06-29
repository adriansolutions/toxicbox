"use client";

import {
  useState,
} from "react";

import {
  FiCornerUpLeft,
  FiCopy,
} from "react-icons/fi";

import socket from "../lib/socket";

export default function Message({
  msg,
  messages,
  setMessages,
  setReplyingTo,
  userId,
  setPreviewImage,
  setViewingProfile,
}) {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [menuPos, setMenuPos] =
    useState({
      x: 0,
      y: 0,
    });

  const emojis = [
    "❤️",
    "😂",
    "😮",
    "😢",
    "😡",
    "👍",
  ];

  // REACT
  const react = (emoji) => {

    socket.emit(
      "add-reaction",
      {
        messageId:
          msg.id,

        emoji,

        userId,
      }
    );

  };

  return (

    <>

      <div
        className={`message-row ${
          msg.userId ===
          userId
            ? "own"
            : "other"
        }`}
      >

        <div

          className="
            chat-bubble
            relative
          "

          onContextMenu={(e) => {

            e.preventDefault();

            setMenuPos({
              x: e.clientX,
              y: e.clientY,
            });

            setMenuOpen(true);

          }}

          onTouchStart={(e) => {

            const touch =
              e.touches[0];

            const timer =
              setTimeout(() => {

                setMenuPos({
                  x: touch.clientX,
                  y: touch.clientY,
                });

                setMenuOpen(true);

              }, 500);

            e.currentTarget.touchTimer =
              timer;

          }}

          onTouchEnd={(e) => {

            clearTimeout(
              e.currentTarget.touchTimer
            );

          }}

        >

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

          <div className="message-top flex items-center gap-3">

            {/* AVATAR */}

            {msg.avatar && (

              <button
                onClick={() =>
                  setViewingProfile({
                    username:
                      msg.username,

                    userId:
                      msg.userId,

                    avatar:
                      msg.avatar,
                  })
                }
              >

                <img
                  src={msg.avatar}
                  className="avatar"
                />

              </button>

            )}

            {/* USER */}

            <div className="min-w-0">

              <div className="message-name truncate">

                {msg.username}

              </div>

              <div className="message-id truncate">

                {msg.userId}

              </div>

            </div>

            {/* TIME */}

            <div className="message-time ml-auto whitespace-nowrap">

              {msg.time}

            </div>

          </div>

          {/* MESSAGE */}

          <div className="message-text">

            {/* TEXT */}

            {msg.text?.trim() && (

              <div className="break-words whitespace-pre-wrap">

                {msg.text}

              </div>

            )}

            {/* SINGLE IMAGE */}

            {msg.image && (

              <img
                src={msg.image}

                alt="upload"

                onClick={() =>
                  setPreviewImage?.(
                    msg.image
                  )
                }

                className="
                  mt-3
                  rounded-2xl
                  w-full
                  max-w-[320px]
                  max-h-[420px]
                  object-cover
                  border
                  border-white/10
                  cursor-pointer
                  active:scale-[0.98]
                  transition
                "
              />

            )}

            {/* MULTIPLE IMAGES */}

            {msg.images &&
              msg.images.length > 0 && (

              <div
                className={`
                  mt-3
                  grid
                  gap-2

                  ${
                    msg.images.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-2"
                  }
                `}
              >

                {msg.images.map(
                  (
                    img,
                    index
                  ) => (

                    <img
                      key={index}

                      src={img}

                      alt="upload"

                      onClick={() =>
                        setPreviewImage?.(
                          img
                        )
                      }

                      className="
                        w-full
                        h-[150px]
                        sm:h-[180px]
                        object-cover
                        rounded-2xl
                        border
                        border-white/10
                        cursor-pointer
                        active:scale-[0.98]
                        transition
                      "
                    />

                  )
                )}

              </div>

            )}

          </div>

          {/* REACTIONS */}

          {msg.reactions &&
          Object.keys(
            msg.reactions
          ).length > 0 && (

            <div className="message-reactions">

              {Object.entries(
                msg.reactions
              ).map(
                ([
                  emoji,
                  count,
                ]) => (

                  count > 0 && (

                    <div
                      key={emoji}
                      className="reaction-pill"
                    >

                      <span>
                        {emoji}
                      </span>

                      <span>
                        {count}
                      </span>

                    </div>

                  )

                )
              )}

            </div>

          )}

        </div>

      </div>

      {/* MENU */}

      {menuOpen && (

        <>

          <div
            className="
              fixed
              inset-0
              z-[9998]
            "

            onClick={() =>
              setMenuOpen(false)
            }
          />

          <div
            className="
              fixed
              z-[9999]
              w-[270px]
              rounded-3xl
              bg-[#1e1f22]
              border
              border-white/10
              shadow-2xl
              overflow-hidden
            "

            style={{
              left:
                menuPos.x,

              top:
                menuPos.y,
            }}
          >

            {/* EMOJIS */}

            <div
              className="
                flex
                items-center
                justify-between
                px-4
                py-4
                border-b
                border-white/10
              "
            >

              {emojis.map(
                (
                  emoji
                ) => (

                  <button

                    key={emoji}

                    onClick={() => {

                      react(
                        emoji
                      );

                      setMenuOpen(false);

                    }}

                    className="
                      text-2xl
                      hover:scale-125
                      transition
                    "
                  >

                    {emoji}

                  </button>

                )
              )}

            </div>

            {/* ACTIONS */}

            <div
              className="
                flex
                items-center
                justify-around
                p-5
              "
            >

              {/* REPLY */}

              <button

                onClick={() => {

                  setReplyingTo(
                    msg
                  );

                  setMenuOpen(false);

                }}

                className="
                  flex
                  flex-col
                  items-center
                  gap-2
                  text-white
                "
              >

                <FiCornerUpLeft size={24} />

                <span className="text-xs">

                  Reply

                </span>

              </button>

              {/* COPY */}

              <button

                onClick={() => {

                  navigator.clipboard.writeText(
                    msg.text || ""
                  );

                  setMenuOpen(false);

                }}

                className="
                  flex
                  flex-col
                  items-center
                  gap-2
                  text-white
                "
              >

                <FiCopy size={24} />

                <span className="text-xs">

                  Copy

                </span>

              </button>

            </div>

          </div>

        </>

      )}

    </>

  );

}
