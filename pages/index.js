import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const chatRef = useRef(null);

  const channel = useRef(null);

  useEffect(() => {
    channel.current = new BroadcastChannel("toxic_box_chat");

    channel.current.onmessage = (event) => {
      const data = event.data;
      if (!data || !data.text) return;

      setMessages((prev) => [...prev, data]);
    };
  }, []);

  function sendMessage() {
    if (!text.trim()) return;

    const msg = {
      id: crypto.randomUUID(),
      user: username || "Guest",
      text,
      time: Date.now(),
    };

    setMessages((prev) => [...prev, msg]);
    channel.current.postMessage(msg);
    setText("");

    setTimeout(() => {
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, 50);
  }

  return (
    <div className="app">

      {/* HEADER (YOUR DESIGN) */}
      <div className="header">
        <div className="logo">
          <div className="logo-circle">TB</div>
          <h1>Toxic Box</h1>
        </div>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* CHAT */}
      <div className="chat-container" ref={chatRef}>
        {messages.length === 0 && (
          <div className="empty">No messages yet...</div>
        )}

        {messages.map((m) => (
          <div key={m.id} className="message">
            <div className="name">{m.user}</div>
            <div className="text">{m.text}</div>
          </div>
        ))}
      </div>

      {/* INPUT (YOUR DESIGN STRUCTURE) */}
      <div className="chat-input">
        <div className="input-wrap">

          <button className="settings-btn">⚙️</button>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
          />

          <button className="send-btn" onClick={sendMessage}>
            Send
          </button>

        </div>
      </div>

    </div>
  );
}
