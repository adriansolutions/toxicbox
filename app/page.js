"use client";

import { useEffect, useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import ProfileModal from "../components/ProfileModal";

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

  // FRIENDS
  const [friends, setFriends] =
    useState([]);

  // ACTIVE CHAT
  const [activeChat, setActiveChat] =
    useState({
      type: "channel",
      id: "general",
      name: "General",
    });
    
    const [viewingProfile, setViewingProfile] =
  useState(null);

const [viewingProfileId, setViewingProfileId] =
  useState(null);

  // =========================
  // LOAD FRIENDS FROM API
  // =========================
  const loadFriends =
    async (userId) => {

      try {

        const res =
          await fetch(
            `/api/get-friends?userId=${userId}`
          );

        const data =
          await res.json();

        if (
          data.success
        ) {

          setFriends(
            data.friends || []
          );

        } else {

          setFriends([]);

        }

      } catch (err) {

        console.log(err);

        setFriends([]);

      }

    };

  // =========================
  // LOAD USER + SETTINGS
  // =========================
  useEffect(() => {

    const loadAll =
      async () => {

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

        // USER
        if (savedUser) {

          try {

            const parsedUser =
              JSON.parse(
                savedUser
              );

            // GET LATEST USER FROM DB
            const res =
              await fetch(
                `/api/get-user?userId=${parsedUser.userId}`
              );

            const userData =
              await res.json();

            if (
              userData.success
            ) {

              setUser(
                userData.user
              );

              // UPDATE LOCAL CACHE
              localStorage.setItem(
                "bluechat-user",
                JSON.stringify(
                  userData.user
                )
              );

              // LOAD FRIENDS
              await loadFriends(
                userData.user.userId
              );

            } else {

              setUser(null);

              setFriends([]);

            }

          } catch (err) {

            console.log(err);

            setUser(null);

            setFriends([]);

          }

        }

        // DARK MODE
        if (savedDark) {

          setDarkMode(
            JSON.parse(
              savedDark
            )
          );

        }

        // THEME
        if (savedTheme) {

          setThemeColor(
            savedTheme
          );

        }

        setLoaded(true);

      };

    // FIRST LOAD
    loadAll();

    // LIVE REFRESH
    const interval =
      setInterval(
        async () => {

          const savedUser =
            localStorage.getItem(
              "bluechat-user"
            );

          if (
            savedUser
          ) {

            try {

              const parsedUser =
                JSON.parse(
                  savedUser
                );

              // REFRESH USER
              const res =
                await fetch(
                  `/api/get-user?userId=${parsedUser.userId}`
                );

              const userData =
                await res.json();

              if (
                userData.success
              ) {

                setUser((prev) => {

  // prevent useless rerender spam
  if (
    JSON.stringify(prev) ===
    JSON.stringify(userData.user)
  ) {

    return prev;

  }

  return userData.user;

});

localStorage.setItem(
  "bluechat-user",
  JSON.stringify(
    userData.user
  )
);

                await loadFriends(
                  userData.user.userId
                );

              }

            } catch (err) {

              console.log(err);

            }

          }

        },
        15000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  useEffect(() => {

  if (!viewingProfileId)
    return;

  const interval =
    setInterval(
      async () => {

        try {

          const res =
            await fetch(
              `/api/get-profile?userId=${viewingProfileId}`
            );

          const data =
            await res.json();

          if (
            data.success
          ) {

            setViewingProfile(
              (prev) => {

                if (!prev)
                  return prev;

                // ONLY UPDATE CHANGED DATA
                return {
                  ...prev,
                  ...data.user,
                };

              }
            );

          }

        } catch (err) {

          console.log(err);

        }

      },
      15000
    );

  return () =>
    clearInterval(interval);

}, [viewingProfileId]);

  // =========================
  // SAVE THEME
  // =========================
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

    if (
      darkMode
    ) {

      document.body.classList.add(
        "dark"
      );

    } else {

      document.body.classList.remove(
        "dark"
      );

    }

  }, [
    darkMode,
    themeColor,
  ]);

  // =========================
  // LOADING
  // =========================
  if (!loaded) {

  return (

    <div className="realtime-loader">

      <div className="loader-logo">
        B
      </div>

      <div className="loader-dots">

        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />

      </div>

    </div>

  );

}

  // =========================
  // LOGIN / REGISTER
  // =========================
  if (!user) {

    if (
      page ===
      "login"
    ) {

      return (

        <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#ffffff] dark:from-[#1e1f22] dark:via-[#232428] dark:to-[#313338]">

          <Login
            setUser={
              setUser
            }
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
          setUser={
            setUser
          }
          openLogin={() =>
            setPage(
              "login"
            )
          }
        />

      </div>

    );

  }

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {

    localStorage.removeItem(
      "bluechat-user"
    );

    localStorage.removeItem(
      "bluechat-token"
    );

    setUser(null);

    setFriends([]);

  };

  // =========================
  // MAIN APP
  // =========================
  return (

    <main className="h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#ffffff] dark:from-[#1e1f22] dark:via-[#232428] dark:to-[#313338] p-2 md:p-4">

      <div className="h-full w-full rounded-[28px] md:rounded-[35px] overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl flex bg-white/60 dark:bg-[#1e1f22]/80">

        {/* SIDEBAR */}

        <Sidebar
          darkMode={
            darkMode
          }

          setDarkMode={
            setDarkMode
          }

          themeColor={
            themeColor
          }

          setThemeColor={
            setThemeColor
          }

          logout={
            logout
          }

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

          friends={
            friends
          }

          setFriends={
            setFriends
          }

          activeChat={
            activeChat
          }

          setActiveChat = {
  setActiveChat
}

setViewingProfile={(profile) => {

  setViewingProfile(profile);

  setViewingProfileId(
    profile?.userId || null
  );

}}
        />

        {/* CHAT */}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          <Header
            username={
              activeChat?.type ===
              "dm"
                ? activeChat
                    ?.user
                    ?.username ||
                  "Unknown User"
                : user.username
            }

            userId={
              activeChat?.type ===
              "dm"
                ? activeChat
                    ?.user
                    ?.userId ||
                  ""
                : user.userId
            }

            avatar={
              activeChat?.type ===
              "dm"
                ? activeChat
                    ?.user
                    ?.avatar ||
                  ""
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
              setViewingProfile={
  setViewingProfile
              }
          />

        </div>

      </div>

{
        viewingProfile && (
          <ProfileModal
            close={() => {

  setViewingProfile(null);

  setViewingProfileId(null);

}}

            profile={
              viewingProfile
            }

            currentUser={
              user
            }

            updateProfile={(updatedData) => {

  setUser((prev) => ({
    ...prev,
    ...updatedData,
  }));

  // UPDATE FRIENDS REALTIME
  setFriends((prev) =>
    prev.map((friend) => {

      if (
        friend.userId ===
        user.userId
      ) {

        return {
          ...friend,
          ...updatedData,
        };

      }

      return friend;

    })
  );

  // UPDATE LOCAL STORAGE
  localStorage.setItem(
    "bluechat-user",
    JSON.stringify({
      ...user,
      ...updatedData,
    })
  );

}}
          />
        )
      }

    </main>

  );

}
