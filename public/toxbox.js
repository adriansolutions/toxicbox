(function () {
    /*
=========================================
TOXIC BOX
Public Temporary Chat
No Backend
=========================================

How it works:
- Username saved locally
- Random 4 digit ID
- Uses BroadcastChannel
- Chats between tabs/windows/users
- Refresh = messages reset
*/

let username = "";
let userId = "";
let userFlag = "🌍";
getCountryFlag().then(flag => {
    userFlag = flag;
});
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

const chatContainer = document.getElementById("chatContainer");
const messageInput = document.getElementById("messageInput");
const userTag = document.getElementById("userTag");
const emptyText = document.getElementById("emptyText");

const channel = new BroadcastChannel("toxic_box_chat");
const typingUsers = new Set();
const myUserId =
    localStorage.getItem("toxbox-id") ||
    crypto.randomUUID();

function renderTyping(){

    let typingBox =
    document.getElementById("typingBox");

    if(!typingBox){
        typingBox = document.createElement("div");
        typingBox.id = "typingBox";
        typingBox.style.padding = "10px";
        typingBox.style.opacity = "0.7";
        typingBox.style.fontSize = "13px";
        chatContainer.appendChild(typingBox);
    }

    if(typingUsers.size === 0){
        typingBox.innerText = "";
        return;
    }

    typingBox.innerText =
    [...typingUsers].join(", ") + " is typing...";
}

channel.onmessage = (event)=>{

    const data = event.data;

    // typing
    if(data.type === "typing"){
        typingUsers.add(data.user);

        setTimeout(()=>{
            typingUsers.delete(data.user);
            renderTyping();
        },1500);

        renderTyping();
        return;
    }

    // ignore own messages
    if(data.user === `${username}#${userId}`){
        return;
    }

    createMessage(data,false);
};

function generateId(){
    return Math.floor(1000 + Math.random() * 9000);
}

function renderRooms(){

    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "";

    Object.keys(rooms).forEach(room => {

        const div = document.createElement("div");
        div.className = "room" + (room === currentRoom ? " active" : "");

        const count = rooms[room].count;

        div.innerHTML = `
            ${room[0].toUpperCase()}
            <div class="badge">
                ${count > 99 ? "99+" : count}
            </div>
        `;

        div.onclick = () => switchRoom(room);

        sidebar.appendChild(div);
    });
}

function switchRoom(room){

    currentRoom = room;

    chatContainer.innerHTML = "";

    // 🔥 SAFE INIT (VERY IMPORTANT)
    if(!messages[room]){
        messages[room] = [];
    }

    if(messages[room].length === 0){
        emptyText.style.display = "block";
    } else {
        emptyText.style.display = "none";
    }

    messages[room].forEach(msg => {

        createMessage(
            msg,
            msg.user === `${username}#${userId} ${userFlag}`
        );

        // restore reactions
        renderReactions(msg.id, room);
    });

    renderRooms();
}
function systemMessage(text){

    const div = document.createElement("div");
    div.className = "system-msg";
    div.innerText = text;

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function containsLink(text){
    return /(https?:\/\/|www\.)/i.test(text);
}

function startChat(){

    const input = document.getElementById("usernameInput");

    if(input.value.trim() === ""){
        alert("Please enter a username");
        return;
    }

    username = input.value.trim();

    const savedData = localStorage.getItem("toxicbox_user");

    if(savedData){
        const data = JSON.parse(savedData);

        if(data.username === username){
            userId = data.id;
        }else{
            userId = generateId();
            localStorage.setItem(
                "toxicbox_user",
                JSON.stringify({
                    username,
                    id:userId
                })
            );
        }
    }else{
        userId = generateId();

        localStorage.setItem("toxbox-id", myUserId);
    }

    userTag.innerText = `${username}#${userId} ${userFlag}`;

    document.getElementById("loginScreen").style.display = "none";
}

let replyTo = null;

function createMessage(data, own = false) {
    
    if (emptyText) {
        emptyText.style.display = "none";
    }
    
    let lastTime = null;

if(chatContainer.lastElementChild){
    lastTime = chatContainer.lastElementChild.dataset.time;
}

const currentTime = formatTime(data.time);

// TIME SEPARATOR (ONLY ON CHANGE)
if(lastTime !== currentTime){
    const timeDiv = document.createElement("div");
    timeDiv.className = "time-sep";
    timeDiv.innerText = currentTime;

    chatContainer.appendChild(timeDiv);
}
    
    const id = data.id;
    
    const div = document.createElement("div");
    
    div.className = own ?
        "message own" :
        "message";
    
    div.dataset.id = id;
    
    div.innerHTML = `
        <div class="name">
            ${data.user}
        </div>

        ${data.replyTo ? `
            <div style="
                font-size:12px;
                opacity:0.6;
                border-left:2px solid #888;
                padding-left:8px;
                margin-bottom:6px;
            ">
                Replying to ${data.replyTo}
            </div>
        ` : ""}

        <div class="text">
            ${escapeHtml(data.text)}
        </div>

        <!-- ACTION BAR -->
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

function cancelReply(){
    replyTo = null;
    messageInput.placeholder = "Type your message...";
}
let sidebarHidden = false;

function toggleSidebar() {
    
    const sidebar = document.getElementById("sidebar");
    
    if (!sidebar) return;
    
    sidebar.classList.toggle("active");
}
function sendMessage(){

    const text = messageInput.value.trim();

    if(!text) return;
    if(containsLink(text) || isInappropriate(text)){

    systemMessage("Your message has been removed due to inappropriate content.");

    return;
}

    const messageData = {
        id: crypto.randomUUID(),
        user: `${username}#${userId} ${userFlag}`,
        text: text,
        time: Date.now(),
        replyTo: replyTo,
        room: currentRoom
    };

    // reset reply
    replyTo = null;
    messageInput.placeholder = "Type your message...";

    // save locally
    messages[currentRoom].push(messageData);

    // show immediately
    createMessage(messageData, true);

    // send to others
    channel.postMessage(messageData);

    messageInput.value = "";
}

messageInput.addEventListener("keydown", (e) => {

    // only trigger if BACKSPACE is pressed
    if (e.key === "Backspace") {

        // if input is already empty → cancel reply
        if (messageInput.value.length === 0 && replyTo) {
            cancelReply();
        }
    }
});

channel.onmessage = (event) => {

    const data = event.data;
    
    if (data.type === "system") {
    
    if (data.room === currentRoom) {
        systemMessage(data.text);
    }
    
    return;
}

    // =========================
    // REACTION SYSTEM
    // =========================
    if (data.type === "reaction") {

        if (!reactions[data.room]) {
            reactions[data.room] = {};
        }

        if (!reactions[data.room][data.id]) {
            reactions[data.room][data.id] = {};
        }

        if (!reactions[data.room][data.id][data.emoji]) {
            reactions[data.room][data.id][data.emoji] = [];
        }

        const arr =
            reactions[data.room][data.id][data.emoji];

        const alreadyReacted =
    arr.includes(data.user);

if(alreadyReacted){

    // remove ONLY this user's reaction
    reactions[data.room][data.id][data.emoji] =
        arr.filter(u => u !== data.user);

} else {

    // add only if not already there
    arr.push(data.user);
}

        renderReactions(data.id, data.room);

        return;
    }

    // =========================
    // NORMAL MESSAGE SYSTEM
    // =========================

    if (!data || !data.text || !data.user || !data.room) return;

    // ignore self duplicate
    if (data.user === `${username}#${userId} ${userFlag}`) return;

    // create room if missing
    if (!messages[data.room]) {
        messages[data.room] = [];
    }

    messages[data.room].push(data);

    // only render if currently inside room
    if (data.room === currentRoom) {

        createMessage(data, false);

        chatContainer.scrollTop =
            chatContainer.scrollHeight;
    }

    // unread count from others only
    rooms[data.room].count++;

    renderRooms();
};


function react(messageId, emoji){

    channel.postMessage({
        type: "reaction",
        room: currentRoom,
        id: messageId,
        emoji: emoji,
        user: myUserId
    });

    applyReaction({
        room: currentRoom,
        id: messageId,
        emoji: emoji,
        user: myUserId
    });
}

function applyReaction(data) {
    
    const room = data.room;
    
    if (!reactions[room]) reactions[room] = {};
    if (!reactions[room][data.id]) reactions[room][data.id] = {};
    if (!reactions[room][data.id][data.emoji]) reactions[room][data.id][data.emoji] = [];
    
    const arr = reactions[room][data.id][data.emoji];
    
    const index = arr.indexOf(data.user);
    
    if (index !== -1) {
        arr.splice(index, 1); // remove reaction
    } else {
        arr.push(data.user); // add reaction
    }
    
    renderReactions(data.id, room);
}

function renderReactions(id, room) {
    
    const box = document.getElementById("r-" + id);
    if (!box) return;
    
    const data = reactions[room]?.[id];
    if (!data) return;
    
    let html = "";
    
    for (let emoji in data) {
        const count = data[emoji].length;
        
        if (count > 0) {
            html += `${emoji} ${count} `;
        }
    }
    
    box.innerHTML = html;
}

function saveReactions(){

    localStorage.setItem(
        "toxbox-reactions",
        JSON.stringify(reactions)
    );
}

function loadReactions(){

    const data = localStorage.getItem("toxbox-reactions");

    if(data){
        reactions = JSON.parse(data);
    }
}
function setReply(user){
    replyTo = user;
    messageInput.placeholder = "Replying to " + user;
}

function sendTyping(){

    if(isTyping) return;

    isTyping = true;

    channel.postMessage({
        type:"typing",
        user:`${username}#${userId}`
    });

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(()=>{
        isTyping = false;
    },1000);
}

messageInput.addEventListener("input", ()=>{
    sendTyping();
});

function formatTime(timestamp){
    const d = new Date(timestamp);

    return d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isInappropriate(text){

    const badWords = [
        "fuck",
        "shit",
        "bitch",
        "asshole"
    ];

    return badWords.some(word =>
        text.toLowerCase().includes(word)
    );
}

function joinRoom(room){

    currentRoom = room;

    // notify others
    channel.send(JSON.stringify({
        type: "system",
        room: rooms,
        text: `${username} joined the room`
    }));
}
/*
========================================
AUTO FLAG DETECTION
========================================
*/

async function getCountryFlag(){

    try {
        const language = navigator.language || "en-US";

        // REAL country from IP
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        let countryCode = data.country_code;

        if(!countryCode){
            countryCode = language.split("-")[1] || "";
        }

        if(!countryCode){
            return "🌍";
        }

        countryCode = countryCode.toUpperCase().slice(0,2);

        return String.fromCodePoint(
            ...[...countryCode].map(char =>
                127397 + char.charCodeAt(0)
            )
        );

    } catch (err) {
        return "🌍";
    }
}

messageInput.addEventListener("keypress",(e)=>{

    if(e.key === "Enter"){
        sendMessage();
    }

});

function escapeHtml(text){

    const div = document.createElement("div");

    div.innerText = text;

    return div.innerHTML;
}
function toggleSettings(){
    document.getElementById("settingsPanel")
        .classList.toggle("active");
}
function setMode(mode){

    const isDark = mode === "dark";

    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light-mode", mode === "light");

    localStorage.setItem("theme", mode);

    const toggle = document.getElementById("themeToggle");
    if(toggle){
        toggle.checked = isDark;
    }
}
window.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem("theme") || "light";

    setMode(saved);
});
renderRooms();
switchRoom("general");
saveReactions();
loadReactions();
})();
