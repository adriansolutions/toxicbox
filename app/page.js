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
  // STATE (UNCHANGED STRUCTURE)
  // =========================

  let username = "";
  let userId = "";
  let userFlag = "🌍";
  let currentRoom = "general";
  let replyTo = null;

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

  const channel = new BroadcastChannel("toxicbox");

  // =========================
  // DOM SAFE INIT
  // =========================

  const chatContainer = document.getElementById("chatContainer");
  const messageInput = document.getElementById("messageInput");
  const userTag = document.getElementById("userTag");
  const emptyText = document.getElementById("emptyText");

  if (!chatContainer || !messageInput || !userTag) return;

  // =========================
  // FIREBASE LISTENER (NO DUPLICATION FIX)
  // =========================

  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "asc")
  );

  const unsub = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {

      if (change.type !== "added") return;

      const data = change.doc.data();
      if (!data || !data.text) return;

      if (!messages[data.room]) {
        messages[data.room] = [];
      }

      // 🚨 FIX: prevent duplicate render
      const exists = messages[data.room].some(m => m.id === data.id);
      if (exists) return;

      messages[data.room].push(data);

      if (data.room === currentRoom) {
        createMessage(data, false);
      }
    });
  });

  // =========================
  // MESSAGE RENDER
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

  // =========================
  // SEND MESSAGE (FIXED - NO LOCAL DUPLICATE)
  // =========================

  function sendMessage() {

    const text = messageInput.value.trim();
    if (!text) return;

    const messageData = {
      id: crypto.randomUUID(),
      user: `${username}#${userId} ${userFlag}`,
      text,
      time: Date.now(),
      room: currentRoom,
      replyTo
    };

    replyTo = null;
    messageInput.placeholder = "Type your message...";

    // 🚨 FIX: ONLY FIREBASE (no local push, no local render)
    addDoc(collection(db, "messages"), {
      ...messageData,
      createdAt: serverTimestamp()
    });

    messageInput.value = "";
  }

  // =========================
  // BROADCAST CHANNEL (SAFE)
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
  };

  // =========================
  // GLOBAL FUNCTIONS (UI HOOKS)
  // =========================

  window.sendMessage = sendMessage;

  window.startChat = () => {
    const input = document.getElementById("usernameInput");

    if (!input || input.value.trim() === "") return;

    username = input.value.trim();
    userId = Math.floor(1000 + Math.random() * 9000);

    userTag.innerText = `${username}#${userId} ${userFlag}`;

    document.getElementById("loginScreen").style.display = "none";
  };

  window.toggleSidebar = () => {
    document.getElementById("sidebar")?.classList.toggle("active");
  };

  window.toggleSettings = () => {
    document.getElementById("settingsPanel")?.classList.toggle("active");
  };

  window.setReply = (user) => {
    replyTo = user;
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

  // =========================
  // CLEANUP
  // =========================

  return () => {
    unsub();
    channel.close();
  };

}, []);

return (
<>
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
