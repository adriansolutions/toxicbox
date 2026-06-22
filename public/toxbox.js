const firebaseConfig = {
  apiKey: "AIzaSyAICZc6Q2bbwsv_UtUjRoWiQYtoxp3WB7U",
  authDomain: "toxicbox-f25b6.firebaseapp.com",
  projectId: "toxicbox-f25b6",
  storageBucket: "toxicbox-f25b6.firebasestorage.app",
  messagingSenderId: "818643014600",
  appId: "1:818643014600:web:b0b5748dd129c0b3ebe6fd",
  measurementId: "G-DY5Q68N3F3"
};

/* =========================
   FIREBASE INIT (FIXED)
========================= */
let db = null;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.database();
} catch (e) {
  console.error("Firebase failed:", e);
  db = null;
}

/* =========================
   ERROR DEBUG (KEEP)
========================= */
window.onerror = function (msg, src, line) {
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.top = "0";
  box.style.left = "0";
  box.style.width = "100%";
  box.style.background = "red";
  box.style.color = "white";
  box.style.zIndex = "999999";
  box.style.padding = "10px";
  box.style.fontSize = "12px";
  box.style.wordBreak = "break-word";

  box.innerText = "ERROR:\n" + msg + "\nLINE: " + line;
  document.body.appendChild(box);
};

/* =========================
   STATE
========================= */
let username = "";
let userId = "";
let userFlag = "🌍";

let isTyping = false;
let typingTimeout;

let replyTo = null;

let reactions = {};

const rooms = {
  general: { count: 0 },
  gaming: { count: 0 },
  random: { count: 0 }
};

let currentRoom = "general";

let messages = {
  general: [],
  gaming: [],
  random: []
};

let myUserId =
  localStorage.getItem("toxbox-id") ||
  crypto.randomUUID();

/* =========================
   DOM
========================= */
let chatContainer;
let messageInput;
let userTag;
let emptyText;

function initDOM() {
  chatContainer = document.getElementById("chatContainer");
  messageInput = document.getElementById("messageInput");
  userTag = document.getElementById("userTag");
  emptyText = document.getElementById("emptyText");
}

/* =========================
   SAFE INIT FIX
========================= */
function loadReactions() {
  reactions = reactions || {};
}

/* =========================
   START CHAT
========================= */
window.startChat = function () {
  const input = document.getElementById("usernameInput");

  if (!input || input.value.trim() === "") {
    alert("Please enter a username");
    return;
  }

  username = input.value.trim();

  const saved = localStorage.getItem("toxicbox_user");

  if (saved) {
    const data = JSON.parse(saved);
    userId = (data.username === username) ? data.id : generateId();
  } else {
    userId = generateId();
  }

  localStorage.setItem(
    "toxicbox_user",
    JSON.stringify({ username, id: userId })
  );

  if (userTag) {
    userTag.innerText = `${username}#${userId} ${userFlag}`;
  }

  document.getElementById("loginScreen").style.display = "none";
};

