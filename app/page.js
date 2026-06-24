"use client";

import { useEffect, useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export default function Home() {

  const [username, setUsername] =
    useState("");

  const [userId, setUserId] =
    useState("");

  const [joined, setJoined] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const [themeColor, setThemeColor] =
    useState("#2563eb");

  // THEME
  useEffect(() => {

    document.documentElement.style.setProperty(
      "--theme-color",
      themeColor
    );

    if (darkMode) {

      document.body.classList.add(
        "dark"
      );

    } else {

      document.body.classList.remove(
        "dark"
      );

    }

  }, [darkMode, themeColor]);

  // JOIN
  const joinChat = () => {

    if (!username.trim())
      return;

    const randomId =
      "#" +
      Math.floor(
        1000 +
          Math.random() *
            9000
      );

    setUserId(randomId);

    setJoined(true);

  };

  // LOGIN SCREEN
  if (!joined) {

    return (

      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-200 via-blue-100 to-white dark:from-[#1e1f22] dark:via-[#232428] dark:to-[#313338]">

        <div className="w-full max-w-md rounded-[35px] bg-white/70 dark:bg-[#1e1f22]/90 backdrop-blur-2xl border border-white/20 shadow-2xl p-8">

          <div className="text-center mb-8">

            <div className="w-28 h-28 rounded-[32px] bg-blue-600 flex items-center justify-center mx-auto text-white text-5xl font-black shadow-2xl shadow-blue-500/30 mb-6">

              B

            </div>

            <h1 className="text-5xl font-black text-blue-600">
              BlueChat
            </h1>

            <p className="mt-3 opacity-70">
              Modern realtime messaging
            </p>

          </div>

          <input
            type="text"
            placeholder="Enter Username"
            className="w-full h-[65px] px-5 rounded-2xl bg-white dark:bg-[#313338] border border-gray-200 dark:border-white/10 outline-none text-lg shadow-sm"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <button
            onClick={joinChat}
            className="w-full mt-5 h-[65px] rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-lg font-bold shadow-xl shadow-blue-500/30"
          >
            Enter Chat
          </button>

        </div>

      </div>

    );

  }

  // MAIN APP
  return (

    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#ffffff] dark:from-[#1e1f22] dark:via-[#232428] dark:to-[#313338] p-2 md:p-4">

      <div className="h-full w-full rounded-[35px] overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl flex bg-white/60 dark:bg-[#1e1f22]/80">

        {/* SIDEBAR */}

        <Sidebar
          darkMode={darkMode}
          setDarkMode={
            setDarkMode
          }
          themeColor={themeColor}
          setThemeColor={
            setThemeColor
          }
        />

        {/* CHAT */}

        <div className="flex-1 flex flex-col min-w-0">

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

    </div>

  );

}
