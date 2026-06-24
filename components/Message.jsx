export default function Message({
  msg,
  messages,
  setMessages,
  setReplyingTo,
}) {
  const react = (emoji) => {
    const updated = messages.map((m) => {
      if (m.id === msg.id) {
        return {
          ...m,
          reactions: {
            ...m.reactions,
            [emoji]:
              (m.reactions[emoji] || 0) + 1,
          },
        };
      }

      return m;
    });

    setMessages(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
      {msg.replyTo && (
        <div className="text-sm opacity-70 mb-2">
          Replying to{" "}
          {msg.replyTo.username}
        </div>
      )}

      <div className="flex justify-between mb-2">
        <div className="font-bold text-blue-600">
          {msg.username} {msg.userId}
        </div>

        <div className="text-sm opacity-60">
          {msg.time}
        </div>
      </div>

      <div>{msg.text}</div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          onClick={() =>
            setReplyingTo(msg)
          }
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg"
        >
          Reply
        </button>

        <button
          onClick={() => react("👍")}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg"
        >
          👍 {msg.reactions["👍"] || 0}
        </button>

        <button
          onClick={() => react("🔥")}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg"
        >
          🔥 {msg.reactions["🔥"] || 0}
        </button>

        <button
          onClick={() => react("😂")}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg"
        >
          😂 {msg.reactions["😂"] || 0}
        </button>
      </div>
    </div>
  );
}
