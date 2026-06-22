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
  // 🔥 DEBUG CONSOLE (ON SCREEN)
  // =========================

  const debug = document.createElement("div");

  debug.style.position = "fixed";
  debug.style.bottom = "90px";
  debug.style.left = "10px";
  debug.style.right = "10px";
  debug.style.maxHeight = "160px";
  debug.style.overflowY = "auto";
  debug.style.background = "rgba(0,0,0,0.85)";
  debug.style.color = "#00ff88";
  debug.style.fontSize = "11px";
  debug.style.padding = "8px";
  debug.style.borderRadius = "8px";
  debug.style.zIndex = "999999";
  debug.style.pointerEvents = "none";

  document.body.appendChild(debug);

  function log(msg) {
    console.log(msg);
    debug.innerText += msg + "\n";
    debug.scrollTop = debug.scrollHeight;
  }

  // Catch real errors
  window.onerror = function (message, source, lineno, colno) {
    log("❌ ERROR: " + message);
    log("Line: " + lineno + ":" + colno);
  };

  // =========================
  // USER DATA
  // =========================

  let username = "";

  let userId = localStorage.getItem("toxbox-id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("toxbox-id", userId);
  }

  let currentRoom = "general";

  log("🚀 User ID: " + userId);

  // =========================
  // SAFE DOM INIT (MOBILE FIX)
  // =========================

  let chatContainer;
  let messageInput;
  let userTag;

  const waitDOM = setInterval(() => {

    chatContainer = document.getElementById("chatContainer");
    messageInput = document.getElementById("messageInput");
    userTag = document.getElementById("userTag");

    if (chatContainer && messageInput && userTag) {

      clearInterval(waitDOM);

      log("✅ DOM READY");

      startFirebase();
    }

  }, 200);

  // =========================
  // FIREBASE LISTENER
  // =========================

  function startFirebase() {

    log("🔥 Firebase listener starting...");

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    onSnapshot(q, (snapshot) => {

      log("📩 Snapshot: " + snapshot.size);

      snapshot.forEach((doc) => {

        const data = doc.data();

        log("📄 MSG: " + JSON.stringify(data));

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

    const div = document.createElement("div");

    const isOwn = data.senderId === userId;

    div.className = isOwn ? "message own" : "message";

    div.innerHTML = `
      <div class="name">${data.user}</div>
      <div class="text">${escapeHtml(data.text)}</div>
    `;

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    log("➡️ Rendered: " + data.text);
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }

  // =========================
  // SEND MESSAGE
  // =========================

  async function sendMessage() {

    if (!messageInput) {
      log("❌ No message input");
      return;
    }

    const text = messageInput.value.trim();
    if (!text) return;

    log("📤 Sending: " + text);

    try {

      await addDoc(collection(db, "messages"), {
        id: crypto.randomUUID(),
        text,
        user: username || "Guest",
        senderId: userId,
        room: currentRoom,
        createdAt: serverTimestamp()
      });

      log("✅ SENT OK");

      messageInput.value = "";

    } catch (err) {
      log("❌ SEND ERROR: " + err.message);
    }
  }

  window.sendMessage = sendMessage;

  // =========================
  // START CHAT
  // =========================

  window.startChat = () => {

    const input = document.getElementById("usernameInput");

    if (!input || !input.value.trim()) {
      log("❌ Username empty");
      return;
    }

    username = input.value.trim();

    log("👤 Username: " + username);

    if (userTag) userTag.innerText = username;

    document.getElementById("loginScreen").style.display = "none";
  };

  // cleanup
  return () => clearInterval(waitDOM);

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
    <div className="logo">
      <div className="logo-circle">TB</div>
      <h1>Toxic Box</h1>
    </div>

    <div className="user-tag" id="userTag">Guest</div>
  </div>

  {/* CHAT */}
  <div className="chat-container" id="chatContainer">
    <div className="empty">No messages yet...</div>
  </div>

  {/* INPUT */}
  <div className="chat-input">
    <input id="messageInput" placeholder="Type message..." />
    <button onClick={() => window.sendMessage?.()}>
      Send
    </button>
  </div>

</div>
</>
);
  }
