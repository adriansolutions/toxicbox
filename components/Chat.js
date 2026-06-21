import { useEffect, useRef, useState } from "react";

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");
  const [theme, setTheme] = useState("dark");
  const [replyTo, setReplyTo] = useState(null);

  const channel = useRef(null);
  const chatRef = useRef(null);

  // INIT CHANNEL
  useEffect(() => {
    channel.current = new BroadcastChannel("toxic_box_chat");

    channel.current.onmessage = (e) => {
      const data = e.data;

      if (!data || data.room !== room) return;

      setMessages((prev) => [...prev, data]);
    };
  }, [room]);

  // SCROLL
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  // MODERATION
  function isBad(text) {
    const bad = ["fuck", "shit", "bitch", "asshole"];
    return bad.some(w => text.toLowerCase().includes(w));
  }

  function hasLink(text) {
    return /(https?:\/\/|www\.)/i.test(text);
  }

  // SEND MESSAGE
  function sendMessage() {

    if (!text.trim()) return;

    if (isBad(text) || hasLink(text)) {
      setMessages(prev => [...prev, {
        system: true,
        text: "Message removed due to inappropriate content"
      }]);
      setText("");
      return;
    }

    const msg = {
      id: crypto.randomUUID(),
      user: username || "Guest",
      text,
      room,
      time: Date.now(),
      replyTo
    };

    setMessages(prev => [...prev, msg]);

    channel.current.postMessage(msg);

    setText("");
    setReplyTo(null);
  }

  function formatTime(t) {
    return new Date(t).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return (
    <div className={theme === "dark" ? "app dark" : "app light"}>

      {/* HEADER */}
      <div className="header">
        <h2>Toxic Box</h2>

        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button onClick={() =>
          setTheme(theme === "dark" ? "light" : "dark")
        }>
          {theme}
        </button>
      </div>

      {/* ROOMS */}
      <div className="rooms">
        {["general", "gaming", "random"].map(r => (
          <button
            key={r}
            onClick={() => {
              setRoom(r);
              setMessages([]);
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* CHAT */}
      <div className="chat" ref={chatRef}>

        {messages.map((m) => (
          <div key={m.id || Math.random()} className="msg">

            {m.system ? (
              <div className="system">{m.text}</div>
            ) : (
              <>
                <div className="name">{m.user}</div>
                <div className="text">{m.text}</div>

                {m.replyTo && (
                  <div className="reply">
                    Replying to: {m.replyTo}
                  </div>
                )}

                <div className="time">
                  {m.time && formatTime(m.time)}
                </div>

                <button onClick={() => setReplyTo(m.user)}>
                  Reply
                </button>
              </>
            )}

          </div>
        ))}

      </div>

      {/* INPUT */}
      <div className="input">

        {replyTo && (
          <div className="reply-box">
            Replying to {replyTo}
            <button onClick={() => setReplyTo(null)}>x</button>
          </div>
        )}

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}
