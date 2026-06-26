"use client";

import { useState } from "react";

export default function SettingsModal({
close,
darkMode,
setDarkMode,
themeColor,
setThemeColor,
currentUser,
setCurrentUser,
}) {

const [oldPassword, setOldPassword] =
useState("");

const [newPassword, setNewPassword] =
useState("");

const [confirmPassword, setConfirmPassword] =
useState("");

const [previewAvatar, setPreviewAvatar] =
useState("");

// PASSWORD
const changePassword = () => {

if (
  !oldPassword ||
  !newPassword ||
  !confirmPassword
) {

  alert(
    "Fill all password fields"
  );

  return;

}

if (
  oldPassword !==
  currentUser.password
) {

  alert(
    "Old password is incorrect"
  );

  return;

}

if (
  newPassword.length < 6
) {

  alert(
    "Password must be atleast 6 characters"
  );

  return;

}

if (
  newPassword !==
  confirmPassword
) {

  alert(
    "Passwords do not match"
  );

  return;

}

const updatedUser = {
  ...currentUser,
  password: newPassword,
};

localStorage.setItem(
  "bluechat-user",
  JSON.stringify(updatedUser)
);

setCurrentUser(updatedUser);

setOldPassword("");
setNewPassword("");
setConfirmPassword("");

alert(
  "Password changed successfully"
);

};

// AVATAR UPLOAD
const uploadAvatar = (e) => {

const file =
  e.target.files[0];

if (!file) return;

// 2MB LIMIT
if (
  file.size >
  2 * 1024 * 1024
) {

  alert(
    "Avatar must be below 2MB"
  );

  return;

}

const lastChanged =
  currentUser.avatarChangedAt;

// 7 DAYS
if (lastChanged) {

  const days =
    (
      Date.now() -
      lastChanged
    ) /
    (1000 * 60 * 60 * 24);

  if (days < 7) {

    alert(
      `You can change avatar again in ${Math.ceil(
        7 - days
      )} day(s)`
    );

    return;

  }

}

const reader =
  new FileReader();

reader.onload = () => {

  setPreviewAvatar(
    reader.result
  );

};

reader.readAsDataURL(file);

};

// SAVE AVATAR
const saveAvatar = () => {

const updatedUser = {

  ...currentUser,

  avatar:
    previewAvatar,

  avatarChangedAt:
    Date.now(),

};

localStorage.setItem(
  "bluechat-user",
  JSON.stringify(updatedUser)
);

setCurrentUser(updatedUser);

setPreviewAvatar("");

alert(
  "Avatar updated"
);

};

// REMOVE AVATAR
const removeAvatar = () => {

const updatedUser = {

  ...currentUser,

  avatar: "",

};

localStorage.setItem(
  "bluechat-user",
  JSON.stringify(updatedUser)
);

setCurrentUser(updatedUser);

alert(
  "Avatar removed"
);

};

// LOGOUT
const logout = () => {

localStorage.removeItem(
  "bluechat-user"
);

window.location.reload();

};

return (

<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

  <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1e1f22] shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">

    {/* HEADER */}

    <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">

      <div>

        <h2 className="text-2xl font-black">
          Settings
        </h2>

        <p className="text-sm opacity-60 mt-1">
          Customize your chat
        </p>

      </div>

      <button
        onClick={close}
        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#383a40] hover:scale-105 transition"
      >
        ✕
      </button>

    </div>

    {/* CONTENT */}

    <div className="p-6 space-y-8">

      {/* PROFILE */}

      <div>

        <div className="font-semibold mb-4">
          Profile
        </div>

        <div className="flex items-center gap-4">

          {/* AVATAR */}

          <div className="relative">

            {currentUser?.avatar ? (

              <img
                src={
                  currentUser.avatar
                }
                className="
                  w-20
                  h-20
                  rounded-full
                  object-cover
                  border-4
                  border-blue-500
                "
              />

            ) : (

              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">

                {currentUser?.username
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

            )}

          </div>

          <div>

            <div className="font-bold text-lg">

              {
                currentUser?.username
              }

            </div>

            <div className="opacity-60 text-sm">

              {
                currentUser?.userId
              }

            </div>

          </div>

        </div>

        {/* AVATAR BUTTONS */}

        <div className="mt-5 flex gap-3">

          <input
            type="file"
            accept="image/*"
            hidden
            id="avatarUpload"
            onChange={
              uploadAvatar
            }
          />

          <label
            htmlFor="avatarUpload"
            className="
              px-4
              h-11
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              flex
              items-center
              cursor-pointer
              font-bold
            "
          >
            Upload Avatar
          </label>

          <button
            onClick={
              removeAvatar
            }
            className="
              px-4
              h-11
              rounded-2xl
              bg-red-500
              hover:bg-red-600
              text-white
              font-bold
            "
          >
            Remove
          </button>

        </div>

        {/* PREVIEW */}

        {previewAvatar && (

          <div className="mt-5">

            <div className="text-sm opacity-70 mb-3">

              Preview Avatar

            </div>

            <img
              src={previewAvatar}
              className="
                w-40
                h-40
                rounded-3xl
                object-cover
                border
                border-white/10
              "
            />

            <button
              onClick={
                saveAvatar
              }
              className="
                mt-4
                w-full
                h-12
                rounded-2xl
                bg-green-600
                hover:bg-green-700
                text-white
                font-bold
              "
            >
              Save Avatar
            </button>

          </div>

        )}

      </div>

      {/* DARK MODE */}

      <div className="flex items-center justify-between">

        <div>

          <div className="font-semibold">
            Dark Mode
          </div>

          <div className="text-sm opacity-60">
            Toggle dark appearance
          </div>

        </div>

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className={`w-16 h-9 rounded-full transition relative ${
            darkMode
              ? "bg-blue-600"
              : "bg-gray-300"
          }`}
        >

          <div
            className={`absolute top-1 w-7 h-7 rounded-full bg-white transition ${
              darkMode
                ? "left-8"
                : "left-1"
            }`}
          />

        </button>

      </div>

      {/* THEME */}

      <div>

        <div className="font-semibold mb-3">
          Theme Color
        </div>

        <input
          type="color"
          value={themeColor}
          onChange={(e) =>
            setThemeColor(
              e.target.value
            )
          }
          className="w-full h-16 rounded-2xl border-none cursor-pointer bg-transparent"
        />

      </div>

      {/* CHANGE PASSWORD */}

      <div>

        <div className="font-semibold mb-4">
          Change Password
        </div>

        <div className="space-y-3">

          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(
                e.target.value
              )
            }
            className="w-full h-12 px-4 rounded-2xl bg-gray-100 dark:bg-[#383a40] outline-none"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="w-full h-12 px-4 rounded-2xl bg-gray-100 dark:bg-[#383a40] outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full h-12 px-4 rounded-2xl bg-gray-100 dark:bg-[#383a40] outline-none"
          />

          <button
            onClick={
              changePassword
            }
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition"
          >
            Change Password
          </button>

        </div>

      </div>

      {/* LOGOUT */}

      <div>

        <button
          onClick={logout}
          className="w-full h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold transition"
        >
          Logout Account
        </button>

      </div>

    </div>

  </div>

</div>

);

        }
