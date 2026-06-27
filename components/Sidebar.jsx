"use client";

import { useState, useRef } from "react";

import { FiMenu, FiSettings, FiX, FiUserPlus } from "react-icons/fi";

import SettingsModal from "./SettingsModal";
import FriendsModal from "./FriendsModal";

export default function Sidebar(props) {

  const [openSettings, setOpenSettings] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFriends, setOpenFriends] = useState(false);

  // USE ONLY PARENT STATE
  const friends = props.friends || [];

  const [friendMenu, setFriendMenu] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const holdTimeout = useRef(null);

  // CHANGE CHAT
  const changeChat = (chat) => {
    props.setActiveChat(chat);
    setMobileOpen(false);
  };

  // REMOVE FRIEND
  const removeFriend = async (friend) => {

    try {

      await fetch("/api/remove-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: props.userId,
          friendId: friend.userId,
        }),
      });

      // REMOVE FROM UI (parent state)
      props.setFriends((prev) =>
        prev.filter((f) => f.userId !== friend.userId)
      );

      if (props.activeChat?.id === friend.userId) {
        props.setActiveChat({
          type: "channel",
          id: "general",
          name: "General",
        });
      }

      setConfirmRemove(null);

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <>

      {/* MOBILE MENU */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[9999] w-[48px] h-[48px] rounded-2xl bg-black/70 text-white flex items-center justify-center md:hidden backdrop-blur-xl"
      >
        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* SIDEBAR */}
      <div className={`
        sidebar-glass fixed md:relative top-0 left-0 z-[9998] h-screen transition-all duration-300 flex flex-col justify-between
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* TOP */}
        <div>

          <div className="flex items-center gap-3 mt-20 md:mt-0 px-4">
            <div className="logo-circle">B</div>
            <div className="channel-name text-xl font-bold">BlueChat</div>
          </div>

          {/* CHANNELS */}
          <div className="channels">

            <button
              onClick={() =>
                changeChat({ type: "channel", id: "general", name: "General" })
              }
              className={`channel ${props.activeChat?.id === "general" ? "active" : ""}`}
            >
              <div className="channel-icon">G</div>
              <div className="channel-name">General</div>
            </button>

          </div>

          {/* FRIENDS */}
          <div className="mt-5 px-3">

            <div className="h-[1px] bg-white/10 mb-3 rounded-full" />

            <div className="space-y-2">

              {friends.length === 0 && (
                <div className="text-xs opacity-50 px-2 py-2">
                  No friends yet
                </div>
              )}

              {friends.map((friend) => (
                <div key={friend.userId}>

                  <button
                    onClick={() =>
                      changeChat({
                        type: "dm",
                        id: friend.userId,
                        user: friend,
                      })
                    }
                    className={`channel ${props.activeChat?.id === friend.userId ? "active" : ""}`}
                  >

                    {friend.avatar ? (
                      <img src={friend.avatar} className="avatar object-cover" />
                    ) : (
                      <div className="avatar">
                        {friend.username?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    <div className="channel-name truncate">
                      {friend.username}
                    </div>

                  </button>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="flex flex-col items-center gap-3 p-4">

          <button onClick={() => setOpenFriends(true)} className="sidebar-btn">
            <FiUserPlus size={22} />
          </button>

          <button onClick={() => setOpenSettings(true)} className="sidebar-btn">
            <FiSettings size={22} />
          </button>

        </div>

      </div>

      {/* FRIENDS MODAL */}
      {openFriends && (
        <FriendsModal
          close={() => setOpenFriends(false)}
          currentUser={{
            username: props.username,
            userId: props.userId,
            avatar: props.avatar,
          }}
          friends={friends}
          setFriends={props.setFriends}
          setActiveChat={props.setActiveChat}
        />
      )}

      {/* SETTINGS */}
      {openSettings && (
        <SettingsModal
          {...props}
          close={() => setOpenSettings(false)}
        />
      )}

    </>

  );

}
