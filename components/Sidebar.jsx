"use client";

import { useState } from "react";

import {
  FiMenu,
  FiSettings,
} from "react-icons/fi";

import SettingsModal from "./SettingsModal";

export default function Sidebar(props) {
  const [openSettings, setOpenSettings] =
    useState(false);

  return (
    <>
      <div className="w-[260px] bg-white dark:bg-gray-800 border-r flex flex-col justify-between p-4 max-md:w-[80px]">
        <div>
          <FiMenu size={28} />

          <div className="mt-8 space-y-3">
            <div className="bg-blue-600 text-white p-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                G
              </div>

              <span className="max-md:hidden">
                General
              </span>
            </div>

            <div className="p-3 rounded-xl flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                R
              </div>

              <span className="max-md:hidden">
                Random
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            setOpenSettings(true)
          }
        >
          <FiSettings size={28} />
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
