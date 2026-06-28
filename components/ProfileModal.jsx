"use client";

import { useState } from "react";

export default function ProfileModal({
  close,
  profile,
  currentUser,
}) {

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] =
    useState({

      avatar:
        profile?.avatar || "",

      banner:
        profile?.banner || "",

      bio:
        profile?.bio || "",

      hometown:
        profile?.hometown || "",

      birthday:
        profile?.birthday || "",

      status:
        profile?.status || "",

      language:
        profile?.language || "",

      work:
        profile?.work || "",

      education:
        profile?.education || "",

      hobbies:
        profile?.hobbies || "",

    });

  const isOwner =
    currentUser?.userId ===
    profile?.userId;

  // =========================
  // SAVE PROFILE
  // =========================
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
            "Failed to update profile"
          );

          return;

        }

        alert(
          "Profile updated"
        );

        window.location.reload();

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">

      {/* MODAL */}

      <div
        className="
          relative
          w-full
          max-w-[700px]
          h-auto
          max-h-[95vh]
          overflow-y-auto
          rounded-3xl
          bg-[#1e1f22]
          border
          border-white/10
          shadow-2xl
        "
      >

        {/* CLOSE BUTTON */}

        <button
          onClick={close}
          className="
            fixed
            top-3
            right-3
            z-[999999]
            w-11
            h-11
            rounded-full
            bg-black/70
            text-white
            text-xl
            flex
            items-center
            justify-center
          "
        >

          ✕

        </button>

        {/* BANNER */}

        <div className="relative w-full h-[170px] sm:h-[220px]">

          {profile?.banner ? (

            <img
              src={profile.banner}
              alt="banner"
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
              bg-gradient-to-r
              from-blue-600
              to-purple-600
            " />

          )}

          {/* DARK OVERLAY */}

          <div className="
            absolute
            inset-0
            bg-black/30
          " />

        </div>

        {/* CONTENT */}

        <div className="relative px-4 sm:px-6 pb-6">

          {/* AVATAR */}

          <div className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            gap-4
            -mt-16
            relative
            z-20
          ">

            {profile?.avatar ? (

              <img
                src={profile.avatar}
                alt="avatar"
                className="
                  w-[110px]
                  h-[110px]
                  sm:w-[130px]
                  sm:h-[130px]
                  rounded-full
                  border-4
                  border-[#1e1f22]
                  object-cover
                  bg-[#1e1f22]
                  shrink-0
                "
              />

            ) : (

              <div className="
                w-[110px]
                h-[110px]
                sm:w-[130px]
                sm:h-[130px]
                rounded-full
                border-4
                border-[#1e1f22]
                bg-blue-600
                text-white
                text-5xl
                font-black
                flex
                items-center
                justify-center
                shrink-0
              ">

                {profile?.username
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

            )}

            {/* USER INFO */}

            <div className="
              min-w-0
              flex-1
              pb-2
            ">

              <div className="
                text-[24px]
                sm:text-[32px]
                font-black
                text-white
                break-words
                leading-tight
              ">

                {profile?.username}

              </div>

              <div className="
                text-sm
                opacity-70
                break-all
                text-white
              ">

                ID:
                {" "}
                {profile?.userId}

              </div>

              <div className="
                mt-2
                text-sm
                text-blue-400
                font-semibold
              ">

                {profile?.friends?.length || 0}
                {" "}
                Friends

              </div>

            </div>

          </div>

          {/* BIO */}

          <div className="mt-6">

            <div className="
              text-lg
              font-bold
              text-white
              mb-2
            ">

              Bio

            </div>

            <div className="
              bg-white/5
              rounded-2xl
              p-4
              text-sm
              text-white/80
              break-words
            ">

              {profile?.bio ||
                "No bio yet"}

            </div>

          </div>

          {/* EDIT PROFILE BUTTON BELOW BIO */}

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
                text-white
                font-bold
                transition
              "
            >

              {editing
                ? "Close Editor"
                : "Edit Profile"}

            </button>

          )}

          {/* EDIT FORM */}

          {editing && isOwner && (

            <div className="
              mt-5
              bg-white/5
              rounded-3xl
              p-4
              space-y-4
            ">

              <input
                value={form.avatar}
                onChange={(e) =>
                  setForm({
                    ...form,
                    avatar:
                      e.target.value,
                  })
                }
                placeholder="Avatar URL"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <input
                value={form.banner}
                onChange={(e) =>
                  setForm({
                    ...form,
                    banner:
                      e.target.value,
                  })
                }
                placeholder="Banner URL"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bio:
                      e.target.value,
                  })
                }
                placeholder="Bio"
                className="
                  w-full
                  min-h-[100px]
                  rounded-2xl
                  bg-[#2a2b30]
                  p-4
                  text-white
                  outline-none
                  resize-none
                "
              />

              <input
                value={form.hometown}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hometown:
                      e.target.value,
                  })
                }
                placeholder="Hometown"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <input
                value={form.birthday}
                onChange={(e) =>
                  setForm({
                    ...form,
                    birthday:
                      e.target.value,
                  })
                }
                placeholder="Birthday"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <input
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value,
                  })
                }
                placeholder="Status"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <input
                value={form.language}
                onChange={(e) =>
                  setForm({
                    ...form,
                    language:
                      e.target.value,
                  })
                }
                placeholder="Language"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <input
                value={form.work}
                onChange={(e) =>
                  setForm({
                    ...form,
                    work:
                      e.target.value,
                  })
                }
                placeholder="Work"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <input
                value={form.education}
                onChange={(e) =>
                  setForm({
                    ...form,
                    education:
                      e.target.value,
                  })
                }
                placeholder="Education"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <input
                value={form.hobbies}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hobbies:
                      e.target.value,
                  })
                }
                placeholder="Hobbies"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                  outline-none
                "
              />

              <button
                onClick={saveProfile}
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-green-600
                  text-white
                  font-bold
                "
              >

                Save Profile

              </button>

            </div>

          )}

          {/* DETAILS */}

          <div className="mt-6">

            <div className="
              text-lg
              font-bold
              text-white
              mb-3
            ">

              Personal Information

            </div>

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            ">

              <Info
                label="Hometown"
                value={profile?.hometown}
              />

              <Info
                label="Birthday"
                value={profile?.birthday}
              />

              <Info
                label="Status"
                value={profile?.status}
              />

              <Info
                label="Language"
                value={profile?.language}
              />

              <Info
                label="Work"
                value={profile?.work}
              />

              <Info
                label="Education"
                value={profile?.education}
              />

              <Info
                label="Hobbies"
                value={profile?.hobbies}
              />

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

// =========================
// INFO CARD
// =========================

function Info({
  label,
  value,
}) {

  return (

    <div className="
      bg-white/5
      rounded-2xl
      p-4
    ">

      <div className="
        text-xs
        uppercase
        opacity-50
        mb-1
        text-white
      ">

        {label}

      </div>

      <div className="
        text-sm
        break-words
        text-white
      ">

        {value || "Not set"}

      </div>

    </div>

  );

}
