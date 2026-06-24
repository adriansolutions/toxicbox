"use client";

import { useState } from "react";

import {
  FiMenu,
  FiSettings,
  FiHash,
} from "react-icons/fi";

import SettingsModal from "./SettingsModal";

export default function Sidebar(props) {

  const [openSettings, setOpenSettings] =
    useState(false);

  const channels = [
    {
      name: "General",
      letter: "G",
      active: true,
    },
    {
      name: "Random",
      letter: "R",
      active: false,
    },
    {
      name: "Gaming",
      letter: "M",
      active: false,
    },
  ];

  return (

    <>

      <div className="sidebar-glass w-[280px] border-r border-white/10 flex flex-col justify-between p-4 max-md:w-[90px]">

        <div>

          <div className="flex items-center gap-3 mb-8">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">

              <FiMenu
                size={24}
                className="text-white"
              />

            </div>

            <div className="max-md:hidden">

              <div className="font-black text-xl">
                BlueChat
              </div>

              <div className="text-xs opacity-60">
                Channels
              </div>

            </div>

          </div>

          <div className="space-y-3">

            {channels.map((channel) => (

              <div
                key={channel.name}
                className={`group p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-200
                ${
                  channel.active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "hover:bg-white/20 dark:hover:bg-white/5"
                }`}
              >

                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold
                ${
                  channel.active
                    ? "bg-white text-blue-600"
                    : "bg-blue-600 text-white"
                }`}>

                  {channel.letter}

                </div>

                <div className="max-md:hidden flex-1">

                  <div className="font-semibold">
                    {channel.name}
                  </div>

                  <div className="text-xs opacity-70 flex items-center gap-1">

                    <FiHash size={12} />

                    chat room

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        <button
          onClick={() =>
            setOpenSettings(true)
          }
          className="w-14 h-14 rounded-2xl bg-white/20 dark:bg-white/5 hover:scale-105 transition flex items-center justify-center"
        >

          <FiSettings size={26} />

        </button>

      </div>

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
