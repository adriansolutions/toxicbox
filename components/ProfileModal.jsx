"use client";

import { useState } from "react";

import {
  FiX,
  FiEdit2,
} from "react-icons/fi";

export default function ProfileModal({
  close,
  profileUser,
  currentUser,
}) {

  const isOwner =
    currentUser?.userId ===
    profileUser?.userId;

  const [editing, setEditing] =
    useState(false);

  return (

    <div
      className="
        fixed
        inset-0
        z-[999999]
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-2
        sm:p-5
        overflow-y-auto
      "
    >

      <div
        className="
          relative
          w-full
          max-w-[430px]
          rounded-[28px]
          bg-[#1e1f22]
          border
          border-white/10
          overflow-hidden
          shadow-2xl
        "
      >

        {/* CLOSE BUTTON */}

        <button
          onClick={close}
          className="
            absolute
            top-3
            right-3
            z-[999999]
            w-10
            h-10
            rounded-full
            bg-black/60
            text-white
            flex
            items-center
            justify-center
            backdrop-blur-xl
          "
        >

          <FiX size={22} />

        </button>

        {/* BANNER */}

        <div
          className="
            relative
            w-full
            h-[170px]
            bg-[#2f3136]
            overflow-hidden
          "
        >

          {profileUser?.banner ? (

            <img
              src={profileUser.banner}
              alt="banner"
              className="
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <div
              className="
                w-full
                h-full
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
              "
            />

          )}

        </div>

        {/* CONTENT */}

        <div
          className="
            relative
            px-4
            sm:px-6
            pb-6
            pt-[70px]
            flex
            flex-col
            items-center
          "
        >

          {/* AVATAR */}

          <div
            className="
              absolute
              -top-[60px]
              left-1/2
              -translate-x-1/2
              w-[120px]
              h-[120px]
              rounded-full
              overflow-hidden
              border-[5px]
              border-[#1e1f22]
              bg-[#5865f2]
              shadow-2xl
            "
          >

            {profileUser?.avatar ? (

              <img
                src={profileUser.avatar}
                alt="avatar"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <div
                className="
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                  text-white
                  text-5xl
                  font-black
                "
              >

                {profileUser?.username
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

            )}

          </div>

          {/* USERNAME */}

          <div
            className="
              w-full
              text-center
              mt-2
            "
          >

            <div
              className="
                text-[26px]
                font-black
                text-white
                leading-tight
                break-words
              "
            >

              {profileUser?.username}

            </div>

            <div
              className="
                text-sm
                opacity-60
                break-all
                mt-1
              "
            >

              {profileUser?.userId}

            </div>

          </div>

          {/* FRIEND COUNT */}

          <div
            className="
              mt-4
              text-sm
              opacity-80
            "
          >

            {profileUser?.friends?.length || 0}
            {" "}
            Friends

          </div>

          {/* BIO */}

          <div
            className="
              mt-4
              w-full
              rounded-2xl
              bg-white/5
              p-4
              text-center
              text-sm
              leading-relaxed
              break-words
            "
          >

            {profileUser?.bio ||
              "No bio yet."}

          </div>

          {/* EDIT BUTTON */}

          {isOwner && (

            <button
              onClick={() =>
                setEditing(
                  !editing
                )
              }
              className="
                mt-4
                w-full
                h-12
                rounded-2xl
                bg-blue-600
                hover:bg-blue-700
                transition
                text-white
                font-bold
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <FiEdit2 />

              {editing
                ? "Close Edit"
                : "Edit Profile"}

            </button>

          )}

          {/* EDIT PANEL */}

          {editing && (

            <div
              className="
                mt-4
                w-full
                space-y-3
              "
            >

              <input
                placeholder="Avatar URL"
                defaultValue={
                  profileUser?.avatar
                }
                className="
                  w-full
                  h-12
                  px-4
                  rounded-2xl
                  bg-white/10
                  outline-none
                "
              />

              <input
                placeholder="Banner URL"
                defaultValue={
                  profileUser?.banner
                }
                className="
                  w-full
                  h-12
                  px-4
                  rounded-2xl
                  bg-white/10
                  outline-none
                "
              />

              <textarea
                placeholder="Bio"
                defaultValue={
                  profileUser?.bio
                }
                className="
                  w-full
                  h-24
                  p-4
                  rounded-2xl
                  bg-white/10
                  outline-none
                  resize-none
                "
              />

            </div>

          )}

          {/* DETAILS */}

          <div
            className="
              mt-5
              w-full
              rounded-2xl
              bg-white/5
              p-4
              space-y-3
              text-sm
            "
          >

            <div>
              <strong>
                Hometown:
              </strong>
              {" "}
              {profileUser?.hometown || "—"}
            </div>

            <div>
              <strong>
                Birthday:
              </strong>
              {" "}
              {profileUser?.birthday || "—"}
            </div>

            <div>
              <strong>
                Status:
              </strong>
              {" "}
              {profileUser?.status || "—"}
            </div>

            <div>
              <strong>
                Language:
              </strong>
              {" "}
              {profileUser?.language || "—"}
            </div>

            <div>
              <strong>
                Work:
              </strong>
              {" "}
              {profileUser?.work || "—"}
            </div>

            <div>
              <strong>
                Education:
              </strong>
              {" "}
              {profileUser?.education || "—"}
            </div>

            <div>
              <strong>
                Hobbies:
              </strong>
              {" "}
              {profileUser?.hobbies || "—"}
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
