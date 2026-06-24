"use client";

import { useEffect, useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export default function Home() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [joined, setJoined] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState("#2563eb");

  useEffect(() => {
    fetch("/api/socket");
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--theme-color",
      themeColor
    );

    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode, themeColor]);

  const joinChat = () => {
    if (!username.trim()) return;

    const randomId =
      "#" + Math.floor(1000 + Math.random() * 9000);

    setUserId(randomId);
    setJoined(true);
  };

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-[90%] max-w-md shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            BlueChat
          </h1>

          <input
            type="text"
            placeholder="Enter Username"
            className="w-full p-4 rounded-xl border outline-none mb-4 dark:bg-gray-700"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <button
            onClick={joinChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl"
          >
            Enter Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
      />

      <div className="flex-1 flex flex-col">
        <Header
          username={username}
          userId={userId}
        />

        <ChatArea
          username={username}
          userId={userId}
        />
      </div>
    </div>
  );
            }
