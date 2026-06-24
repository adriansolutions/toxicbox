"use client";

import { useState } from "react";

import {
  FiMenu,
  FiSettings,
  FiX,
} from "react-icons/fi";

import SettingsModal from "./SettingsModal";

export default function Sidebar(props) {

  const [openSettings, setOpenSettings] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      <button
        onClick={() =>
          setMobileOpen(!mobileOpen)
        }
        className="fixed top-4 left-4 z-[9999] w-[48px] h-[48px] rounded-2xl bg-black/70 text-white flex items-center justify-center md:hidden backdrop-blur-xl"
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
          fixed md:relative
          top-0 left-0
          z-[9998]
          h-screen
          transition-all duration-300
          ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"}
        `}
      >

        <div>

          {/* TOP */}

          <div className="flex items-center gap-3 mt-20 md:mt-0">

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

        </div>

        {/* SETTINGS */}

        <button
          onClick={() =>
            setOpenSettings(true)
          }
          className="sidebar-btn"
        >
          <FiSettings size={24} />
        </button>

      </div>

      {/* DARK BACKGROUND */}

      {mobileOpen && (
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 bg-black/50 z-[9997] md:hidden"
        />
      )}

      {/* SETTINGS MODAL */}

      {openSettings && (
        <SettingsModal
          {...props}
          close={() =>
            setOpenSettings(false)
          }
        />
      )}

    </>
  );

}
