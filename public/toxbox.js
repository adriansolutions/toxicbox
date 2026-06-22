window.addEventListener("DOMContentLoaded", () => {

 const firebaseConfig = {
  apiKey: "AIzaSyAICZc6Q2bbwsv_UtUjRoWiQYtoxp3WB7U",
  authDomain: "toxicbox-f25b6.firebaseapp.com",
  projectId: "toxicbox-f25b6",
  storageBucket: "toxicbox-f25b6.firebasestorage.app",
  messagingSenderId: "818643014600",
  appId: "1:818643014600:web:b0b5748dd129c0b3ebe6fd",
  measurementId: "G-DY5Q68N3F3"
};

let db = null;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
} catch (e) {
    console.error("Firebase failed:", e);
    db = null;
}

/* =========================================
   TOXIC BOX - FIXED FULL VERSION
========================================= */

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

const typingUsers = new Set();

let myUserId =
    localStorage.getItem("toxbox-id") ||
    crypto.randomUUID();

/* =========================
   DOM SAFE INIT (NEXT.JS FIX)
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
   LOGIN FIX (ENTER CHAT WORKS)
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

        userId = (data.username === username)
            ? data.id
            : generateId();
    } else {
        userId = generateId();
    }

    localStorage.setItem(
        "toxicbox_user",
        JSON.stringify({ username, id: userId })
    );

    userFlag = userFlag || "🌍";

    const loginScreen = document.getElementById("loginScreen");
    const userTag = document.getElementById("userTag");

    if (userTag) {
        userTag.innerText = `${username}#${userId} ${userFlag}`;
    }

    if (loginScreen) {
        loginScreen.style.display = "none";
    }
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

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function isInappropriate(text) {
    const badWords = ["fuck", "shit", "bitch", "asshole"];
    return badWords.some(w => text.toLowerCase().includes(w));
}

/* =========================
   ROOMS (FIXED SIDEBAR)
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

    if (messages[room].length === 0 && emptyText) {
        emptyText.style.display = "block";
    } else if (emptyText) {
        emptyText.style.display = "none";
    }

    messages[room].forEach(msg => {
        createMessage(msg, false);
        renderReactions(msg.id, room);
    });

    renderRooms();
}

/* =========================
   MESSAGE CREATE
========================= */

function createMessage(data, own = false) {

    if (!chatContainer) return;

    const id = data.id;

    const div = document.createElement("div");
    div.className = own ? "message own" : "message";
    div.dataset.id = id;

    div.innerHTML = `
        <div class="name">${data.user}</div>

        ${data.replyTo ? `
            <div style="font-size:12px;opacity:0.6;border-left:2px solid #888;padding-left:8px;margin-bottom:6px;">
                Replying to ${data.replyTo}
            </div>` : ""}

        <div class="text">${escapeHtml(data.text)}</div>

        <div class="actions">
            <button onclick="react('${id}','👍')">👍</button>
            <button onclick="react('${id}','❤️')">❤️</button>
            <button onclick="react('${id}','😂')">😂</button>
            <button onclick="setReply('${data.user}')">Reply</button>
        </div>

        <div class="reactions" id="r-${id}"></div>
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
    messageInput.placeholder = "Type your message...";

    if (!messages[currentRoom]) messages[currentRoom] = [];

    messages[currentRoom].push(messageData);

    createMessage(messageData, true);

    if (db) {
    db.ref("messages").push(messageData);
    }

    messageInput.value = "";
}

/* =========================
   CHANNEL (FIXED SINGLE HANDLER)
========================= */
if (db) {
    db.ref("messages").on("child_added", (snap) => {
        const data = snap.val();
        if (!data) return;

        if (!messages[data.room]) {
            messages[data.room] = [];
        }

        messages[data.room].push(data);

        if (data.room === currentRoom) {
            createMessage(
                data,
                data.user === `${username}#${userId} ${userFlag}`
            );
        }

        rooms[data.room].count++;
        renderRooms();
    });
}
/* =========================
   REACTIONS
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

   // channel.postMessage({
       // type: "reaction",
       // room: currentRoom,
        //id,
       // emoji,
       // user: myUserId
    //});

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
        const count = data[e].length;
        if (count > 0) html += `${e} ${count} `;
    }

    box.innerHTML = html;
}

/* =========================
   SETTINGS / THEME FIXED
========================= */

function setMode(mode) {

    const isDark = mode === "dark";

    document.body.classList.toggle("light-mode", !isDark);

    localStorage.setItem("theme", mode);

    const toggle = document.getElementById("themeToggle");
    if (toggle) toggle.checked = isDark;
}

function toggleSettings() {
    document.getElementById("settingsPanel")
        ?.classList.toggle("active");
}

/* =========================
   TYPING
========================= */

function sendTyping() {

    if (isTyping) return;

    isTyping = true;

    //channel.postMessage({
        //type: "typing",
       // user: `${username}#${userId}`
   // });

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
        isTyping = false;
    }, 1000);
}

/* =========================
   EVENTS
========================= */
/* =========================
   STARTUP
========================= */

initDOM();

renderRooms();
switchRoom("general");

const saved = localStorage.getItem("theme") || "light";
setMode(saved);

if (messageInput) {

    messageInput.addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage();
    });

    messageInput.addEventListener("input", sendTyping);
}

/* =========================
   GLOBAL EXPORTS (IMPORTANT)
========================= */

window.startChat = startChat;
window.sendMessage = sendMessage;
window.toggleSettings = toggleSettings;
window.setMode = setMode;
window.react = react;
window.setReply = setReply;

function setReply(user) {
    replyTo = user;
    if (messageInput) {
        messageInput.placeholder = "Replying to " + user;
    }
}

});
