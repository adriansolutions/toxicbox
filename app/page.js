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
  // SAFE USER STATE
  // =========================

  let username = "";

  let userId =
    localStorage.getItem("toxbox-id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("toxbox-id", userId);
  }

  let currentRoom = "general";
  let replyTo = null;

  let messages = { general: [], gaming: [], random: [] };

  // =========================
  // SAFE DOM ACCESS
  // =========================

  const chatContainer = document.getElementById("chatContainer");
  const messageInput = document.getElementById("messageInput");
  const userTag = document.getElementById("userTag");
  const emptyText = document.getElementById("emptyText");

  if (!chatContainer || !messageInput || !userTag) return;

  // =========================
  // FIREBASE LISTENER
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

      // prevent duplicates
      if (messages[data.room].some(m => m.id === data.id)) return;

      messages[data.room].push(data);

      const isOwn = data.senderId === userId;

      if (data.room === currentRoom) {
        renderMessage(data, isOwn);
      }
    });
  });

  // =========================
  // RENDER MESSAGE
  // =========================

  function renderMessage(data, isOwn) {

    if (emptyText) emptyText.style.display = "none";

    const div = document.createElement("div");

    div.className = isOwn ? "message own" : "message";

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
  // SEND MESSAGE (FIXED - NO DUPLICATION)
  // =========================

  function sendMessage() {

    const text = messageInput.value.trim();
    if (!text) return;

    if (!username) username = "Guest";

    const messageData = {
      id: crypto.randomUUID(),
      text,
      room: currentRoom,
      time: Date.now(),

      user: username,
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

    userTag.innerText = username;

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
  // CLEANUP
  // =========================

  return () => {
    unsub();
  };

}, []);

return (
<>
{/* LOGIN */}
<div className="login-screen" id="loginScreen">
  <div className="login-box">
    <h2>Toxic Box</h2>

    <input id="usernameInput" placeholder="Enter username" />

    <button onClick={() => window.startChat?.()}>
      Enter Chat
    </button>
  </div>
</div>

{/* APP */}
<div className="app">

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
