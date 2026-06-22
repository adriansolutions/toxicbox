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
  // DEBUG CONSOLE (ON SCREEN)
  // =========================

  const debugBox = document.createElement("div");
  debugBox.id = "debugBox";
  debugBox.style.position = "fixed";
  debugBox.style.bottom = "80px";
  debugBox.style.left = "10px";
  debugBox.style.right = "10px";
  debugBox.style.maxHeight = "150px";
  debugBox.style.overflow = "auto";
  debugBox.style.background = "rgba(0,0,0,0.8)";
  debugBox.style.color = "#0f0";
  debugBox.style.fontSize = "12px";
  debugBox.style.padding = "10px";
  debugBox.style.zIndex = "99999";
  debugBox.style.borderRadius = "8px";

  document.body.appendChild(debugBox);

  function log(msg) {
    console.log(msg);
    const div = document.createElement("div");
    div.innerText = typeof msg === "object" ? JSON.stringify(msg) : msg;
    debugBox.appendChild(div);
    debugBox.scrollTop = debugBox.scrollHeight;
  }

  window.__log = log;

  log("🚀 CHAT LOADED");

  // =========================
  // USER SYSTEM
  // =========================

  let username = "";

  let userId = localStorage.getItem("toxbox-id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("toxbox-id", userId);
  }

  let currentRoom = "general";

  // =========================
  // DOM SAFE INIT (MOBILE SAFE)
  // =========================

  let chatContainer;
  let messageInput;
  let userTag;
  let emptyText;

  const waitDOM = setInterval(() => {

    chatContainer = document.getElementById("chatContainer");
    messageInput = document.getElementById("messageInput");
    userTag = document.getElementById("userTag");
    emptyText = document.getElementById("emptyText");

    if (chatContainer && messageInput && userTag) {

      clearInterval(waitDOM);

      log("✅ DOM READY");

      startFirebase();

    }

  }, 300);

  // =========================
  // FIREBASE LISTENER
  // =========================

  function startFirebase() {

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    onSnapshot(q, (snapshot) => {

      log("📡 Firebase update: " + snapshot.size);

      snapshot.forEach((doc) => {

        const data = doc.data();
        if (!data?.text) return;

        renderMessage(data);
      });

    }, (err) => {
      log("❌ FIREBASE ERROR: " + err.message);
    });

  }

  // =========================
  // RENDER MESSAGE
  // =========================

  function renderMessage(data) {

    if (!chatContainer) return;

    if (emptyText) emptyText.style.display = "none";

    const div = document.createElement("div");

    const isOwn = data.senderId === userId;

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
  // SEND MESSAGE
  // =========================

  function sendMessage() {

    if (!messageInput) {
      log("❌ messageInput not ready");
      return;
    }

    const text = messageInput.value.trim();
    if (!text) return;

    if (!username) username = "Guest";

    const messageData = {
      id: crypto.randomUUID(),
      text,
      user: username,
      senderId: userId,
      room: currentRoom,
      createdAt: serverTimestamp()
    };

    log("📤 Sending: " + text);

    addDoc(collection(db, "messages"), messageData)
      .then(() => log("✅ Sent"))
      .catch(err => log("❌ SEND ERROR: " + err.message));

    messageInput.value = "";
  }

  // =========================
  // GLOBAL FUNCTIONS
  // =========================

  window.sendMessage = sendMessage;

  window.startChat = () => {

    const input = document.getElementById("usernameInput");

    if (!input || !input.value.trim()) {
      log("❌ No username");
      return;
    }

    username = input.value.trim();

    if (userTag) {
      userTag.innerText = username;
    }

    document.getElementById("loginScreen").style.display = "none";

    log("👤 User: " + username);
  };

  window.toggleSidebar = () => {
    document.getElementById("sidebar")?.classList.toggle("active");
  };

  window.toggleSettings = () => {
    document.getElementById("settingsPanel")?.classList.toggle("active");
  };

  // =========================
  // CLEANUP
  // =========================

  return () => {
    clearInterval(waitDOM);
    document.getElementById("debugBox")?.remove();
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
