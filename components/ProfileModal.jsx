"use client";

import { useState } from "react";

export default function ProfileModal({
  close,
  profile,
  currentUser,
}) {

  const safeProfile = {
    username:
      profile?.username ||
      currentUser?.username ||
      "Unknown User",

    userId:
      profile?.userId ||
      currentUser?.userId ||
      "Unknown ID",

    avatar:
      profile?.avatar ||
      currentUser?.avatar ||
      "",

    banner: profile?.banner || "",
    bio: profile?.bio || "",
    hometown: profile?.hometown || "",
    birthday: profile?.birthday || "",
    status: profile?.status || "",
    language: profile?.language || "",
    work: profile?.work || [],
    education: profile?.education || [],
    hobbies: profile?.hobbies || [],
    gender: profile?.gender || "",
    friends: profile?.friends || [],
  };

  const isOwner =
    currentUser?.userId ===
    safeProfile?.userId;

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [editingField, setEditingField] =
    useState(null);

  const [form, setForm] = useState({
    avatar: safeProfile.avatar,
    banner: safeProfile.banner,
    bio: safeProfile.bio,
    hometown: safeProfile.hometown,
    birthday: safeProfile.birthday,
    status: safeProfile.status,
    language: safeProfile.language,
    work: safeProfile.work,
    education: safeProfile.education,
    hobbies: safeProfile.hobbies,
    gender: safeProfile.gender,
  });

  /* =========================
     IMAGE UPLOAD
  ========================= */

  const handleImageUpload = (
    file,
    field
  ) => {

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setForm((prev) => ({
        ...prev,
        [field]:
          reader.result,
      }));

    };

    if (file) {
      reader.readAsDataURL(file);
    }

  };

  /* =========================
     SAVE PROFILE
  ========================= */

  const saveProfile = async (
    e
  ) => {

    if (e)
      e.preventDefault();

    try {

      const payload = {

        userId:
          currentUser?.userId ||
          "",

        avatar:
          form.avatar || "",

        banner:
          form.banner || "",

        bio:
          form.bio || "",

        hometown:
          form.hometown || "",

        birthday:
          form.birthday || "",

        status:
          form.status || "",

        language:
          form.language || "",

        gender:
          form.gender || "",

        work:
          Array.isArray(
            form.work
          )
            ? form.work
            : [],

        education:
          Array.isArray(
            form.education
          )
            ? form.education
            : [],

        hobbies:
          Array.isArray(
            form.hobbies
          )
            ? form.hobbies
            : [],
      };

      console.log(
        "SENDING:",
        payload
      );

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
              JSON.stringify(
                payload
              ),
          }
        );

      const data =
        await res.json();

      console.log(
        "SERVER RESPONSE:",
        data
      );

      if (!data.success) {

        alert(
          data.message ||
          "Failed to update"
        );

        return;

      }

      alert(
        "Profile updated!"
      );

      setEditingField(
        null
      );

      setMenuOpen(false);

    } catch (err) {

      console.log(
        "SAVE ERROR:",
        err
      );

      alert(
        "Server error"
      );

    }

  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">

      <div className="relative w-full max-w-[760px] max-h-[95vh] overflow-y-auto rounded-[28px] bg-[#1e1f22] border border-white/10 shadow-2xl">

        {/* CLOSE */}
        <button
          onClick={close}
          className="fixed top-3 right-3 z-[999999] w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center text-xl"
        >
          ✕
        </button>

        {/* BANNER */}
        <div className="relative h-[190px] sm:h-[260px] overflow-hidden">

          {form.banner ? (
            <img
              src={form.banner}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}

          {isOwner && (
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) =>
                handleImageUpload(
                  e.target.files[0],
                  "banner"
                )
              }
            />
          )}

        </div>

        {/* CONTENT */}
        <div className="relative px-4 sm:px-7 pb-8">

          {/* AVATAR */}
          <div className="relative -mt-16 flex gap-4 items-end">

            <div className="relative">

              {form.avatar ? (
                <img
                  src={form.avatar}
                  className="w-[115px] h-[115px] sm:w-[140px] sm:h-[140px] rounded-full object-cover border-[5px] border-[#1e1f22]"
                />
              ) : (
                <div className="w-[115px] h-[115px] sm:w-[140px] sm:h-[140px] rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-black border-[5px] border-[#1e1f22]">

                  {safeProfile.username
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>
              )}

              {isOwner && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                  onChange={(e) =>
                    handleImageUpload(
                      e.target.files[0],
                      "avatar"
                    )
                  }
                />
              )}

            </div>

            {/* NAME */}
            <div className="pb-2">

              <div className="text-3xl font-black text-white">

                {safeProfile.username}

              </div>

              <div className="text-white/60 text-sm">

                {safeProfile.userId}

              </div>

            </div>

          </div>

          {/* BIO */}
          <div className="mt-6">

            <div className="text-white font-bold mb-2">

              Bio

            </div>

            <textarea
              className="w-full min-h-[120px] bg-[#2a2b30] text-white p-3 rounded-xl"
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio:
                    e.target.value,
                })
              }
            />

          </div>

          {/* SAVE */}
          <button
            type="button"
            onClick={(e) =>
              saveProfile(e)
            }
            className="mt-5 w-full h-12 bg-blue-600 text-white rounded-xl font-bold"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}
