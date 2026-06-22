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
   GLOBAL STATE
========================= */
let db = null;

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

const typingUsers = new Set();

/* =========================
   DOM
========================= */
let chatContainer;
let messageInput;
let userTag;
let emptyText;

/* =========================
   ERROR DEBUG
========================= */
window.onerror = function(msg, src, line) {
    const box = document.createElement("div");
    box.style = `
        position:fixed;top:0;left:0;width:100%;
        background:red;color:white;z-index:999999;
        padding:10px;font-size:12px;
    `;
    box.innerText = "ERROR: " + msg + " LINE: " + line;
    document.body.appendChild(box);
};

/* =========================
   SAFE FIREBASE INIT
========================= */
function initFirebase() {
    try {
        if (typeof firebase === "undefined") {
            console.error("Firebase not loaded");
            return;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        db = firebase.database();

    } catch (e) {
        console.error("Firebase init failed:", e);
        db = null;
    }
}

/* =========================
   INIT DOM
========================= */
function initDOM() {
    chatContainer = document.getElementById("chatContainer");
    messageInput = document.getElementById("messageInput");
    userTag = document.getElementById("userTag");
    emptyText = document.getElementById("emptyText");
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
    });

    renderRooms();
}

/* =========================
   MESSAGE
========================= */
function createMessage(data, own = false) {

    const div = document.createElement("div");
    div.className = own ? "message own" : "message";

    div.innerHTML = `
        <div class="name">${data.user}</div>
        <div class="text">${escapeHtml(data.text)}</div>
    `;

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* =========================
   SEND MESSAGE
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

    messages[currentRoom].push(messageData);

    createMessage(messageData, true);

    if (db) {
        db.ref("messages").push(messageData);
    }

    messageInput.value = "";
}

/* =========================
   FIREBASE LISTENER (FIXED)
========================= */
function startFirebaseListener() {
    if (!db) return;

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
    if (!sidebar) return;
    sidebar.classList.toggle("active");
};

/* =========================
   INIT ORDER (IMPORTANT FIX)
========================= */
window.addEventListener("DOMContentLoaded", () => {

    initFirebase();
    initDOM();

    renderRooms();
    switchRoom("general");

    const savedTheme = localStorage.getItem("theme") || "light";
    setMode(savedTheme);

    if (messageInput) {
        messageInput.addEventListener("keypress", e => {
            if (e.key === "Enter") sendMessage();
        });
    }

    setTimeout(() => {
        startFirebaseListener();
    }, 300);
});

/* =========================
   GLOBAL EXPORTS
========================= */
window.startChat = startChat;
window.sendMessage = sendMessage;
window.setMode = setMode;
window.setReply = setReply;

function setReply(user) {
    replyTo = user;
    if (messageInput) {
        messageInput.placeholder = "Replying to " + user;
    }
                        }
