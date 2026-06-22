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
  // USER ID (PERSISTENT)
  // =========================

  let username = "";

  let userId = localStorage.getItem("toxbox-id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("toxbox-id", userId);
  }

  let currentRoom = "general";

  // =========================
  // DOM SAFE INIT (MOBILE FIX)
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
      initFirebase();
    }

  }, 200);

  // =========================
  // FIREBASE LISTENER
  // =========================

  function initFirebase() {

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    onSnapshot(q, (snapshot) => {

      // CLEAR BEFORE RE-RENDER (FIX DUPLICATE BUG)
      chatContainer.innerHTML = "";

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data?.text) return;

        const isOwn = data.senderId === userId;

        const div = document.createElement("div");

        div.className = isOwn ? "message own" : "message";

        div.innerHTML = `
          <div class="name">${data.user}</div>
          <div class="text">${escapeHtml(data.text)}</div>
        `;

        chatContainer.appendChild(div);
      });

      chatContainer.scrollTop = chatContainer.scrollHeight;

    }, (err) => {
      console.log("Firebase error:", err);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }

  // =========================
  // SEND MESSAGE (FIXED)
  // =========================

  async function sendMessage() {

    const text = messageInput?.value?.trim();
    if (!text) return;

    await addDoc(collection(db, "messages"), {
      id: crypto.randomUUID(),
      text,
      user: username || "Guest",
      senderId: userId,
      room: currentRoom,
      createdAt: serverTimestamp()
    });

    messageInput.value = "";
  }

  // =========================
  // START CHAT
  // =========================

  window.startChat = () => {

    const input = document.getElementById("usernameInput");

    if (!input || !input.value.trim()) return;

    username = input.value.trim();

    if (userTag) {
      userTag.innerText = username;
    }

    document.getElementById("loginScreen").style.display = "none";
  };

  window.sendMessage = sendMessage;

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
