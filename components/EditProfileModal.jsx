"use client";

import { useState } from "react";

export default function EditProfileModal({
  profile,
  close,
  onSave,
}) {
  const [form, setForm] = useState({
    avatar: profile.avatar || "",
    banner: profile.banner || "",
    bio: profile.bio || "",
    hometown: profile.hometown || "",
    birthday: profile.birthday || "",
    status: profile.status || "",
    language: profile.language || "",
    gender: profile.gender || "",
    work: profile.work || [],
    education: profile.education || [],
    hobbies: profile.hobbies || [],
  });

  const [saving, setSaving] = useState(false);

  /* =========================
     IMAGE UPLOAD (BASE64)
  ========================= */
  const handleImage = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        [field]: reader.result, // base64 image
      }));
    };

    reader.readAsDataURL(file);
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const save = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.userId,
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to save");
        return;
      }

      // send updated user back to parent (NO reload)
      if (onSave) onSave(data.user);

      close();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-[#1e1f22] rounded-3xl p-5 overflow-y-auto max-h-[90vh]">

        {/* CLOSE */}
        <div className="flex justify-between items-center mb-4">

          <h1 className="text-white text-xl font-bold">
            Edit Profile
          </h1>

          <button
            onClick={close}
            className="text-white text-2xl"
          >
            ✕
          </button>

        </div>

        {/* =========================
            AVATAR UPLOAD
        ========================= */}
        <div className="mb-4">

          <label className="text-white text-sm">
            Avatar
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e, "avatar")}
            className="w-full text-white mt-1"
          />

          {form.avatar && (
            <img
              src={form.avatar}
              className="w-20 h-20 rounded-full mt-2 object-cover"
            />
          )}
        </div>

        {/* =========================
            BANNER UPLOAD
        ========================= */}
        <div className="mb-4">

          <label className="text-white text-sm">
            Banner
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e, "banner")}
            className="w-full text-white mt-1"
          />

          {form.banner && (
            <img
              src={form.banner}
              className="w-full h-24 mt-2 object-cover rounded-xl"
            />
          )}
        </div>

        {/* =========================
            BIO
        ========================= */}
        <textarea
          value={form.bio}
          onChange={(e) =>
            setForm({ ...form, bio: e.target.value })
          }
          placeholder="Write your bio..."
          className="w-full h-24 p-3 rounded-xl bg-[#2a2b30] text-white mb-3"
        />

        {/* =========================
            STATUS
        ========================= */}
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
          className="w-full h-12 bg-[#2a2b30] text-white rounded-xl mb-3"
        >
          <option value="">Select Status</option>
          <option>Single</option>
          <option>In a relationship</option>
          <option>Engaged</option>
          <option>Married</option>
          <option>It's complicated</option>
        </select>

        {/* =========================
            GENDER
        ========================= */}
        <select
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value })
          }
          className="w-full h-12 bg-[#2a2b30] text-white rounded-xl mb-3"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        {/* =========================
            HOMETOWN
        ========================= */}
        <input
          value={form.hometown}
          onChange={(e) =>
            setForm({ ...form, hometown: e.target.value })
          }
          placeholder="Hometown"
          className="w-full h-12 bg-[#2a2b30] text-white rounded-xl mb-3 px-3"
        />

        {/* =========================
            BIRTHDAY
        ========================= */}
        <input
          value={form.birthday}
          onChange={(e) =>
            setForm({ ...form, birthday: e.target.value })
          }
          placeholder="Birthday"
          className="w-full h-12 bg-[#2a2b30] text-white rounded-xl mb-3 px-3"
        />

        {/* =========================
            LANGUAGE
        ========================= */}
        <input
          value={form.language}
          onChange={(e) =>
            setForm({ ...form, language: e.target.value })
          }
          placeholder="Language"
          className="w-full h-12 bg-[#2a2b30] text-white rounded-xl mb-3 px-3"
        />

        {/* =========================
            SAVE BUTTON
        ========================= */}
        <button
          onClick={save}
          disabled={saving}
          className="w-full h-12 bg-blue-600 text-white font-bold rounded-xl"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
  }
