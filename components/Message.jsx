"use client";

import socket from "../lib/socket";

export default function Message({
msg,
messages,
setMessages,
setReplyingTo,
userId,
setPreviewImage,
}) {

// REACT
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

    <div className="message-top flex items-center gap-3">

      {/* AVATAR */}

      {msg.avatar ? (

  <img
    src={msg.avatar}
    alt="avatar"
    className="avatar object-cover"
  />

) : (

  <div className="avatar">

    {msg.username
      ?.charAt(0)
      ?.toUpperCase()}

  </div>

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

      {/* SINGLE IMAGE / GIF */}

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
