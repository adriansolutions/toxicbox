import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState({
    general: [],
    gaming: [],
    random: []
  });

  const [currentRoom, setCurrentRoom] = useState("general");
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [theme, setTheme] = useState("light");

  const channelRef = useRef(null);
  const chatRef = useRef(null);

  // INIT CHANNEL
  useEffect(() => {
    channelRef.current = new BroadcastChannel("toxic_box_chat");

    channelRef.current.onmessage = (event) => {
      const data = event.data;
      if (!data?.text) return;

      if (data.type === "system") {
        addSystem(data.text);
        return;
      }

      setMessages((prev) => {
        const roomMsgs = prev[data.room] || [];
        return {
          ...prev,
          [data.room]: [...roomMsgs, data]
        };
      });
    };
  }, []);

  function addSystem(text) {
    setMessages((prev) => ({
      ...prev,
      [currentRoom]: [
        ...prev[currentRoom],
        {
          id: crypto.randomUUID(),
          system: true,
          text
        }
      ]
    }));
  }

  function isBad(text) {
    return /(fuck|shit|bitch|asshole|https?:\/\/|www\.)/i.test(text);
  }

  function sendMessage() {
    if (!text.trim()) return;

    if (isBad(text)) {
      addSystem("Message removed due to inappropriate content.");
      return;
    }

    const msg = {
      id: crypto.randomUUID(),
      user: username,
      text,
      room: currentRoom,
      time: Date.now(),
      replyTo
    };

    setMessages((prev) => ({
      ...prev,
      [currentRoom]: [...prev[currentRoom], msg]
    }));

    channelRef.current.postMessage(msg);

    setText("");
    setReplyTo(null);
  }

  function switchRoom(room) {
    setCurrentRoom(room);
  }

  return (
    <div className={`app ${theme}`}>

      {/* HEADER */}
      <div className="header">
        <div className="logo">
          <div className="logo-circle">TB</div>
          <h1>Toxic Box</h1>
        </div>

        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        {["general", "gaming", "random"].map((r) => (
          <button key={r} onClick={() => switchRoom(r)}>
            {r}
          </button>
        ))}
      </div>

      {/* CHAT */}
      <div className="chat-container" ref={chatRef}>
        {(messages[currentRoom] || []).map((m) => (
          <div key={m.id} className="message">
            {m.system ? (
              <div className="system-msg">{m.text}</div>
            ) : (
              <>
                <div className="name">{m.user}</div>
                <div className="text">{m.text}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <div className="input-wrap">

          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            ⚙️
          </button>

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

    </div>
  );
}      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
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
