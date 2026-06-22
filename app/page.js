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
  // USER STATE (PERSISTENT ID)
  // =========================

  let username = "";
  let userId =
    localStorage.getItem("toxbox-id") ||
    crypto.randomUUID();

  localStorage.setItem("toxbox-id", userId);

  let currentRoom = "general";
  let replyTo = null;

  let messages = {
    general: [],
    gaming: [],
    random: []
  };

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
  // FIREBASE REAL-TIME LISTENER
  // =========================

  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "asc")
  );

  const unsub = onSnapshot(q, (snapshot) => {

    snapshot.docChanges().forEach((change) => {

      if (change.type !== "added") return;

      const data = change.doc.data();
      if (!data || !data.id) return;

      if (!messages[data.room]) {
        messages[data.room] = [];
      }

      // prevent duplicate render
      if (messages[data.room].some(m => m.id === data.id)) return;

      messages[data.room].push(data);

      const isOwn = data.senderId === userId;

      if (data.room === currentRoom) {
        createMessage(data, isOwn);
      }
    });
  });

  // =========================
  // MESSAGE RENDER (FIXED ALIGNMENT)
  // =========================

  function createMessage(data, isOwn) {

    if (emptyText) emptyText.style.display = "none";

    const div = document.createElement("div");

    div.className = isOwn
      ? "message own"
      : "message";

    div.innerHTML = `
      <div class="name">${data.user}</div>
      <div class="text">${escapeHtml(data.text)}</div>
    `;

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }

  // =========================
  // SEND MESSAGE (FIXED - NO DUPLICATE BUG)
  // =========================

  function sendMessage() {

    const text = messageInput.value.trim();
    if (!text) return;

    const messageData = {
      id: crypto.randomUUID(),
      text,
      room: currentRoom,
      time: Date.now(),

      // IMPORTANT FIX FOR OWN DETECTION
      user: `${username}#${userId}`,
      senderId: userId,

      replyTo
    };

    replyTo = null;

    addDoc(collection(db, "messages"), {
      ...messageData,
      createdAt: serverTimestamp()
    });

    messageInput.value = "";
  }

  // =========================
  // GLOBAL FUNCTIONS (UI HOOKS)
  // =========================

  window.sendMessage = sendMessage;

  window.startChat = () => {
    const input = document.getElementById("usernameInput");

    if (!input || !input.value.trim()) return;

    username = input.value.trim();

    userTag.innerText = `${username}#${userId}`;

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

  // =========================
  // CLEANUP (IMPORTANT)
  // =========================

  return () => {
    unsub();
    channel.close();
  };

}, []);

return (
<>
{/* LOGIN SCREEN */}
<div className="login-screen" id="loginScreen">
  <div className="login-box">
    <h2>Toxic Box</h2>

    <input id="usernameInput" placeholder="Enter username" />

    <button onClick={() => window.startChat?.()}>
      Enter Chat
    </button>
  </div>
</div>

{/* MAIN APP */}
<div className="app">

  {/* HEADER */}
  <div className="header">
    <button onClick={() => window.toggleSidebar?.()} className="toggle-btn">☰</button>

    <div className="logo">
      <div className="logo-circle">TB</div>
      <h1>Toxic Box</h1>
    </div>

    <div className="user-tag" id="userTag">Guest</div>
  </div>

  {/* SETTINGS */}
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

  {/* CHAT */}
  <div className="chat-container" id="chatContainer">
    <div className="empty" id="emptyText">No messages yet...</div>
  </div>

  {/* INPUT */}
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

  {/* SIDEBAR */}
  <div className="sidebar" id="sidebar"></div>

</div>
</>
);
    }
