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
    work: profile?.work || "",
    education: profile?.education || "",
    hobbies: profile?.hobbies || "",
    gender: profile?.gender || "",
    friends: profile?.friends || [],
  };

  const isOwner =
    currentUser?.userId === safeProfile?.userId;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

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
     IMAGE UPLOAD (NO CLOUDINARY)
  ========================= */
  const handleImageUpload = (file, field) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        [field]: reader.result, // base64
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  /* =========================
     SAVE PROFILE (NO RELOAD FIXED)
  ========================= */
  const saveProfile = async () => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to update");
        return;
      }

      // NO RELOAD (FIX)
      setEditingField(null);
      setMenuOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">

      {/* MODAL */}
      <div className="relative w-full max-w-[760px] max-h-[95vh] overflow-y-auto rounded-[28px] bg-[#1e1f22] border border-white/10 shadow-2xl">

        {/* CLOSE */}
        <button
          onClick={close}
          className="fixed top-3 right-3 z-[999999] w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center text-xl"
        >
          ✕
        </button>

        {/* MENU */}
        {isOwner && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-11 h-11 rounded-full bg-black/60 text-white text-2xl"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="mt-2 w-[180px] rounded-2xl bg-[#2a2b30] border border-white/10 overflow-hidden">

                <button
                  onClick={() => {
                    setEditingField("avatar");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 text-white"
                >
                  Change Avatar
                </button>

                <button
                  onClick={() => {
                    setEditingField("banner");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 text-white"
                >
                  Change Banner
                </button>

              </div>
            )}
          </div>
        )}

        {/* BANNER */}
        <div className="relative h-[190px] sm:h-[260px] overflow-hidden">
          {form.banner ? (
            <img src={form.banner} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}

          {/* UPLOAD INPUT */}
          {isOwner && (
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) =>
                handleImageUpload(e.target.files[0], "banner")
              }
            />
          )}

          <div className="absolute inset-0 bg-black/30" />
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
                  {safeProfile.username?.charAt(0)?.toUpperCase()}
                </div>
              )}

              {/* UPLOAD */}
              {isOwner && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                  onChange={(e) =>
                    handleImageUpload(e.target.files[0], "avatar")
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

          {/* FRIENDS */}
          <div className="mt-4 text-white">
            <b>{safeProfile.friends?.length || 0}</b> Friends
          </div>

          {/* BIO */}
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <div className="text-white font-bold">Bio</div>

              {isOwner && (
                <button
                  onClick={() => setEditingField("bio")}
                  className="text-white/60"
                >
                  ✎
                </button>
              )}
            </div>

            <div className="mt-2 text-white/70 bg-white/5 p-4 rounded-2xl">
              {form.bio || "No bio yet"}
            </div>
          </div>

          {/* DETAILS */}
          <div className="mt-6 space-y-3">

            <Info label="Gender" value={form.gender} edit={() => setEditingField("gender")} isOwner={isOwner} />
            <Info label="Hometown" value={form.hometown} edit={() => setEditingField("hometown")} isOwner={isOwner} />
            <Info label="Birthday" value={form.birthday} edit={() => setEditingField("birthday")} isOwner={isOwner} />
            <Info label="Status" value={form.status} edit={() => setEditingField("status")} isOwner={isOwner} />
            <Info label="Language" value={form.language} edit={() => setEditingField("language")} isOwner={isOwner} />
            <Info label="Work" value={form.work} edit={() => setEditingField("work")} isOwner={isOwner} />
            <Info label="Education" value={form.education} edit={() => setEditingField("education")} isOwner={isOwner} />
            <Info label="Hobbies" value={form.hobbies} edit={() => setEditingField("hobbies")} isOwner={isOwner} />

          </div>

        </div>
      </div>

      {/* EDIT MODAL */}
      {editingField && (
        <div className="fixed inset-0 z-[9999999] bg-black/80 flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-[#1e1f22] border border-white/10 rounded-3xl p-6">

            <div className="flex justify-between mb-5">
              <div className="text-white font-bold capitalize">
                Edit {editingField}
              </div>

              <button onClick={() => setEditingField(null)} className="text-white">
                ✕
              </button>
            </div>

            {editingField === "bio" ? (
              <textarea
                className="w-full min-h-[120px] bg-[#2a2b30] text-white p-3 rounded-xl"
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
              />
            ) : (
              <input
                className="w-full h-12 bg-[#2a2b30] text-white px-3 rounded-xl"
                value={form[editingField]}
                onChange={(e) =>
                  setForm({ ...form, [editingField]: e.target.value })
                }
              />
            )}

            <button
              onClick={saveProfile}
              className="mt-5 w-full h-12 bg-blue-600 text-white rounded-xl font-bold"
            >
              Save
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

/* INFO COMPONENT */
function Info({ label, value, edit, isOwner }) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl">
      <div className="flex justify-between">
        <div className="text-white/50 text-sm">{label}</div>
        {isOwner && (
          <button onClick={edit} className="text-white/60">✎</button>
        )}
      </div>
      <div className="text-white">{value || "Not set"}</div>
    </div>
  );
      }
