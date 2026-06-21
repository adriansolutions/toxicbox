import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/toxbox.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}

const htmlContent = `
<div class="login-screen" id="loginScreen">
  <div class="login-box">
    <h2>Toxic Box</h2>
    <p>Enter your username and join the public chat room instantly.</p>

    <div class="input-group">
      <label>Username</label>
      <input type="text" id="usernameInput" placeholder="Enter username">
    </div>

    <button class="start-btn" onclick="startChat()">Enter Chat</button>
  </div>
</div>

<div class="app">
  <div class="header">
    <button onclick="toggleSidebar()" class="toggle-btn">☰</button>

    <div class="logo">
      <div class="logo-circle">TB</div>
      <h1>Toxic Box</h1>
    </div>

    <div class="user-tag" id="userTag">Guest</div>
  </div>

  <div id="settingsPanel" class="settings-panel">
    <h3>Settings</h3>

    <div class="setting-item">
      <span>Dark Mode</span>

      <label class="switch">
        <input type="checkbox" id="themeToggle"
        onchange="setMode(this.checked ? 'dark' : 'light')">
        <span class="slider"></span>
      </label>
    </div>
  </div>

  <div class="chat-container" id="chatContainer">
    <div class="empty" id="emptyText">No messages yet...</div>
  </div>

  <div class="chat-input">
    <div class="input-wrap">
      <button class="settings-btn" onclick="toggleSettings()">⚙️</button>

      <input type="text" id="messageInput" placeholder="Type your message...">

      <button class="send-btn" onclick="sendMessage()">Send</button>
    </div>
  </div>

  <div class="sidebar" id="sidebar"></div>
</div>
`;
