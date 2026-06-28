"use client";

import { useState } from "react";

import {
FiX,
FiEdit2,
} from "react-icons/fi";

export default function ProfileModal({
user,
currentUser,
close,
onSave,
}) {

const isOwner =
currentUser?.userId ===
user?.userId;

const [editing, setEditing] =
useState(false);

const [form, setForm] =
useState({

  bio:
    user?.bio || "",

  hometown:
    user?.hometown || "",

  birthday:
    user?.birthday || "",

  status:
    user?.status || "",

  language:
    user?.language || "",

  work:
    user?.work || "",

  education:
    user?.education || "",

  hobbies:
    user?.hobbies || "",

  avatar:
    user?.avatar || "",

  banner:
    user?.banner || "",

});

const updateField = (
key,
value
) => {

setForm((prev) => ({
  ...prev,
  [key]: value,
}));

};

const saveProfile =
async () => {

  try {

    const res =
      await fetch(
        "/api/update-profile",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              userId:
                currentUser.userId,

              ...form,
            }),
        }
      );

    const data =
      await res.json();

    if (!data.success) {

      alert(
        data.message ||
        "Failed to save"
      );

      return;

    }

    if (onSave) {

      onSave(data.user);

    }

    setEditing(false);

  } catch (err) {

    console.log(err);

    alert("Server error");

  }

};

return (

<div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">

  <div
    className="
      relative
      w-full
      max-w-2xl
      rounded-[28px]
      overflow-hidden
      bg-[#1e1f22]
      border
      border-white/10
      shadow-2xl
      max-h-[95vh]
      overflow-y-auto
    "
  >

    {/* CLOSE */}

    <button
      onClick={close}
      className="
        fixed
        sm:absolute
        top-3
        right-3
        z-[999999]
        w-11
        h-11
        rounded-full
        bg-black/70
        backdrop-blur-xl
        text-white
        flex
        items-center
        justify-center
        border
        border-white/10
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
        sm:h-[220px]
        bg-cover
        bg-center
      "

      style={{
        backgroundImage:
          form.banner
            ? `url(${form.banner})`
            : "linear-gradient(135deg,#2563eb,#7c3aed)",
      }}
    >

      <div className="absolute inset-0 bg-black/30" />

    </div>

    {/* CONTENT */}

    <div className="relative px-4 sm:px-7 pb-7">

      {/* PROFILE TOP */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-end
        gap-4
        -mt-16
        sm:-mt-20
      ">

        {/* AVATAR */}

        <div className="
          relative
          w-[110px]
          h-[110px]
          sm:w-[140px]
          sm:h-[140px]
          rounded-full
          border-[5px]
          border-[#1e1f22]
          overflow-hidden
          bg-[#2b2d31]
          shrink-0
          mx-auto
          sm:mx-0
        ">

          {form.avatar ? (

            <img
              src={form.avatar}
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
              text-5xl
              font-black
              text-white
            ">

              {user?.username
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

          )}

        </div>

        {/* NAME */}

        <div className="
          flex-1
          min-w-0
          text-center
          sm:text-left
          pb-2
        ">

          <div className="
            text-[28px]
            sm:text-[34px]
            font-black
            text-white
            break-words
            leading-tight
          ">

            {user?.username}

          </div>

          <div className="
            text-sm
            sm:text-base
            text-white/60
            break-all
          ">

            {user?.userId}

          </div>

          <div className="
            mt-2
            text-sm
            text-blue-400
            font-semibold
          ">

            {user?.friends?.length || 0}
            {" "}
            Friends

          </div>

        </div>

      </div>

      {/* BIO */}

      <div className="
        mt-6
        rounded-3xl
        bg-white/5
        border
        border-white/10
        p-5
      ">

        <div className="
          text-lg
          font-bold
          text-white
          mb-2
        ">

          Bio

        </div>

        {editing ? (

          <textarea
            value={form.bio}
            onChange={(e) =>
              updateField(
                "bio",
                e.target.value
              )
            }
            className="
              w-full
              h-28
              rounded-2xl
              bg-[#2b2d31]
              border
              border-white/10
              p-4
              text-white
              outline-none
              resize-none
            "
          />

        ) : (

          <div className="
            text-white/80
            whitespace-pre-wrap
            break-words
          ">

            {form.bio ||
              "No bio yet."}

          </div>

        )}

        {/* EDIT BUTTON BELOW BIO */}

        {isOwner && !editing && (

          <button
            onClick={() =>
              setEditing(true)
            }
            className="
              mt-5
              w-full
              h-12
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >

            <FiEdit2 />

            Edit Profile

          </button>

        )}

      </div>

      {/* DETAILS */}

      <div className="
        mt-5
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-4
      ">

        {[
          ["Hometown","hometown"],
          ["Birthday","birthday"],
          ["Status","status"],
          ["Language","language"],
          ["Work","work"],
          ["Education","education"],
          ["Hobbies","hobbies"],
        ].map(([label,key]) => (

          <div
            key={key}
            className="
              rounded-3xl
              bg-white/5
              border
              border-white/10
              p-5
            "
          >

            <div className="
              text-sm
              font-bold
              text-white/50
              mb-2
            ">

              {label}

            </div>

            {editing ? (

              <input
                value={form[key]}
                onChange={(e) =>
                  updateField(
                    key,
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-11
                  rounded-2xl
                  bg-[#2b2d31]
                  border
                  border-white/10
                  px-4
                  text-white
                  outline-none
                "
              />

            ) : (

              <div className="
                text-white
                break-words
              ">

                {form[key] ||
                  "Not set"}

              </div>

            )}

          </div>

        ))}

      </div>

      {/* IMAGE URLS */}

      {editing && (

        <div className="
          mt-5
          space-y-4
        ">

          <div className="
            rounded-3xl
            bg-white/5
            border
            border-white/10
            p-5
          ">

            <div className="
              text-sm
              font-bold
              text-white/50
              mb-2
            ">

              Avatar URL

            </div>

            <input
              value={form.avatar}
              onChange={(e) =>
                updateField(
                  "avatar",
                  e.target.value
                )
              }
              className="
                w-full
                h-11
                rounded-2xl
                bg-[#2b2d31]
                border
                border-white/10
                px-4
                text-white
                outline-none
              "
            />

          </div>

          <div className="
            rounded-3xl
            bg-white/5
            border
            border-white/10
            p-5
          ">

            <div className="
              text-sm
              font-bold
              text-white/50
              mb-2
            ">

              Banner URL

            </div>

            <input
              value={form.banner}
              onChange={(e) =>
                updateField(
                  "banner",
                  e.target.value
                )
              }
              className="
                w-full
                h-11
                rounded-2xl
                bg-[#2b2d31]
                border
                border-white/10
                px-4
                text-white
                outline-none
              "
            />

          </div>

        </div>

      )}

      {/* SAVE BUTTONS */}

      {editing && (

        <div className="
          mt-6
          flex
          flex-col
          sm:flex-row
          gap-3
        ">

          <button
            onClick={() =>
              setEditing(false)
            }
            className="
              flex-1
              h-12
              rounded-2xl
              bg-white/10
              text-white
              font-bold
            "
          >

            Cancel

          </button>

          <button
            onClick={saveProfile}
            className="
              flex-1
              h-12
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
            "
          >

            Save Profile

          </button>

        </div>

      )}

    </div>

  </div>

</div>

);

}
