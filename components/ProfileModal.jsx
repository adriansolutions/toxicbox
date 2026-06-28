"use client";

import { useState } from "react";
import { FiX, FiEdit2 } from "react-icons/fi";

export default function ProfileModal({
  close,
  user,
  currentUser,
}) {

  const [editing, setEditing] =
    useState(false);

  const isOwner =
    currentUser?.userId ===
    user?.userId;

  return (

    <div className="
      fixed
      inset-0
      z-[999999]
      bg-black/70
      backdrop-blur-sm
      flex
      items-center
      justify-center
      p-3
      overflow-y-auto
    ">

      <div className="
        relative
        w-full
        max-w-[420px]
        rounded-3xl
        overflow-hidden
        bg-[#1e1f22]
        border
        border-white/10
        shadow-2xl
        flex
        flex-col
      ">

        {/* CLOSE BUTTON */}

        <button
          onClick={close}
          className="
            absolute
            top-3
            right-3
            z-50
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

        <div className="
          relative
          w-full
          h-[160px]
          bg-[#2d3138]
        ">

          {user?.banner && (

            <img
              src={user.banner}
              alt="banner"
              className="
                w-full
                h-full
                object-cover
              "
            />

          )}

        </div>

        {/* CONTENT */}

        <div className="
          relative
          px-5
          pb-6
          pt-16
          flex
          flex-col
          items-center
        ">

          {/* AVATAR */}

          <div className="
            absolute
            -top-[55px]
            left-1/2
            -translate-x-1/2
            w-[110px]
            h-[110px]
            rounded-full
            border-[5px]
            border-[#1e1f22]
            overflow-hidden
            bg-[#5865f2]
            shadow-xl
          ">

            {user?.avatar ? (

              <img
                src={user.avatar}
                alt="avatar"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <div className="
                w-full
                h-full
                flex
                items-center
                justify-center
                text-white
                text-4xl
                font-black
              ">

                {user?.username
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

            )}

          </div>

          {/* USERNAME */}

          <div className="
            w-full
            text-center
            mt-1
          ">

            <div className="
              text-[24px]
              font-black
              text-white
              break-words
              leading-tight
            ">

              {user?.username}

            </div>

            <div className="
              text-sm
              opacity-60
              mt-1
              break-all
            ">

              {user?.userId}

            </div>

          </div>

          {/* FRIENDS */}

          <div className="
            mt-4
            text-sm
            opacity-80
          ">

            {user?.friends?.length || 0}
            {" "}
            Friends

          </div>

          {/* BIO */}

          <div className="
            mt-4
            w-full
            rounded-2xl
            bg-white/5
            p-4
            text-center
            text-sm
            leading-relaxed
            break-words
          ">

            {user?.bio ||
              "No bio yet."}

          </div>

          {/* EDIT PROFILE BUTTON */}

          {isOwner && (

            <button
              onClick={() =>
                setEditing(true)
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

              Edit Profile

            </button>

          )}

          {/* DETAILS */}

          <div className="
            mt-5
            w-full
            rounded-2xl
            bg-white/5
            p-4
            space-y-3
            text-sm
          ">

            <div>
              <strong>
                Hometown:
              </strong>
              {" "}
              {user?.hometown || "—"}
            </div>

            <div>
              <strong>
                Birthday:
              </strong>
              {" "}
              {user?.birthday || "—"}
            </div>

            <div>
              <strong>
                Status:
              </strong>
              {" "}
              {user?.status || "—"}
            </div>

            <div>
              <strong>
                Language:
              </strong>
              {" "}
              {user?.language || "—"}
            </div>

            <div>
              <strong>
                Work:
              </strong>
              {" "}
              {user?.work || "—"}
            </div>

            <div>
              <strong>
                Education:
              </strong>
              {" "}
              {user?.education || "—"}
            </div>

            <div>
              <strong>
                Hobbies:
              </strong>
              {" "}
              {user?.hobbies || "—"}
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