/* =========================
   UTIL
========================= */
function generateId() {
  return Math.floor(1000 + Math.random() * 9000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

function isInappropriate(text) {
  const bad = ["fuck", "shit", "bitch", "asshole"];
  return bad.some(w => text.toLowerCase().includes(w));
}

/* =========================
   ROOMS
========================= */
function renderRooms() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = "";

  Object.keys(rooms).forEach(room => {
    const div = document.createElement("div");
    div.className = "room" + (room === currentRoom ? " active" : "");

    const count = rooms[room].count || 0;

    div.innerHTML = `
      ${room[0].toUpperCase()}
      <div class="badge">${count > 99 ? "99+" : count}</div>
    `;

    div.onclick = () => switchRoom(room);

    sidebar.appendChild(div);
  });
}

function switchRoom(room) {
  currentRoom = room;

  if (!chatContainer) return;

  chatContainer.innerHTML = "";

  if (!messages[room]) messages[room] = [];

  if (emptyText) {
    emptyText.style.display =
      messages[room].length === 0 ? "block" : "none";
  }

  messages[room].forEach(msg => {
    createMessage(msg, false);
    renderReactions(msg.id, room);
  });

  renderRooms();
}

/* =========================
   MESSAGE
========================= */
function createMessage(data, own = false) {
  if (!chatContainer) return;

  const div = document.createElement("div");
  div.className = own ? "message own" : "message";

  div.innerHTML = `
    <div class="name">${data.user}</div>

    ${data.replyTo ? `
      <div style="font-size:12px;opacity:0.6;border-left:2px solid #888;padding-left:8px;margin-bottom:6px;">
        Replying to ${data.replyTo}
      </div>` : ""}

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

/* =========================
   SEND MESSAGE (FIXED)
========================= */
function sendMessage() {
  const text = messageInput?.value.trim();
  if (!text) return;

  if (isInappropriate(text)) {
    alert("Blocked message");
    return;
  }

  const messageData = {
    id: crypto.randomUUID(),
    user: `${username}#${userId} ${userFlag}`,
    text,
    time: Date.now(),
    replyTo,
    room: currentRoom
  };

  replyTo = null;

  if (messageInput) messageInput.placeholder = "Type your message...";

  if (!messages[currentRoom]) messages[currentRoom] = [];

  messages[currentRoom].push(messageData);

  createMessage(messageData, true);

  /* ✅ FIXED FIREBASE PUSH */
  if (db) {
    db.ref("messages").push(messageData);
  }

  if (messageInput) messageInput.value = "";
}

/* =========================
   FIREBASE LISTENER
========================= */
if (db) {
  db.ref("messages").on("child_added", snap => {
    const data = snap.val();
    if (!data) return;

    if (!messages[data.room]) {
      messages[data.room] = [];
    }

    messages[data.room].push(data);

    if (data.room === currentRoom) {
      createMessage(data, false);
    }

    rooms[data.room].count++;
    renderRooms();
  });
}

/* =========================
   REACTIONS (FIXED)
========================= */
function handleReaction(data) {
  if (!reactions[data.room]) reactions[data.room] = {};
  if (!reactions[data.room][data.id]) reactions[data.room][data.id] = {};
  if (!reactions[data.room][data.id][data.emoji]) {
    reactions[data.room][data.id][data.emoji] = [];
  }

  const arr = reactions[data.room][data.id][data.emoji];

  const i = arr.indexOf(data.user);

  if (i !== -1) arr.splice(i, 1);
  else arr.push(data.user);

  renderReactions(data.id, data.room);
}

function react(id, emoji) {
  /* ❌ removed channel.postMessage (was breaking everything) */

  handleReaction({
    room: currentRoom,
    id,
    emoji,
    user: myUserId
  });
}

function renderReactions(id, room) {
  const box = document.getElementById("r-" + id);
  if (!box) return;

  const data = reactions[room]?.[id];
  if (!data) return;

  let html = "";

  for (let e in data) {
    if (data[e].length > 0) {
      html += `${e} ${data[e].length} `;
    }
  }

  box.innerHTML = html;
}

/* =========================
   TYPING (SAFE)
========================= */
function sendTyping() {
  if (isTyping) return;

  isTyping = true;

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    isTyping = false;
  }, 1000);
}

/* =========================
   THEME
========================= */
function setMode(mode) {
  document.body.classList.toggle("light-mode", mode === "light");
  localStorage.setItem("theme", mode);
}

/* =========================
   SIDEBAR
========================= */
window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("active");
};

/* =========================
   INIT
========================= */
window.addEventListener("DOMContentLoaded", () => {
  initDOM();
  loadReactions();

  renderRooms();
  switchRoom("general");

  setMode(localStorage.getItem("theme") || "light");

  if (messageInput) {
    messageInput.addEventListener("keypress", e => {
      if (e.key === "Enter") sendMessage();
    });

    messageInput.addEventListener("input", sendTyping);
  }
});

/* =========================
   GLOBAL EXPORTS
========================= */
window.startChat = startChat;
window.sendMessage = sendMessage;
window.react = react;
window.setMode = setMode;
window.setReply = setReply;

function setReply(user) {
  replyTo = user;
  if (messageInput) {
    messageInput.placeholder = "Replying to " + user;
  }
}
