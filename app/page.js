"use client";

import { useEffect } from "react";
import { db } from "../lib/firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

import "./globals.css";

export default function Home() {

useEffect(() => {

  // =========================
  // FIX 1: SAFE GLOBAL STATE
  // =========================

  let username = "";
  let userId = "";
  let userFlag = "🌍";
  let currentRoom = "general";

  let messages = {
    general: [],
    gaming: [],
    random: []
  };

  let rooms = {
    general: { count: 0 },
    gaming: { count: 0 },
    random: { count: 0 }
  };

  let reactions = {};
  let typingUsers = new Set();

  let isTyping = false;
  let typingTimeout;

  const channel = new BroadcastChannel("toxicbox");

  // =========================
  // FIX 2: WAIT FOR DOM SAFELY
  // =========================

  const chatContainer = document.getElementById("chatContainer");
  const messageInput = document.getElementById("messageInput");
  const userTag = document.getElementById("userTag");
  const emptyText = document.getElementById("emptyText");

  if (!chatContainer || !messageInput || !userTag) return;

  // =========================
  // FIX 3: FIREBASE SNAPSHOT (SAFE ORDER)
  // =========================

  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "asc")
  );

  const unsub = onSnapshot(q, (snapshot) => {

    snapshot.docChanges().forEach((change) => {

      if (change.type === "added") {

        const data = change.doc.data();
        if (!data) return;

        if (!messages[data.room]) {
          messages[data.room] = [];
        }

        messages[data.room].push(data);

        if (data.room === currentRoom) {
          createMessage(data, false);
        }
      }
    });
  });

  // =========================
  // FIX 4: FUNCTIONS (UNCHANGED LOGIC)
  // =========================

  function createMessage(data, own = false) {

    if (emptyText) emptyText.style.display = "none";

    const div = document.createElement("div");
    div.className = own ? "message own" : "message";

    div.innerHTML = `
      <div class="name">${data.user}</div>

      ${data.replyTo ? `
        <div style="font-size:12px;opacity:0.6;border-left:2px solid #888;padding-left:8px;margin-bottom:6px;">
          Replying to ${data.replyTo}
        </div>
      ` : ""}

      <div class="text">${escapeHtml(data.text)}</div>

      <div class="actions">
        <button onclick="react('${data.id}','👍')">👍</button>
        <button onclick="react('${data.id}','❤️')">❤️</button>
        <button onclick="react('${data.id}','😂')">😂</button>
        <button onclick="setReply('${data.user}')">Reply</button>
      </div>

      <div class="reactions" id="r-${data.id}"></div>
    `;

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }

  function systemMessage(text) {
    const div = document.createElement("div");
    div.className = "system-msg";
    div.innerText = text;
    chatContainer.appendChild(div);
  }

  function sendMessage() {

    const text = messageInput.value.trim();
    if (!text) return;

    const messageData = {
      id: crypto.randomUUID(),
      user: `${username}#${userId} ${userFlag}`,
      text,
      time: Date.now(),
      room: currentRoom
    };

    messages[currentRoom].push(messageData);

    createMessage(messageData, true);

    addDoc(collection(db, "messages"), {
      ...messageData,
      createdAt: serverTimestamp()
    });

    messageInput.value = "";
  }

  // =========================
  // FIX 5: SINGLE CHANNEL LISTENER (NO DUPLICATE)
  // =========================

  channel.onmessage = (event) => {

    const data = event.data;
    if (!data) return;

    if (data.type === "system") {
      if (data.room === currentRoom) {
        systemMessage(data.text);
      }
      return;
    }

    if (data.type === "reaction") {

      if (!reactions[data.room]) reactions[data.room] = {};
      if (!reactions[data.room][data.id]) reactions[data.room][data.id] = {};
      if (!reactions[data.room][data.id][data.emoji]) {
        reactions[data.room][data.id][data.emoji] = [];
      }

      const arr = reactions[data.room][data.id][data.emoji];

      if (arr.includes(data.user)) {
        reactions[data.room][data.id][data.emoji] =
          arr.filter(u => u !== data.user);
      } else {
        arr.push(data.user);
      }

      renderReactions(data.id, data.room);
      return;
    }

    if (!data.text || !data.user || !data.room) return;

    if (!messages[data.room]) messages[data.room] = [];

    messages[data.room].push(data);

    if (data.room === currentRoom) {
      createMessage(data, false);
    }

    rooms[data.room].count++;
  };

  // =========================
  // FIX 6: EXPOSE GLOBAL FUNCTIONS (IMPORTANT FOR YOUR HTML ONCLICK)
  // =========================

  window.sendMessage = sendMessage;

  window.startChat = () => {
    const input = document.getElementById("usernameInput");

    if (!input || input.value.trim() === "") {
      alert("Enter username");
      return;
    }

    username = input.value.trim();
    userId = Math.floor(1000 + Math.random() * 9000);

    userTag.innerText = `${username}#${userId} ${userFlag}`;

    const login = document.getElementById("loginScreen");
    if (login) login.style.display = "none";
  };

  window.toggleSidebar = () => {
    document.getElementById("sidebar")?.classList.toggle("active");
  };

  window.toggleSettings = () => {
    document.getElementById("settingsPanel")?.classList.toggle("active");
  };

  window.setReply = (user) => {
    messageInput.placeholder = "Replying to " + user;
  };

  window.react = (id, emoji) => {

    channel.postMessage({
      type: "reaction",
      room: currentRoom,
      id,
      emoji,
      user: `${username}#${userId}`
    });
  };

  function renderReactions(id, room) {
    const box = document.getElementById("r-" + id);
    if (!box) return;

    const data = reactions?.[room]?.[id];
    if (!data) return;

    let html = "";
    for (let emoji in data) {
      html += `${emoji} ${data[emoji].length} `;
    }

    box.innerHTML = html;
  }

  messageInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // =========================
  // CLEANUP (IMPORTANT FOR VERCEL)
  // =========================

  return () => {
    unsub();
    channel.close();
  };

}, []);

return (
<>
{/* YOUR ORIGINAL UI UNCHANGED */}
<div className="login-screen" id="loginScreen">
  <div className="login-box">
    <h2>Toxic Box</h2>

    <input id="usernameInput" placeholder="Enter username" />

    <button onClick={() => window.startChat?.()}>
      Enter Chat
    </button>
  </div>
</div>

<div className="app">

  <div className="header">
    <button onClick={() => window.toggleSidebar?.()} className="toggle-btn">☰</button>

    <div className="logo">
      <div className="logo-circle">TB</div>
      <h1>Toxic Box</h1>
    </div>

    <div className="user-tag" id="userTag">Guest</div>
  </div>

  <div id="settingsPanel" className="settings-panel">
    <h3>Settings</h3>
    <div className="setting-item">
      <span>Dark Mode</span>
      <label className="switch">
        <input type="checkbox" id="themeToggle"/>
        <span className="slider"></span>
      </label>
    </div>
  </div>

  <div className="chat-container" id="chatContainer">
    <div className="empty" id="emptyText">No messages yet...</div>
  </div>

  <div className="chat-input">
    <div className="input-wrap">

      <button className="settings-btn" onClick={() => window.toggleSettings?.()}>
        ⚙️
      </button>

      <input id="messageInput" placeholder="Type your message..." />

      <button className="send-btn" onClick={() => window.sendMessage?.()}>
        Send
      </button>

    </div>
  </div>

  <div className="sidebar" id="sidebar"></div>

</div>
</>
);
  }
