"use client";

import { useEffect, useState } from "react";

export default function ProfileModal({
  close,
  currentUser,
  profileUser,
}) {

  const isOwner =
    currentUser.userId ===
    profileUser.userId;

  const [edit, setEdit] =
    useState(false);

  const [profile, setProfile] =
    useState(profileUser);

  const saveProfile =
    async () => {

      const res =
        await fetch(
          "/api/update-profile",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(profile),
          }
        );

      const data =
        await res.json();

      if (data.success) {

        alert("Profile updated");

        setEdit(false);

      }

    };

  return (

    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

      <div className="w-full max-w-3xl rounded-3xl overflow-hidden bg-[#1e1f22] text-white border border-white/10">

        {/* BANNER */}

        <div className="relative h-[220px] bg-[#2a2d31]">

          {profile.banner && (

            <img
              src={profile.banner}
              className="w-full h-full object-cover"
            />

          )}

        </div>

        {/* CONTENT */}

        <div className="p-6">

          <div className="flex gap-5 items-start">

            {/* AVATAR */}

            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-[#1e1f22] -mt-[80px] bg-[#2a2d31]">

              {profile.avatar && (

                <img
                  src={profile.avatar}
                  className="w-full h-full object-cover"
                />

              )}

            </div>

            {/* USER */}

            <div className="flex-1">

              <div className="text-3xl font-black">
                {profile.username}
              </div>

              <div className="opacity-60">
                {profile.userId}
              </div>

              <div className="mt-3 text-sm opacity-70">
                Friends: {profile.friends?.length || 0}
              </div>

            </div>

          </div>

          {/* BIO */}

          <div className="mt-6">

            <div className="font-bold mb-2">
              Bio
            </div>

            {edit ? (

              <textarea
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bio: e.target.value,
                  })
                }
                className="w-full h-[100px] rounded-2xl bg-[#2a2d31] p-4 outline-none"
              />

            ) : (

              <div className="opacity-80">
                {profile.bio || "No bio"}
              </div>

            )}

          </div>

          {/* DETAILS */}

          <div className="grid md:grid-cols-2 gap-4 mt-6">

            {[
              "hometown",
              "birthday",
              "status",
              "language",
              "work",
              "education",
              "hobbies",
            ].map((field) => (

              <div
                key={field}
                className="bg-[#2a2d31] rounded-2xl p-4"
              >

                <div className="text-xs uppercase opacity-50 mb-1">
                  {field}
                </div>

                {edit ? (

                  <input
                    value={profile[field] || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        [field]:
                          e.target.value,
                      })
                    }
                    className="w-full bg-transparent outline-none"
                  />

                ) : (

                  <div>
                    {profile[field] || "-"}
                  </div>

                )}

              </div>

            ))}

          </div>

          {/* EDIT */}

          {isOwner && (

            <div className="mt-6 flex gap-3">

              {!edit ? (

                <button
                  onClick={() =>
                    setEdit(true)
                  }
                  className="px-6 h-12 rounded-2xl bg-blue-600 font-bold"
                >

                  Edit Profile

                </button>

              ) : (

                <button
                  onClick={saveProfile}
                  className="px-6 h-12 rounded-2xl bg-green-600 font-bold"
                >

                  Save Profile

                </button>

              )}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
