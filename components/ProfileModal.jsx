"use client";

import { useEffect, useState } from "react";

export default function ProfileModal({
  close,
  userId,
  currentUserId,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwnProfile = userId === currentUserId;

  const [form, setForm] = useState({
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
    gender: "",
  });

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/get-profile?userId=${userId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setProfile(data.profile);

          setForm({
            avatar: data.profile.avatar || "",
            banner: data.profile.banner || "",
            bio: data.profile.bio || "",
            hometown: data.profile.hometown || "",
            birthday: data.profile.birthday || "",
            status: data.profile.status || "",
            language: data.profile.language || "",
            work: data.profile.work || "",
            education: data.profile.education || "",
            hobbies: data.profile.hobbies || "",
            gender: data.profile.gender || "",
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // =========================
  // BASE64 IMAGE CONVERT
  // =========================
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  // =========================
  // IMAGE UPLOAD (NO CLOUDINARY)
  // =========================
  const uploadImage = async (file, type) => {
    const base64 = await convertToBase64(file);

    setForm((prev) => ({
      ...prev,
      [type]: base64,
    }));

    await saveField(type, base64);
  };

  // =========================
  // SAVE FIELD (REALTIME FIX)
  // =========================
  const saveField = async (field, value) => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          [field]: value,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Save failed");
        return;
      }

      // REALTIME UPDATE (NO REFRESH)
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // SAVE FULL FORM
  // =========================
  const saveProfile = async () => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to save");
        return;
      }

      setProfile((prev) => ({
        ...prev,
        ...form,
      }));

      setEditingField(null);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center p-3">

      {/* MODAL */}
      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-[#1e1f22] rounded-3xl border border-white/10">

        {/* CLOSE */}
        <button
          onClick={close}
          className="absolute top-3 right-3 w-10 h-10 bg-black/60 text-white rounded-full"
        >
          ✕
        </button>

        {/* MENU */}
        {isOwnProfile && (
          <div className="absolute top-4 left-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-black/60 text-white rounded-full"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="bg-[#2a2b30] mt-2 rounded-xl overflow-hidden">
                <button
                  onClick={() => {
                    setEditingField("avatar");
                    setMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-white hover:bg-white/10"
                >
                  Change Avatar
                </button>

                <button
                  onClick={() => {
                    setEditingField("banner");
                    setMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-white hover:bg-white/10"
                >
                  Change Banner
                </button>
              </div>
            )}
          </div>
        )}

        {/* BANNER */}
        <div className="h-[200px] relative">

          {form.banner ? (
            <img src={form.banner} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}

          {isOwnProfile && (
            <label className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 text-sm rounded cursor-pointer">
              Upload Banner
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  uploadImage(e.target.files[0], "banner")
                }
              />
            </label>
          )}
        </div>

        {/* AVATAR */}
        <div className="-mt-14 px-6 flex gap-4 items-end">

          <div className="relative">

            {form.avatar ? (
              <img
                src={form.avatar}
                className="w-28 h-28 rounded-full border-4 border-[#1e1f22] object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-[#1e1f22]">
                {profile.username?.charAt(0)}
              </div>
            )}

            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 rounded-full cursor-pointer">
                ✎
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    uploadImage(e.target.files[0], "avatar")
                  }
                />
              </label>
            )}

          </div>

          <div className="text-white">
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <p className="text-white/60">{profile.userId}</p>
          </div>

        </div>

        {/* BIO */}
        <div className="px-6 mt-5">
          <div className="flex justify-between">
            <h3 className="text-white font-bold">Bio</h3>
            <button onClick={() => setEditingField("bio")}>✎</button>
          </div>
          <p className="text-white/70 mt-2">{form.bio || "No bio yet"}</p>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-3 p-6 text-white">

          <Item label="Gender" value={form.gender} edit={() => setEditingField("gender")} />
          <Item label="Hometown" value={form.hometown} edit={() => setEditingField("hometown")} />
          <Item label="Birthday" value={form.birthday} edit={() => setEditingField("birthday")} />
          <Item label="Status" value={form.status} edit={() => setEditingField("status")} />
          <Item label="Language" value={form.language} edit={() => setEditingField("language")} />
          <Item label="Work" value={form.work} edit={() => setEditingField("work")} />
          <Item label="Education" value={form.education} edit={() => setEditingField("education")} />
          <Item label="Hobbies" value={form.hobbies} edit={() => setEditingField("hobbies")} />

        </div>

        {/* EDIT MODAL */}
        {editingField && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">

            <div className="bg-[#1e1f22] p-5 rounded-2xl w-80">

              <h3 className="text-white font-bold mb-3 capitalize">
                Edit {editingField}
              </h3>

              {editingField === "status" ? (
                <select
                  className="w-full h-10 bg-[#2a2b30] text-white"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Single</option>
                  <option>In a relationship</option>
                  <option>Married</option>
                </select>
              ) : editingField === "gender" ? (
                <select
                  className="w-full h-10 bg-[#2a2b30] text-white"
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value })
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              ) : (
                <input
                  className="w-full h-10 bg-[#2a2b30] text-white px-2"
                  value={form[editingField]}
                  onChange={(e) =>
                    setForm({ ...form, [editingField]: e.target.value })
                  }
                />
              )}

              <button
                onClick={saveProfile}
                className="w-full mt-4 h-10 bg-blue-600 text-white rounded-xl"
              >
                Save
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

function Item({ label, value, edit }) {
  return (
    <div className="bg-white/5 p-3 rounded-xl">
      <div className="flex justify-between">
        <span className="text-white/50 text-sm">{label}</span>
        <button onClick={edit}>✎</button>
      </div>
      <p className="text-white">{value || "Not set"}</p>
    </div>
  );
}
