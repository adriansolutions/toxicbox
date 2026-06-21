import { useEffect, useRef, useState } from "react";

export default function ToxicBox() {
  const [started, setStarted] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [input, setInput] = useState("");

  const [currentRoom, setCurrentRoom] = useState("general");

  const [messages, setMessages] = useState({
    general: [],
    gaming: [],
    random: []
  });

  const channelRef = useRef(null);
  const replyRef = useRef(null);
  const reactionsRef = useRef({});
  const typingRef = useRef(new Set());

  // =========================
  // INIT CHANNEL (YOUR SYSTEM)
  // =========================
  useEffect(() => {
    channelRef.current = new BroadcastChannel("toxic_box_chat");

    channelRef.current.onmessage = (event) => {
      const data = event.data;
      if (!data) return;

      // ignore own
      if (data.user === `${username}#${userId}`) return;

      // reaction system
      if (data.type === "reaction") {
        const room = data.room;

        if (!reactionsRef.current[room]) reactionsRef.current[room] = {};
        if (!reactionsRef.current[room][data.id]) reactionsRef.current[room][data.id] = {};
        if (!reactionsRef.current[room][data.id][data.emoji]) {
          reactionsRef.current[room][data.id][data.emoji] = [];
        }

        const arr = reactionsRef.current[room][data.id][data.emoji];

        const index = arr.indexOf(data.user);
        if (index !== -1) arr.splice(index, 1);
        else arr.push(data.user);

        return;
      }

      // normal message
      setMessages((prev) => ({
        ...prev,
        [data.room]: [...(prev[data.room] || []), data]
      }));
    };

    return () => channelRef.current?.close();
  }, [username, userId]);

  // =========================
  // START CHAT
  // =========================
  function startChat() {
    if (!username.trim()) return;

    setUserId(Math.floor(1000 + Math.random() * 9000));
    setStarted(true);
  }

  // =========================
  // SEND MESSAGE (YOUR LOGIC)
  // =========================
  function sendMessage() {
    if (!input.trim()) return;

    const data = {
      id: crypto.randomUUID(),
      user: `${username}#${userId}`,
      text: input,
      time: Date.now(),
      room: currentRoom,
      replyTo: replyRef.current
    };

    setMessages((prev) => ({
      ...prev,
      [currentRoom]: [...(prev[currentRoom] || []), data]
    }));

    channelRef.current?.postMessage(data);

    setInput("");
    replyRef.current = null;
  }

  // =========================
  // REACTION SENDER
  // =========================
  function react(id, emoji) {
    const data = {
      type: "reaction",
      room: currentRoom,
      id,
      emoji,
      user: `${username}#${userId}`
    };

    channelRef.current?.postMessage(data);
  }

  // =========================
  // UI
  // =========================
  if (!started) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h2>Toxic Box</h2>

          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <button onClick={startChat}>Enter Chat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      <div className="header">
        <h1>Toxic Box</h1>
      </div>

      <div className="chat-container">

        {(messages[currentRoom] || []).map((msg) => (
          <div key={msg.id} className="message">
            <div className="name">{msg.user}</div>
            <div className="text">{msg.text}</div>

            <div className="actions">
              <button onClick={() => react(msg.id, "👍")}>👍</button>
              <button onClick={() => react(msg.id, "❤️")}>❤️</button>
              <button onClick={() => react(msg.id, "😂")}>😂</button>
            </div>
          </div>
        ))}

      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}
