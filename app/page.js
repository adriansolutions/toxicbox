"use client";

import { useEffect, useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

import Login from "../components/Login";
import Register from "../components/Register";

export default function Home() {

  const [user, setUser] =
    useState(null);

  const [page, setPage] =
    useState("login");

  const [darkMode, setDarkMode] =
    useState(false);

  const [themeColor, setThemeColor] =
    useState("#2563eb");

  const [loaded, setLoaded] =
    useState(false);

  // NEW
  const [friends, setFriends] =
    useState([]);

  // NEW
  const [activeChat, setActiveChat] =
    useState({
      type: "channel",
      id: "general",
    });

  // LOAD USER + SETTINGS
  useEffect(() => {

    Object.keys(localStorage).forEach((key) => {

  if (
    key.startsWith("bluechat-friends-") ||
    key.startsWith("bluechat-requests-")
  ) {

    localStorage.removeItem(key);

  }

});

location.reload();

    const savedUser =
      localStorage.getItem(
        "bluechat-user"
      );

    const savedDark =
      localStorage.getItem(
        "bluechat-darkmode"
      );

    const savedTheme =
      localStorage.getItem(
        "bluechat-theme"
      );

    if (savedUser) {

      const parsedUser =
        JSON.parse(savedUser);

      setUser(
        parsedUser
      );

      // LOAD FRIENDS
      const savedFriends =
        localStorage.getItem(
          `bluechat-friends-${parsedUser.userId}`
        );

      if (savedFriends) {

        setFriends(
          JSON.parse(
            savedFriends
          )
        );

      }

    }

    if (savedDark) {

      setDarkMode(
        JSON.parse(savedDark)
      );

    }

    if (savedTheme) {

      setThemeColor(
        savedTheme
      );

    }

    setLoaded(true);

  }, []);

  // SAVE THEME
  useEffect(() => {

    localStorage.setItem(
      "bluechat-darkmode",
      JSON.stringify(
        darkMode
      )
    );

    localStorage.setItem(
      "bluechat-theme",
      themeColor
    );

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

  // LOADING
  if (!loaded) {

    return null;

  }

  // LOGIN / REGISTER
  if (!user) {

    if (page === "login") {

      return (

        <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#ffffff] dark:from-[#1e1f22] dark:via-[#232428] dark:to-[#313338]">

          <Login
            setUser={setUser}
            openRegister={() =>
              setPage(
                "register"
              )
            }
          />

        </div>

      );

    }

    return (

      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#ffffff] dark:from-[#1e1f22] dark:via-[#232428] dark:to-[#313338]">

        <Register
          setUser={setUser}
          openLogin={() =>
            setPage(
              "login"
            )
          }
        />

      </div>

    );

  }

  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "bluechat-user"
    );

    localStorage.removeItem(
      "bluechat-token"
    );

    setUser(null);

  };

  // MAIN APP
  return (

    <main className="h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#ffffff] dark:from-[#1e1f22] dark:via-[#232428] dark:to-[#313338] p-2 md:p-4">

      <div className="h-full w-full rounded-[28px] md:rounded-[35px] overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl flex bg-white/60 dark:bg-[#1e1f22]/80">

        {/* SIDEBAR */}

        <Sidebar
          darkMode={darkMode}

          setDarkMode={
            setDarkMode
          }

          themeColor={
            themeColor
          }

          setThemeColor={
            setThemeColor
          }

          logout={logout}

          username={
            user.username
          }

          userId={
            user.userId
          }

          avatar={
            user.avatar
          }

          currentUser={
            user
          }

          setCurrentUser={
            setUser
          }

          // NEW
          friends={
            friends
          }

          setFriends={
            setFriends
          }

          // NEW
          activeChat={
            activeChat
          }

          setActiveChat={
            setActiveChat
          }
        />

        {/* CHAT */}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          <Header
            username={
              activeChat?.type ===
              "dm"
                ? activeChat
                    ?.user
                    ?.username
                : user.username
            }

            userId={
              activeChat?.type ===
              "dm"
                ? activeChat
                    ?.user
                    ?.userId
                : user.userId
            }

            avatar={
              activeChat?.type ===
              "dm"
                ? activeChat
                    ?.user
                    ?.avatar
                : user.avatar
            }
          />

          <ChatArea
            username={
              user.username
            }

            userId={
              user.userId
            }

            avatar={
              user.avatar
            }

            activeChat={
              activeChat
            }
          />

        </div>

      </div>

    </main>

  );

}
