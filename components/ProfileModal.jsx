"use client";

import { useState } from "react";

import {
  FiX,
  FiEdit2,
} from "react-icons/fi";

export default function ProfileModal({
  close,
  user,
  isOwnProfile,
  onSave,
}) {

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] =
    useState({

      username:
        user?.username || "",

      avatar:
        user?.avatar || "",

      banner:
        user?.banner || "",

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

    });

  const updateField =
    (key, value) => {

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
                    user.userId,

                  ...form,
                }),
            }
          );

        const data =
          await res.json();

        if (!data.success) {

          alert(
            data.message ||
            "Failed to save profile"
          );

          return;

        }

        if (onSave) {

          onSave(form);

        }

        setEditing(false);

      } catch (err) {

        console.log(err);

        alert(
          "Server error"
        );

      }

    };

  return (

    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">

      <div
        className="
          relative
          w-full
          max-w-2xl
          rounded-[32px]
          overflow-hidden
          bg-[#1e1f22]
          border
          border-white/10
          shadow-2xl
          my-6
        "
      >

        {/* CLOSE BUTTON */}

        <button
          onClick={close}
          className="
            absolute
            top-4
            right-4
            z-50
            w-11
            h-11
            rounded-2xl
            bg-black/50
            backdrop-blur-xl
            text-white
            flex
            items-center
            justify-center
          "
        >

          <FiX size={22} />

        </button>

        {/* BANNER */}

        <div className="relative h-[180px] sm:h-[220px] w-full">

          {editing ? (

            <input
              value={form.banner}
              onChange={(e) =>
                updateField(
                  "banner",
                  e.target.value
                )
              }
              placeholder="Banner image URL"
              className="
                absolute
                bottom-4
                left-4
                right-4
                z-30
                h-11
                px-4
                rounded-2xl
                bg-black/60
                text-white
                outline-none
                border
                border-white/10
              "
            />

          ) : null}

          {form.banner ? (

            <img
              src={form.banner}
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
                via-cyan-500
                to-indigo-600
              "
            />

          )}

          <div className="absolute inset-0 bg-black/30" />

        </div>

        {/* PROFILE CONTENT */}

        <div className="relative px-4 sm:px-6 pb-6">

          {/* AVATAR + NAME */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-end
              gap-4
              -mt-16
              relative
              z-20
            "
          >

            <div className="relative shrink-0">

              {form.avatar ? (

                <img
                  src={form.avatar}
                  className="
                    w-32
                    h-32
                    rounded-full
                    object-cover
                    border-[5px]
                    border-[#1e1f22]
                    bg-[#2b2d31]
                  "
                />

              ) : (

                <div
                  className="
                    w-32
                    h-32
                    rounded-full
                    bg-blue-600
                    border-[5px]
                    border-[#1e1f22]
                    flex
                    items-center
                    justify-center
                    text-5xl
                    font-black
                    text-white
                  "
                >

                  {form.username
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

              )}

              {editing && (

                <input
                  value={form.avatar}
                  onChange={(e) =>
                    updateField(
                      "avatar",
                      e.target.value
                    )
                  }
                  placeholder="Avatar URL"
                  className="
                    mt-3
                    w-full
                    h-10
                    px-3
                    rounded-xl
                    bg-[#2b2d31]
                    text-white
                    text-sm
                    outline-none
                  "
                />

              )}

            </div>

            <div className="flex-1 min-w-0 pb-2">

              {editing ? (

                <input
                  value={form.username}
                  onChange={(e) =>
                    updateField(
                      "username",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-2xl
                    bg-[#2b2d31]
                    text-white
                    text-2xl
                    font-black
                    outline-none
                  "
                />

              ) : (

                <div className="text-3xl font-black text-white break-words">

                  {form.username}

                </div>

              )}

              <div className="text-sm opacity-60 text-white mt-1 break-all">

                ID: {user.userId}

              </div>

              <div className="mt-3 text-sm text-white/80">

                {user?.friends?.length || 0}
                {" "}
                Friends

              </div>

            </div>

          </div>

          {/* BIO */}

          <div className="mt-6">

            <div className="text-white font-bold mb-2">
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
                  min-h-[110px]
                  rounded-2xl
                  bg-[#2b2d31]
                  text-white
                  p-4
                  outline-none
                  resize-none
                "
              />

            ) : (

              <div
                className="
                  rounded-2xl
                  bg-[#2b2d31]
                  p-4
                  text-white/90
                  whitespace-pre-wrap
                  break-words
                "
              >

                {form.bio ||
                  "No bio yet."}

              </div>

            )}

          </div>

          {/* EDIT BUTTON BELOW BIO */}

          {isOwnProfile && !editing && (

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

          <div className="mt-6">

            <div className="text-white font-bold mb-3">
              Personal Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {[
                [
                  "Hometown",
                  "hometown",
                ],

                [
                  "Birthday",
                  "birthday",
                ],

                [
                  "Status",
                  "status",
                ],

                [
                  "Language",
                  "language",
                ],

                [
                  "Work",
                  "work",
                ],

                [
                  "Education",
                  "education",
                ],

                [
                  "Hobbies",
                  "hobbies",
                ],

              ].map(
                ([
                  label,
                  key,
                ]) => (

                  <div
                    key={key}
                    className="
                      rounded-2xl
                      bg-[#2b2d31]
                      p-4
                    "
                  >

                    <div className="text-xs uppercase opacity-50 text-white mb-1">

                      {label}

                    </div>

                    {editing ? (

                      <input
                        value={
                          form[key]
                        }

                        onChange={(e) =>
                          updateField(
                            key,
                            e.target.value
                          )
                        }

                        className="
                          w-full
                          h-10
                          px-3
                          rounded-xl
                          bg-[#1e1f22]
                          text-white
                          outline-none
                        "
                      />

                    ) : (

                      <div className="text-white break-words">

                        {form[key] ||
                          "Not set"}

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          </div>

          {/* SAVE BUTTON */}

          {editing && (

            <div className="mt-6 flex gap-3">

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
                onClick={
                  saveProfile
                }

                className="
                  flex-1
                  h-12
                  rounded-2xl
                  bg-blue-600
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
