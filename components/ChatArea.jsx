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
