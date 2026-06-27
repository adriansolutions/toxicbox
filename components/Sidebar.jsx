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

    const saved =
      localStorage.getItem(
        `bluechat-friends-${props.userId}`
      );

    if (saved) {

      setFriends(
        JSON.parse(saved)
      );

    }

  }, [props.userId]);

  return (

    <>

      {/* MOBILE MENU BUTTON */}

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

            <button className="channel active">

              <div className="channel-icon">

                G

              </div>

              <div className="channel-name">

                General

              </div>

            </button>

            <button className="channel">

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

            <div className="text-xs opacity-60 font-bold mb-3 px-2">

              FRIENDS

            </div>

            <div className="space-y-2">

              {friends.map(
                (friend) => (

                  <button
                    key={
                      friend.userId
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      p-2
                      rounded-2xl
                      hover:bg-black/5
                      dark:hover:bg-white/5
                      transition
                    "
                  >

                    {/* AVATAR */}

                    {friend.avatar ? (

                      <img
                        src={
                          friend.avatar
                        }
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

                    {/* INFO */}

                    <div className="text-left min-w-0">

                      <div className="font-semibold truncate">

                        {
                          friend.username
                        }

                      </div>

                      <div className="text-xs opacity-60">

                        {
                          friend.userId
                        }

                      </div>

                    </div>

                  </button>

                )
              )}

            </div>

          </div>

        </div>

        {/* BOTTOM BUTTONS */}

        <div className="flex items-center gap-3 p-4">

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

      {/* MOBILE BACKGROUND */}

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

      {/* FRIENDS MODAL */}

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

        />

      )}

    </>

  );

}
