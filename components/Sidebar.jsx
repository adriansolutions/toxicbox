"use client";

import { useState } from "react";

import {
  FiMenu,
  FiSettings,
  FiHash,
} from "react-icons/fi";

import SettingsModal from "./SettingsModal";

export default function Sidebar(props) {

  const [openSettings,
    setOpenSettings] =
    useState(false);

  const [openMenu,
    setOpenMenu] =
    useState(false);

  return (

    <>

      {/* MOBILE OVERLAY */}

      {openMenu && (

        <div
          onClick={() =>
            setOpenMenu(false)
          }
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />

      )}

      {/* SIDEBAR */}

      <div className={`

        sidebar-glass

        fixed md:relative z-50

        h-full

        transition-all duration-300

        ${openMenu
          ? "left-0"
          : "-left-full md:left-0"}

        w-[85px] md:w-[280px]

        flex flex-col
        justify-between

        p-4

      `}>

        {/* TOP */}

        <div>

          {/* MENU */}

          <button
            onClick={() =>
              setOpenMenu(
                !openMenu
              )
            }
            className="w-12 h-12 rounded-2xl bg-white dark:bg-[#313338] flex items-center justify-center shadow-lg"
          >

            <FiMenu size={24} />

          </button>

          {/* CHANNELS */}

          <div className="mt-8 space-y-3">

            {/* GENERAL */}

            <button className="w-full flex items-center gap-4 rounded-2xl bg-blue-600 text-white p-3 shadow-lg">

              <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-lg">

                G

              </div>

              <div className="hidden md:block text-left">

                <div className="font-bold">
                  General
                </div>

                <div className="text-xs opacity-70">
                  Main channel
                </div>

              </div>

            </button>

            {/* RANDOM */}

            <button className="w-full flex items-center gap-4 rounded-2xl hover:bg-white/50 dark:hover:bg-[#313338] p-3 transition">

              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg">

                R

              </div>

              <div className="hidden md:block text-left">

                <div className="font-bold">
                  Random
                </div>

                <div className="text-xs opacity-60">
                  Fun chat
                </div>

              </div>

            </button>

          </div>

        </div>

        {/* SETTINGS */}

        <button
          onClick={() =>
            setOpenSettings(true)
          }
          className="w-12 h-12 rounded-2xl bg-white dark:bg-[#313338] flex items-center justify-center shadow-lg"
        >

          <FiSettings size={22} />

        </button>

      </div>

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
