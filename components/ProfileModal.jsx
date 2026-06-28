"use client";

import { useEffect, useState } from "react";

export default function ProfileModal({
  close,
  profileUser,
  currentUser,
}) {

  const [profile, setProfile] =
    useState(null);

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] =
    useState({

      avatar: "",
      banner: "",
      bio: "",

      hometown: "",
      birthday: "",
      status: "",
      language: "",
      work: "",
      education: "",
      hobbies: "",

    });

  const isOwnProfile =
    currentUser?.userId ===
    profileUser?.userId;

  // LOAD PROFILE
  useEffect(() => {

    if (!profileUser?.userId)
      return;

    const loadProfile =
      async () => {

        try {

          const res =
            await fetch(
              `/api/get-profile?userId=${profileUser.userId}`,
              {
                cache:
                  "no-store",
              }
            );

          const data =
            await res.json();

          if (
            data.success
          ) {

            setProfile(
              data.profile
            );

            setForm({

              avatar:
                data.profile.avatar || "",

              banner:
                data.profile.banner || "",

              bio:
                data.profile.bio || "",

              hometown:
                data.profile.hometown || "",

              birthday:
                data.profile.birthday || "",

              status:
                data.profile.status || "",

              language:
                data.profile.language || "",

              work:
                data.profile.work || "",

              education:
                data.profile.education || "",

              hobbies:
                data.profile.hobbies || "",

            });

          }

        } catch (err) {

          console.log(err);

        }

      };

    loadProfile();

  }, [profileUser]);

  // SAVE PROFILE
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

        if (
          !data.success
        ) {

          alert(
            data.message ||
            "Failed"
          );

          return;

        }

        setProfile({
          ...profile,
          ...form,
        });

        setEditing(
          false
        );

      } catch (err) {

        console.log(err);

      }

    };

  if (!profile)
    return null;

  return (

    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">

      <div
        className="
          relative
          w-full
          max-w-2xl
          rounded-3xl
          bg-[#1e1f22]
          border
          border-white/10
          overflow-hidden
          max-h-[95vh]
          overflow-y-auto
        "
      >

        {/* CLOSE BUTTON */}

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
            text-white
            flex
            items-center
            justify-center
            text-xl
            backdrop-blur-xl
          "
        >

          ✕

        </button>

        {/* BANNER */}

        <div className="relative w-full h-[180px] sm:h-[240px]">

          {profile.banner ? (

            <img
              src={
                profile.banner
              }
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <div className="
              absolute
              inset-0
              bg-gradient-to-r
              from-blue-600
              to-purple-600
            " />

          )}

        </div>

        {/* PROFILE CONTENT */}

        <div className="relative px-4 sm:px-6 pb-6">

          {/* AVATAR */}

          <div className="-mt-16 sm:-mt-20 flex flex-col items-center sm:items-start">

            {profile.avatar ? (

              <img
                src={
                  profile.avatar
                }
                className="
                  w-28
                  h-28
                  sm:w-36
                  sm:h-36
                  rounded-full
                  border-[6px]
                  border-[#1e1f22]
                  object-cover
                  bg-[#1e1f22]
                "
              />

            ) : (

              <div className="
                w-28
                h-28
                sm:w-36
                sm:h-36
                rounded-full
                border-[6px]
                border-[#1e1f22]
                bg-blue-600
                flex
                items-center
                justify-center
                text-5xl
                font-black
                text-white
              ">

                {profile.username
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

            )}

          </div>

          {/* USERNAME */}

          <div className="mt-4 text-center sm:text-left break-words">

            <div className="text-2xl sm:text-3xl font-black text-white break-all">

              {profile.username}

            </div>

            <div className="opacity-60 text-sm break-all">

              {profile.userId}

            </div>

          </div>

          {/* FRIENDS */}

          <div className="mt-4 text-sm opacity-80 text-center sm:text-left">

            {profile.friends?.length || 0}
            {" "}
            Friends

          </div>

          {/* BIO */}

          <div
            className="
              mt-5
              bg-white/5
              rounded-2xl
              p-4
              text-white/90
              whitespace-pre-wrap
              break-words
            "
          >

            {profile.bio ||
              "No bio yet"}

          </div>

          {/* EDIT PROFILE BUTTON */}

          {isOwnProfile && (

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

          {editing && (

            <div className="mt-5 space-y-3">

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
                  min-h-[120px]
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

                className="w-full h-12 rounded-2xl bg-[#2a2b30] px-4 text-white outline-none"
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

                className="w-full h-12 rounded-2xl bg-[#2a2b30] px-4 text-white outline-none"
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

                placeholder="Relationship Status"

                className="w-full h-12 rounded-2xl bg-[#2a2b30] px-4 text-white outline-none"
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

                className="w-full h-12 rounded-2xl bg-[#2a2b30] px-4 text-white outline-none"
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

                className="w-full h-12 rounded-2xl bg-[#2a2b30] px-4 text-white outline-none"
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

                className="w-full h-12 rounded-2xl bg-[#2a2b30] px-4 text-white outline-none"
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

                className="w-full h-12 rounded-2xl bg-[#2a2b30] px-4 text-white outline-none"
              />

              <button
                onClick={
                  saveProfile
                }

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

          {/* INFO */}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="opacity-50 text-sm">
                Hometown
              </div>
              <div>
                {profile.hometown || "-"}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="opacity-50 text-sm">
                Birthday
              </div>
              <div>
                {profile.birthday || "-"}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="opacity-50 text-sm">
                Status
              </div>
              <div>
                {profile.status || "-"}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="opacity-50 text-sm">
                Language
              </div>
              <div>
                {profile.language || "-"}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="opacity-50 text-sm">
                Work
              </div>
              <div>
                {profile.work || "-"}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="opacity-50 text-sm">
                Education
              </div>
              <div>
                {profile.education || "-"}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 sm:col-span-2">
              <div className="opacity-50 text-sm">
                Hobbies
              </div>
              <div>
                {profile.hobbies || "-"}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
