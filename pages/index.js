import { useEffect, useRef } from "react";

export default function Home() {
  const chatRef = useRef(null);

  useEffect(() => {
    // =========================
    // YOUR ORIGINAL VARIABLES
    // =========================
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

    const chatContainer = document.getElementById("chatContainer");
    const messageInput = document.getElementById("messageInput");
    const userTag = document.getElementById("userTag");
    const emptyText = document.getElementById("emptyText");

    const channel = new BroadcastChannel("toxic_box_chat");
    const typingUsers = new Set();

    // =========================
    // YOUR FUNCTIONS (UNCHANGED LOGIC)
    // =========================

    function generateId() {
      return Math.floor(1000 + Math.random() * 9000);
    }

    function systemMessage(text) {
      const div = document.createElement("div");
      div.className = "system-msg";
      div.innerText = text;
      chatContainer.appendChild(div);
    }

    function containsLink(text) {
      return /(https?:\/\/|www\.)/i.test(text);
    }

    function isInappropriate(text) {
      const badWords = ["fuck", "shit", "bitch", "asshole"];
      return badWords.some(word =>
        text.toLowerCase().includes(word)
      );
    }

    function sendMessage() {
      const text = messageInput.value.trim();
      if (!text) return;

      if (containsLink(text) || isInappropriate(text)) {
        systemMessage("Your message has been removed due to inappropriate content.");
        return;
      }

      const messageData = {
        id: crypto.randomUUID(),
        user: `${username}#${userId} ${userFlag}`,
        text,
        time: Date.now(),
        room: currentRoom
      };

      messages[currentRoom].push(messageData);
      createMessage(messageData, true);

      channel.postMessage(messageData);

      messageInput.value = "";
    }

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

    function escapeHtml(text) {
      const div = document.createElement("div");
      div.innerText = text;
      return div.innerHTML;
    }

    function renderTyping() {}

    // =========================
    // CHANNEL (FIXED DUPLICATE ISSUE)
    // =========================

    channel.onmessage = (event) => {
      const data = event.data;

      if (!data || !data.text) return;
      if (data.user === `${username}#${userId} ${userFlag}`) return;

      if (!messages[data.room]) messages[data.room] = [];

      messages[data.room].push(data);

      createMessage(data, false);
    };

    // expose globals for onclick buttons
    window.sendMessage = sendMessage;
    window.systemMessage = systemMessage;

  }, []);

  return (
    <>
      {/* YOUR EXACT HTML STRUCTURE */}
      <div className="chat-container" id="chatContainer">
        <div className="empty" id="emptyText">
          No messages yet...
        </div>
      </div>

      <div className="chat-input">
        <div className="input-wrap">

          <button className="settings-btn">
            ⚙️
          </button>

          <input id="messageInput" />

          <button className="send-btn" onClick={() => window.sendMessage?.()}>
            Send
          </button>

        </div>
      </div>
    </>
  );
    }          [data.room]: [...roomMsgs, data]
        };
      });
    };
  }, []);

  function addSystem(text) {
    setMessages((prev) => ({
      ...prev,
      [currentRoom]: [
        ...prev[currentRoom],
        {
          id: crypto.randomUUID(),
          system: true,
          text
        }
      ]
    }));
  }

  function isBad(text) {
    return /(fuck|shit|bitch|asshole|https?:\/\/|www\.)/i.test(text);
  }

  function sendMessage() {
    if (!text.trim()) return;

    if (isBad(text)) {
      addSystem("Message removed due to inappropriate content.");
      return;
    }

    const msg = {
      id: crypto.randomUUID(),
      user: username,
      text,
      room: currentRoom,
      time: Date.now(),
      replyTo
    };

    setMessages((prev) => ({
      ...prev,
      [currentRoom]: [...prev[currentRoom], msg]
    }));

    channelRef.current.postMessage(msg);

    setText("");
    setReplyTo(null);
  }

  function switchRoom(room) {
    setCurrentRoom(room);
  }

  return (
    <div className={`app ${theme}`}>

      {/* HEADER */}
      <div className="header">
        <div className="logo">
          <div className="logo-circle">TB</div>
          <h1>Toxic Box</h1>
        </div>

        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        {["general", "gaming", "random"].map((r) => (
          <button key={r} onClick={() => switchRoom(r)}>
            {r}
          </button>
        ))}
      </div>

      {/* CHAT */}
      <div className="chat-container" ref={chatRef}>
        {(messages[currentRoom] || []).map((m) => (
          <div key={m.id} className="message">
            {m.system ? (
              <div className="system-msg">{m.text}</div>
            ) : (
              <>
                <div className="name">{m.user}</div>
                <div className="text">{m.text}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <div className="input-wrap">

          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            ⚙️
          </button>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>
      </div>

    </div>
  );
}      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, 50);
  }

  return (
    <div className="app">

      {/* HEADER (YOUR DESIGN) */}
      <div className="header">
        <div className="logo">
          <div className="logo-circle">TB</div>
          <h1>Toxic Box</h1>
        </div>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* CHAT */}
      <div className="chat-container" ref={chatRef}>
        {messages.length === 0 && (
          <div className="empty">No messages yet...</div>
        )}

        {messages.map((m) => (
          <div key={m.id} className="message">
            <div className="name">{m.user}</div>
            <div className="text">{m.text}</div>
          </div>
        ))}
      </div>

      {/* INPUT (YOUR DESIGN STRUCTURE) */}
      <div className="chat-input">
        <div className="input-wrap">

          <button className="settings-btn">⚙️</button>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
          />

          <button className="send-btn" onClick={sendMessage}>
            Send
          </button>

        </div>
      </div>

    </div>
  );
}
