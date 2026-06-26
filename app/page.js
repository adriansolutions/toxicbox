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
  
  // LOAD SAVED USER
  useEffect(() => {
    
    const savedUser =
      localStorage.getItem(
        "bluechat-user"
      );
    
    if (savedUser) {
      
      setUser(
        JSON.parse(savedUser)
      );
      
    }
    
  }, []);
  
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
  
  // LOGIN PAGE
  if (!user) {
    
    if (page === "login") {
      
      return (
        
        <Login
      setUser={setUser}
      openRegister={() =>
        setPage(
          "register"
        )
      }
    />
        
      );
      
    }
    
    return (
      
      <Register
    setUser={setUser}
    openLogin={() =>
      setPage(
        "login"
      )
    }
  />
      
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
    
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#ffffff] dark:from-[#1e1f22] dark:via-[#232428] dark:to-[#313338] p-2 md:p-4">

  <div className="h-full w-full rounded-[35px] overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl flex bg-white/60 dark:bg-[#1e1f22]/80">

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
    />

    {/* CHAT */}

    <div className="flex-1 flex flex-col min-w-0">

      <Header
        username={
          user.username
        }

        userId={
          user.userId
        }

        avatar={
          user.avatar
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
      />

    </div>

  </div>

</div>
    
  );
  
      }
