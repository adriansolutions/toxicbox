"use client";

import { useEffect, useState } from "react";

import EditProfileModal from "./EditProfileModal";

export default function ProfileModal({
  close,
  userId,
  currentUserId,
}) {

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editOpen, setEditOpen] =
    useState(false);

  const isOwnProfile =
    userId === currentUserId;

  // LOAD PROFILE
  useEffect(() => {

    const loadProfile =
      async () => {

        try {

          const res =
            await fetch(
              `/api/get-profile?userId=${userId}`,
              {
                cache: "no-store",
              }
            );

          const data =
            await res.json();

          if (data.success) {

            setProfile(
              data.user
            );

          }

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);

        }

      };

    loadProfile();

  }, [userId]);

  if (loading) {

    return (

      <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">

        <div className="text-white text-lg">
          Loading...
        </div>

      </div>

    );

  }

  if (!profile)
    return null;

  return (

    <>

      {/* MODAL */}
      <div
        className="
          fixed inset-0 z-[99999]
          bg-black/70 backdrop-blur-sm
          flex items-center justify-center
          p-2 sm:p-4
          overflow-y-auto
        "
      >

        <div
          className="
            relative
            w-full
            max-w-[850px]
            rounded-3xl
            overflow-hidden
            bg-[#1e1f22]
            border border-white/10
            shadow-2xl
          "
        >

          {/* CLOSE BUTTON */}
          <button
            onClick={close}
            className="
              absolute
              top-3 right-3
              z-50
              w-10 h-10
              rounded-full
              bg-black/70
              text-white
              flex items-center justify-center
              text-xl
            "
          >

            ✕

          </button>

          {/* BANNER */}
          <div
            className="
              relative
              w-full
              h-[160px]
              sm:h-[240px]
            "
          >

            {profile.banner ? (

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
          <div className="px-4 sm:px-6 pb-6">

            {/* AVATAR + USER */}
            <div
              className="
                relative
                flex
                flex-col
                sm:flex-row
                sm:items-end
                gap-4
                -mt-16
                sm:-mt-20
              "
            >

              {/* AVATAR */}
              {profile.avatar ? (

                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="
                    w-28 h-28
                    sm:w-36 sm:h-36
                    rounded-full
                    border-4 border-[#1e1f22]
                    object-cover
                    bg-[#2a2b30]
                    shrink-0
                  "
                />

              ) : (

                <div
                  className="
                    w-28 h-28
                    sm:w-36 sm:h-36
                    rounded-full
                    border-4 border-[#1e1f22]
                    bg-blue-600
                    text-white
                    flex items-center justify-center
                    text-4xl
                    font-black
                    shrink-0
                  "
                >

                  {profile.username
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

              )}

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
                    text-2xl
                    sm:text-4xl
                    font-black
                    text-white
                    break-words
                    leading-tight
                  "
                >

                  {profile.username}

                </div>

                <div
                  className="
                    text-sm
                    text-white/60
                    break-all
                  "
                >

                  {profile.userId}

                </div>

              </div>

            </div>

            {/* FRIENDS */}
            <div className="mt-5 text-white/70 text-sm">

              {profile.friends?.length || 0}
              {" "}
              Friends

            </div>

            {/* BIO */}
            <div className="mt-4">

              <div className="text-white font-bold mb-2">

                Bio

              </div>

              <div
                className="
                  text-white/80
                  whitespace-pre-wrap
                  break-words
                "
              >

                {profile.bio ||
                  "No bio yet"}

              </div>

            </div>

            {/* EDIT PROFILE BUTTON */}
            {isOwnProfile && (

              <button
                onClick={() =>
                  setEditOpen(true)
                }
                className="
                  mt-4
                  w-full
                  sm:w-auto
                  h-11
                  px-5
                  rounded-2xl
                  bg-blue-600
                  text-white
                  font-bold
                "
              >

                Edit Profile

              </button>

            )}

            {/* DETAILS */}
            <div className="mt-6 space-y-3">

              <ProfileItem
                label="Hometown"
                value={profile.hometown}
              />

              <ProfileItem
                label="Birthday"
                value={profile.birthday}
              />

              <ProfileItem
                label="Status"
                value={profile.status}
              />

              <ProfileItem
                label="Language"
                value={profile.language}
              />

              <ProfileItem
                label="Work"
                value={profile.work}
              />

              <ProfileItem
                label="Education"
                value={profile.education}
              />

              <ProfileItem
                label="Hobbies"
                value={profile.hobbies}
              />

            </div>

          </div>

        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {editOpen && (

        <EditProfileModal
          profile={profile}
          close={() =>
            setEditOpen(false)
          }
          refreshProfile={() =>
            window.location.reload()
          }
        />

      )}

    </>

  );

}

// PROFILE ITEM
function ProfileItem({
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

      <div className="text-white/50 text-sm">

        {label}

      </div>

      <div
        className="
          text-white
          break-words
        "
      >

        {value || "Not set"}

      </div>

    </div>

  );

}
