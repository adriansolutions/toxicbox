"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [flag, setFlag] = useState("🌍");
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState({ general: [], gaming: [], random: [] });
  const [room, setRoom] = useState("general");
  const [input, setInput] = useState("");
  const [reactions, setReactions] = useState({});
  const [typing, setTyping] = useState([]);

  const channelRef = useRef(null);

  // INIT
  useEffect(() => {
    channelRef.current = new BroadcastChannel("toxic_box_chat");

    channelRef.current.onmessage = (event) => {
      const data = event.data;

      if (data.type === "typing") {
        setTyping((prev) => [...new Set([...prev, data.user])]);

        setTimeout(() => {
          setTyping((prev) => prev.filter((u) => u !== data.user));
        }, 1500);
        return;
      }

      if (data.type === "message") {
        setMessages((prev) => ({
          ...prev,
          [data.room]: [...prev[data.room], data],
        }));
      }
    };

    getFlag().then(setFlag);
  }, []);

  async function getFlag() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return data.country_code
        ? String.fromCodePoint(...[...data.country_code].map(c => 127397 + c.charCodeAt(0)))
        : "🌍";
    } catch {
      return "🌍";
    }
  }

  function generateId() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  function startChat() {
    if (!username) return;

    setUserId(generateId());
    setLoggedIn(true);
  }

  function sendMessage() {
    if (!input.trim()) return;

    const msg = {
      id: crypto.randomUUID(),
      user: `${username}#${userId} ${flag}`,
      text: input,
      time: Date.now(),
      room,
      type: "message",
    };

    setMessages((prev) => ({
      ...prev,
      [room]: [...prev[room], msg],
    }));

    channelRef.current.postMessage(msg);

    setInput("");
  }

  function sendTyping() {
    channelRef.current.postMessage({
      type: "typing",
      user: `${username}#${userId}`,
    });
  }

  function switchRoom(r) {
    setRoom(r);
  }

  function react(id, emoji) {
    const newReactions = { ...reactions };

    if (!newReactions[room]) newReactions[room] = {};
    if (!newReactions[room][id]) newReactions[room][id] = {};

    if (!newReactions[room][id][emoji]) {
      newReactions[room][id][emoji] = 1;
    } else {
      newReactions[room][id][emoji]++;
    }

    setReactions(newReactions);
  }

  if (!loggedIn) {
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
        <button onClick={() => document.querySelector(".sidebar").classList.toggle("active")}>
          ☰
        </button>

        <h1>Toxic Box</h1>

        <div>{username}#{userId} {flag}</div>
      </div>

      <div className="sidebar">
        {["general", "gaming", "random"].map((r) => (
          <div key={r} onClick={() => switchRoom(r)}>
            {r}
          </div>
        ))}
      </div>

      <div className="chat-container">
        {messages[room].map((m) => (
          <div key={m.id} className="message">
            <b>{m.user}</b>
            <div>{m.text}</div>

            <div>
              <button onClick={() => react(m.id, "👍")}>👍</button>
              <button onClick={() => react(m.id, "❤️")}>❤️</button>
              <button onClick={() => react(m.id, "😂")}>😂</button>
            </div>
          </div>
        ))}
      </div>

      {typing.length > 0 && (
        <div className="typing">
          {typing.join(", ")} is typing...
        </div>
      )}

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            sendTyping();
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
                                                             }
