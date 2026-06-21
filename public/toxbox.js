(() => {

/* =========================================
   TOXIC BOX - FULL FIXED NEXT.JS VERSION
========================================= */

/* =========================
   STATE
========================= */

let username = "";
let userId = "";
let userFlag = "🌍";

let isTyping = false;
let typingTimeout;
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

const channel = new BroadcastChannel("toxic_box_chat");
const typingUsers = new Set();

let myUserId =
    localStorage.getItem("toxbox-id") ||
    crypto.randomUUID();

/* =========================
   DOM (SAFE FOR NEXT.JS)
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
   STARTUP FIX (IMPORTANT)
========================= */

window.addEventListener("DOMContentLoaded", () => {

    initDOM();

    renderRooms();
    switchRoom("general");

    loadReactions();
    saveReactions();

    const saved = localStorage.getItem("theme") || "light";
    setMode(saved);
});

/* =========================
   LOGIN FIX (ENTER CHAT NOT WORKING FIXED)
========================= */

function startChat() {

    initDOM();

    const input = document.getElementById("usernameInput");

    if (!input || input.value.trim() === "") {
        alert("Please enter a username");
        return;
    }

    username = input.value.trim();

    const savedData = localStorage.getItem("toxicbox_user");

    if (savedData) {
        const data = JSON.parse(savedData);

        if (data.username === username) {
            userId = data.id;
        } else {
            userId = generateId();
            localStorage.setItem(
                "toxicbox_user",
                JSON.stringify({ username, id: userId })
            );
        }
    } else {
        userId = generateId();
        localStorage.setItem(
            "toxicbox_user",
            JSON.stringify({ username, id: userId })
        );
    }

    const loginScreen = document.getElementById("loginScreen");

    if (userTag) {
        userTag.innerText = `${username}#${userId} ${userFlag}`;
    }

    if (loginScreen) {
        loginScreen.style.display = "none";
    }
}

/* =========================
   ID
========================= */

function generateId() {
    return Math.floor(1000 + Math.random() * 9000);
}

/* =========================
   CHAT CORE
========================= */

function renderTyping() {

    let typingBox = document.getElementById("typingBox");

    if (!typingBox) {
        typingBox = document.createElement("div");
        typingBox.id = "typingBox";
        typingBox.style.padding = "10px";
        typingBox.style.opacity = "0.7";
        typingBox.style.fontSize = "13px";
        chatContainer.appendChild(typingBox);
    }

    if (typingUsers.size === 0) {
        typingBox.innerText = "";
        return;
    }

    typingBox.innerText =
        [...typingUsers].join(", ") + " is typing...";
}

/* =========================
   CHANNEL MESSAGE SYSTEM
========================= */

channel.onmessage = (event) => {

    const data = event.data;
    if (!data) return;

    if (data.type === "typing") {
        typingUsers.add(data.user);

        setTimeout(() => {
            typingUsers.delete(data.user);
            renderTyping();
        }, 1500);

        renderTyping();
        return;
    }

    if (data.type === "system") {
        if (data.room === currentRoom) {
            systemMessage(data.text);
        }
        return;
    }

    if (data.type === "reaction") {
        handleReaction(data);
        return;
    }

    if (!data.text) return;

    if (!messages[data.room]) messages[data.room] = [];

    messages[data.room].push(data);

    if (data.room === currentRoom) {
        createMessage(data, false);
    }

    rooms[data.room].count++;
    renderRooms();
};

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

        const count = rooms[room].count;

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

    messages[room].forEach(msg => {
        createMessage(msg, false);
        renderReactions(msg.id, room);
    });
}

/* =========================
   MESSAGE CREATION
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

    if (!messageInput) return;

    const text = messageInput.value.trim();
    if (!text) return;

    if (isInappropriate(text)) {
        systemMessage("Message blocked.");
        return;
    }

    const messageData = {
        id: crypto.randomUUID(),
        user: `${username}#${userId} ${userFlag}`,
        text,
        time: Date.now(),
        replyTo: replyTo,
        room: currentRoom
    };

    replyTo = null;

    if (!messages[currentRoom]) messages[currentRoom] = [];

    messages[currentRoom].push(messageData);

    createMessage(messageData, true);

    channel.postMessage(messageData);

    messageInput.value = "";
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

    const index = arr.indexOf(data.user);

    if (index !== -1) {
        arr.splice(index, 1);
    } else {
        arr.push(data.user);
    }

    renderReactions(data.id, data.room);
}

function react(id, emoji) {

    channel.postMessage({
        type: "reaction",
        room: currentRoom,
        id,
        emoji,
        user: myUserId
    });

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

    for (let emoji in data) {
        const count = data[emoji].length;
        if (count > 0) html += `${emoji} ${count} `;
    }

    box.innerHTML = html;
}

/* =========================
   SETTINGS
========================= */

function toggleSettings() {
    document.getElementById("settingsPanel")
        ?.classList.toggle("active");
}

function setMode(mode) {
    localStorage.setItem("theme", mode);
}

/* =========================
   HELPERS
========================= */

function systemMessage(text) {
    const div = document.createElement("div");
    div.className = "system-msg";
    div.innerText = text;
    chatContainer?.appendChild(div);
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

function isInappropriate(text) {
    const badWords = ["fuck", "shit", "bitch", "asshole"];
    return badWords.some(w => text.toLowerCase().includes(w));
}

/* =========================
   REPLY
========================= */

let replyTo = null;

function setReply(user) {
    replyTo = user;
    if (messageInput) {
        messageInput.placeholder = "Replying to " + user;
    }
}

/* =========================
   TYPING
========================= */

function sendTyping() {

    if (isTyping) return;

    isTyping = true;

    channel.postMessage({
        type: "typing",
        user: `${username}#${userId}`
    });

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
        isTyping = false;
    }, 1000);
}

/* =========================
   KEYBOARD EVENTS
========================= */

window.addEventListener("DOMContentLoaded", () => {

    if (messageInput) {
        messageInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });

        messageInput.addEventListener("input", sendTyping);
    }
});

/* =========================
   GLOBAL EXPORTS (IMPORTANT FOR HTML ONCLICK)
========================= */

window.startChat = startChat;
window.sendMessage = sendMessage;
window.toggleSettings = toggleSettings;
window.setMode = setMode;
window.react = react;
window.setReply = setReply;

})(); // END
