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

  const [openEdit, setOpenEdit] =
    useState(false);

  const isOwnProfile =
    userId === currentUserId;

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

      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center">

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

      <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">

        <div
          className="
            relative
            w-full
            max-w-2xl
            rounded-3xl
            overflow-hidden
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
              text-xl
            "
          >

            ✕

          </button>

          {/* BANNER */}

          <div className="relative h-[180px] sm:h-[220px] w-full">

            {profile.banner ? (

              <img
                src={profile.banner}
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500" />

            )}

          </div>

          {/* CONTENT */}

          <div className="relative px-4 sm:px-6 pb-6">

            {/* AVATAR */}

            <div className="-mt-[60px] sm:-mt-[70px] flex flex-col sm:flex-row sm:items-end gap-4">

              {profile.avatar ? (

                <img
                  src={profile.avatar}
                  className="
                    w-[110px]
                    h-[110px]
                    sm:w-[130px]
                    sm:h-[130px]
                    rounded-full
                    border-4
                    border-[#1e1f22]
                    object-cover
                    bg-[#2a2b30]
                    shrink-0
                  "
                />

              ) : (

                <div
                  className="
                    w-[110px]
                    h-[110px]
                    sm:w-[130px]
                    sm:h-[130px]
                    rounded-full
                    border-4
                    border-[#1e1f22]
                    bg-blue-600
                    flex
                    items-center
                    justify-center
                    text-white
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

              <div className="min-w-0 flex-1 pb-2">

                <div
                  className="
                    text-2xl
                    sm:text-3xl
                    font-black
                    text-white
                    break-words
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

            {/* FRIEND COUNT */}

            <div className="mt-5 text-white">

              <span className="font-bold">
                {profile.friends?.length || 0}
              </span>{" "}
              Friends

            </div>

            {/* BIO */}

            <div className="mt-4">

              <div className="text-white font-bold mb-2">
                Bio
              </div>

              <div className="text-white/70 whitespace-pre-wrap break-words">

                {profile.bio ||
                  "No bio yet"}

              </div>

            </div>

            {/* EDIT PROFILE BUTTON */}

            {isOwnProfile && (

              <button
                onClick={() =>
                  setOpenEdit(true)
                }
                className="
                  mt-5
                  w-full
                  sm:w-auto
                  px-5
                  h-11
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

      {/* EDIT MODAL */}

      {openEdit && (

        <EditProfileModal
          profile={profile}
          close={() =>
            setOpenEdit(false)
          }
          refreshProfile={() =>
            window.location.reload()
          }
        />

      )}

    </>

  );

}

function ProfileItem({
  label,
  value,
}) {

  return (

    <div className="bg-white/5 rounded-2xl p-4">

      <div className="text-white/50 text-sm">

        {label}

      </div>

      <div className="text-white break-words">

        {value || "Not set"}

      </div>

    </div>

  );

}
