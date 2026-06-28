"use client";

import { useState } from "react";

export default function ProfileModal({
  close,
  profile,
  currentUser,
}) {

  const safeProfile = {
    username: profile?.username || currentUser?.username || "Unknown User",
    userId: profile?.userId || currentUser?.userId || "Unknown ID",
    avatar: profile?.avatar || "",
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

  const isOwner = currentUser?.userId === safeProfile?.userId;

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

  // =========================
  // IMAGE CONVERTER (NO CLOUDINARY)
  // =========================
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleImage = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);

    setForm((prev) => ({
      ...prev,
      [field]: base64,
    }));
  };

  // =========================
  // SAVE
  // =========================
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

      window.location.reload();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/70 flex items-center justify-center p-3">

      <div className="relative w-full max-w-2xl bg-[#1e1f22] rounded-3xl overflow-hidden border border-white/10">

        {/* CLOSE */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-50 w-10 h-10 bg-black/70 text-white rounded-full"
        >
          ✕
        </button>

        {/* MENU */}
        {isOwner && (
          <div className="absolute top-4 left-4 z-50">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-black/60 text-white rounded-full"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="mt-2 bg-[#2a2b30] rounded-xl overflow-hidden">

                {/* AVATAR UPLOAD */}
                <label className="block px-4 py-3 text-white cursor-pointer hover:bg-white/10">
                  Upload Avatar
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImage(e, "avatar")}
                  />
                </label>

                {/* BANNER UPLOAD */}
                <label className="block px-4 py-3 text-white cursor-pointer hover:bg-white/10">
                  Upload Banner
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImage(e, "banner")}
                  />
                </label>

              </div>
            )}

          </div>
        )}

        {/* BANNER */}
        <div className="h-[220px]">
          {form.banner ? (
            <img src={form.banner} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
        </div>

        {/* AVATAR */}
        <div className="-mt-16 px-6">
          {form.avatar ? (
            <img
              src={form.avatar}
              className="w-32 h-32 rounded-full border-4 border-[#1e1f22]"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
              {safeProfile.username.charAt(0)}
            </div>
          )}

          <div className="text-white text-2xl font-bold mt-2">
            {safeProfile.username}
          </div>

          <div className="text-white/60">{safeProfile.userId}</div>
        </div>

        {/* BIO */}
        <div className="p-6">
          <textarea
            value={form.bio}
            onChange={(e) =>
              setForm({ ...form, bio: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-[#2a2b30] text-white"
            placeholder="Write bio..."
          />

          <button
            onClick={saveProfile}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
}
