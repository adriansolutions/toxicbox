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

    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 sm:p-6">

      {/* MODAL */}

      <div
        className="
          relative
          w-full
          max-w-[720px]
          rounded-[28px]
          overflow-hidden
          bg-[#1e1f22]
          border
          border-white/10
          shadow-2xl
          mt-2
          mb-10
        "
      >

        {/* CLOSE BUTTON */}

        <button
          onClick={close}
          className="
            absolute
            top-3
            right-3
            z-50
            w-11
            h-11
            rounded-full
            bg-black/70
            hover:bg-black
            text-white
            text-xl
            flex
            items-center
            justify-center
            border
            border-white/10
          "
        >

          ✕

        </button>

        {/* BANNER */}

        <div className="relative h-[170px] sm:h-[240px] w-full overflow-hidden">

          {profile?.banner ? (

            <img
              src={profile.banner}
              alt="banner"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-blue-600
                via-cyan-500
                to-purple-600
              "
            />

          )}

          {/* DARK OVERLAY */}

          <div className="absolute inset-0 bg-black/30" />

        </div>

        {/* MAIN CONTENT */}

        <div className="relative px-4 sm:px-7 pb-7">

          {/* PROFILE SECTION */}

          <div
            className="
              relative
              z-30
              flex
              flex-col
              sm:flex-row
              sm:items-end
              gap-4
              -mt-[58px]
              sm:-mt-[70px]
            "
          >

            {/* AVATAR */}

            <div className="shrink-0">

              {profile?.avatar ? (

                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="
                    w-[115px]
                    h-[115px]
                    sm:w-[145px]
                    sm:h-[145px]
                    rounded-full
                    border-4
                    border-[#1e1f22]
                    object-cover
                    bg-[#1e1f22]
                  "
                />

              ) : (

                <div
                  className="
                    w-[115px]
                    h-[115px]
                    sm:w-[145px]
                    sm:h-[145px]
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
                  "
                >

                  {profile?.username
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

              )}

            </div>

            {/* USER INFO */}

            <div
              className="
                min-w-0
                flex-1
                pb-2
              "
            >

              <div
                className="
                  text-[26px]
                  sm:text-[36px]
                  font-black
                  text-white
                  break-words
                  leading-tight
                "
              >

                {profile?.username}

              </div>

              <div
                className="
                  text-sm
                  text-white/60
                  break-all
                  mt-1
                "
              >

                ID:
                {" "}
                {profile?.userId}

              </div>

              <div
                className="
                  mt-2
                  text-sm
                  text-cyan-400
                  font-semibold
                "
              >

                {profile?.friends?.length || 0}
                {" "}
                Friends

              </div>

            </div>

          </div>

          {/* BIO */}

          <div className="mt-6">

            <div className="text-lg font-bold text-white mb-2">

              Bio

            </div>

            <div
              className="
                bg-white/5
                rounded-2xl
                p-4
                text-sm
                text-white/80
                break-words
              "
            >

              {profile?.bio ||
                "No bio yet"}

            </div>

          </div>

          {/* EDIT BUTTON BELOW BIO */}

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
              "
            >

              {editing
                ? "Close Editor"
                : "Edit Profile"}

            </button>

          )}

          {/* EDITOR */}

          {editing && isOwner && (

            <div
              className="
                mt-5
                bg-white/5
                rounded-3xl
                p-4
                space-y-4
              "
            >

              <Input
                value={form.avatar}
                onChange={(v) =>
                  setForm({
                    ...form,
                    avatar: v,
                  })
                }
                placeholder="Avatar URL"
              />

              <Input
                value={form.banner}
                onChange={(v) =>
                  setForm({
                    ...form,
                    banner: v,
                  })
                }
                placeholder="Banner URL"
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
                  min-h-[110px]
                  rounded-2xl
                  bg-[#2a2b30]
                  p-4
                  text-white
                  outline-none
                  resize-none
                "
              />

              <Input
                value={form.hometown}
                onChange={(v) =>
                  setForm({
                    ...form,
                    hometown: v,
                  })
                }
                placeholder="Hometown"
              />

              <Input
                value={form.birthday}
                onChange={(v) =>
                  setForm({
                    ...form,
                    birthday: v,
                  })
                }
                placeholder="Birthday"
              />

              <Input
                value={form.status}
                onChange={(v) =>
                  setForm({
                    ...form,
                    status: v,
                  })
                }
                placeholder="Status"
              />

              <Input
                value={form.language}
                onChange={(v) =>
                  setForm({
                    ...form,
                    language: v,
                  })
                }
                placeholder="Language"
              />

              <Input
                value={form.work}
                onChange={(v) =>
                  setForm({
                    ...form,
                    work: v,
                  })
                }
                placeholder="Work"
              />

              <Input
                value={form.education}
                onChange={(v) =>
                  setForm({
                    ...form,
                    education: v,
                  })
                }
                placeholder="Education"
              />

              <Input
                value={form.hobbies}
                onChange={(v) =>
                  setForm({
                    ...form,
                    hobbies: v,
                  })
                }
                placeholder="Hobbies"
              />

              <button
                onClick={saveProfile}
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-green-600
                  hover:bg-green-700
                  transition
                  text-white
                  font-bold
                "
              >

                Save Profile

              </button>

            </div>

          )}

          {/* PERSONAL INFO */}

          <div className="mt-7">

            <div className="text-lg font-bold text-white mb-3">

              Personal Information

            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
              "
            >

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
// INPUT
// =========================

function Input({
  value,
  onChange,
  placeholder,
}) {

  return (

    <input
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }
      placeholder={placeholder}
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

    <div
      className="
        bg-white/5
        rounded-2xl
        p-4
      "
    >

      <div
        className="
          text-xs
          uppercase
          opacity-50
          mb-1
          text-white
        "
      >

        {label}

      </div>

      <div
        className="
          text-sm
          break-words
          text-white
        "
      >

        {value || "Not set"}

      </div>

    </div>

  );

}
