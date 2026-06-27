"use client";

import {
useEffect,
useState,
} from "react";

import {
FiMenu,
FiSettings,
FiX,
FiUserPlus,
} from "react-icons/fi";

import SettingsModal from "./SettingsModal";
import FriendsModal from "./FriendsModal";

export default function Sidebar(props) {

const [openSettings, setOpenSettings] =
useState(false);

const [mobileOpen, setMobileOpen] =
useState(false);

const [openFriends, setOpenFriends] =
useState(false);

const [friends, setFriends] =
useState([]);

// LOAD FRIENDS
useEffect(() => {

if (!props.userId)
  return;

const loadFriends = () => {

  const saved =
    localStorage.getItem(
      `bluechat-friends-${props.userId}`
    );

  if (saved) {

    setFriends(
      JSON.parse(saved)
    );

  } else {

    setFriends([]);

  }

};

loadFriends();

// AUTO REFRESH
window.addEventListener(
  "storage",
  loadFriends
);

return () => {

  window.removeEventListener(
    "storage",
    loadFriends
  );

};

}, [props.userId]);

// CHANGE CHAT
const changeChat = (
chat
) => {

props.setActiveChat(chat);

// CLOSE MOBILE SIDEBAR
setMobileOpen(false);

};

return (

<>

  {/* MOBILE MENU */}

  <button
    onClick={() =>
      setMobileOpen(!mobileOpen)
    }
    className="
      fixed
      top-4
      left-4
      z-[9999]
      w-[48px]
      h-[48px]
      rounded-2xl
      bg-black/70
      text-white
      flex
      items-center
      justify-center
      md:hidden
      backdrop-blur-xl
    "
  >

    {mobileOpen ? (

      <FiX size={24} />

    ) : (

      <FiMenu size={24} />

    )}

  </button>

  {/* SIDEBAR */}

  <div
    className={`
      sidebar-glass
      fixed
      md:relative
      top-0
      left-0
      z-[9998]
      h-screen
      transition-all
      duration-300
      flex
      flex-col
      justify-between

      ${
        mobileOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      }
    `}
  >

    {/* TOP */}

    <div>

      {/* LOGO */}

      <div className="flex items-center gap-3 mt-20 md:mt-0 px-4">

        <div className="logo-circle">

          B

        </div>

        <div className="channel-name text-xl font-bold">

          BlueChat

        </div>

      </div>

      {/* CHANNELS */}

      <div className="channels">

        {/* GENERAL */}

        <button
          onClick={() =>
            changeChat({
              type: "channel",
              id: "general",
              name: "General",
            })
          }
          className={`
            channel
            ${
              props.activeChat?.id ===
              "general"
                ? "active"
                : ""
            }
          `}
        >

          <div className="channel-icon">

            G

          </div>

          <div className="channel-name">

            General

          </div>

        </button>

        {/* RANDOM */}

        <button
          onClick={() =>
            changeChat({
              type: "channel",
              id: "random",
              name: "Random",
            })
          }
          className={`
            channel
            ${
              props.activeChat?.id ===
              "random"
                ? "active"
                : ""
            }
          `}
        >

          <div className="channel-icon">

            R

          </div>

          <div className="channel-name">

            Random

          </div>

        </button>

      </div>

      {/* FRIENDS */}

      <div className="mt-5 px-3">

        <div className="h-[1px] bg-white/10 mb-3 rounded-full" />

        <div className="space-y-2">

          {friends.length ===
            0 && (

            <div className="text-xs opacity-50 px-2 py-2">

              No friends yet

            </div>

          )}

          {friends.map((friend) => (

            <button
              key={friend.userId}

              onClick={() =>
                changeChat({
                  type: "dm",
                  id: friend.userId,
                  user: friend,
                })
              }

              className={`
                channel

                ${
                  props.activeChat?.id ===
                  friend.userId
                    ? "active"
                    : ""
                }
              `}
            >

              {/* AVATAR */}

              {friend.avatar ? (

                <img
                  src={friend.avatar}
                  alt="avatar"
                  className="
                    avatar
                    object-cover
                  "
                />

              ) : (

                <div className="avatar">

                  {friend.username
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

              )}

              {/* USERNAME */}

              <div className="channel-name truncate">

                {friend.username}

              </div>

            </button>

          ))}

        </div>

      </div>

    </div>

    {/* BOTTOM */}

    <div className="flex flex-col items-center gap-3 p-4">

      {/* ADD FRIEND */}

      <button
        onClick={() =>
          setOpenFriends(true)
        }
        className="sidebar-btn"
      >

        <FiUserPlus size={22} />

      </button>

      {/* SETTINGS */}

      <button
        onClick={() =>
          setOpenSettings(true)
        }
        className="sidebar-btn"
      >

        <FiSettings size={22} />

      </button>

    </div>

  </div>

  {/* MOBILE BG */}

  {mobileOpen && (

    <div
      onClick={() =>
        setMobileOpen(false)
      }
      className="
        fixed
        inset-0
        bg-black/50
        z-[9997]
        md:hidden
      "
    />

  )}

  {/* SETTINGS */}

  {openSettings && (

    <SettingsModal
      {...props}
      close={() =>
        setOpenSettings(false)
      }
    />

  )}

  {/* FRIENDS */}

  {openFriends && (

    <FriendsModal

      close={() =>
        setOpenFriends(false)
      }

      currentUser={{
        username:
          props.username,

        userId:
          props.userId,

        avatar:
          props.avatar,
      }}

      friends={friends}

      setFriends={setFriends}

      setActiveChat={
        props.setActiveChat
      }

    />

  )}

</>

);

}
