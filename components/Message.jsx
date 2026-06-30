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

  const emojis = [
    "❤️",
    "😂",
    "😮",
    "😢",
    "😡",
    "👍",
  ];

  // =========================
  // REACT
  // =========================

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
          msg.userId === userId
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

            setMenuOpen(true);

          }}

          onTouchStart={(e) => {

            const timer =
              setTimeout(() => {

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
  onClick={() => {

    setViewingProfile?.({

      username:
        msg.username,

      userId:
        msg.userId,

      avatar:
        msg.avatar,

      banner:
        msg.banner || "",

      bio:
        msg.bio || "",

      hometown:
        msg.hometown || "",

      birthday:
        msg.birthday || "",

      status:
        msg.status || "",

      language:
        Array.isArray(
          msg.language
        )
          ? msg.language
          : [],

      work:
        Array.isArray(
          msg.work
        )
          ? msg.work
          : [],

      education:
        Array.isArray(
          msg.education
        )
          ? msg.education
          : [],

      hobbies:
        Array.isArray(
          msg.hobbies
        )
          ? msg.hobbies
          : [],

      gender:
        msg.gender || "",

      friends:
        msg.friends || [],

    });

  }}
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

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
                mt-3
              "
            >

              {Object.entries(
                msg.reactions
              ).map(
                ([
                  emoji,
                  count,
                ]) => (

                  count > 0 && (

                    <button
                      key={emoji}

                      onClick={() =>
                        react(
                          emoji
                        )
                      }

                      className="
                        flex
                        items-center
                        gap-1

                        px-3
                        py-1.5

                        rounded-full

                        bg-black/10
                        dark:bg-white/10

                        text-sm

                        whitespace-nowrap
                      "
                    >

                      <span>
                        {emoji}
                      </span>

                      <span className="font-bold text-[12px]">

                        {count}

                      </span>

                    </button>

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

          {/* BACKDROP */}

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

          {/* POPUP */}

          <div
            className="
              fixed
              left-1/2
              bottom-5
              -translate-x-1/2

              z-[9999]

              w-[95%]
              max-w-[420px]

              rounded-[28px]

              bg-[#1e1f22]/95
              backdrop-blur-2xl

              border
              border-white/10

              shadow-2xl

              p-4
            "
          >

            {/* EMOJIS */}

            <div
              className="
                flex
                items-center
                justify-between

                gap-2

                overflow-x-auto

                pb-3
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
                      flex
                      items-center
                      justify-center

                      min-w-[52px]
                      h-[52px]

                      rounded-full

                      bg-white/5

                      text-[24px]

                      active:scale-95
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
                grid
                grid-cols-2
                gap-3
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
                  h-[70px]

                  rounded-2xl

                  bg-white/5

                  flex
                  flex-col
                  items-center
                  justify-center

                  gap-1

                  text-white
                "
              >

                <FiCornerUpLeft size={22} />

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
                  h-[70px]

                  rounded-2xl

                  bg-white/5

                  flex
                  flex-col
                  items-center
                  justify-center

                  gap-1

                  text-white
                "
              >

                <FiCopy size={22} />

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
