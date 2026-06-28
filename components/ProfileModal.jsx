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

  const isOwnProfile = userId === currentUserId;

  // -------------------------
  // LOAD PROFILE
  // -------------------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/get-profile?userId=${userId}`);
        const data = await res.json();

        if (data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // -------------------------
  // UPDATE PROFILE
  // -------------------------
  const updateField = async (field, value) => {
    const updated = {
      ...profile,
      [field]: value,
    };

    setProfile(updated);

    await fetch("/api/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUserId,
        [field]: value,
      }),
    });
  };

  // -------------------------
  // IMAGE TO BASE64
  // -------------------------
  const handleImage = (file, field) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      updateField(field, reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
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
      <div className="w-full max-w-2xl bg-[#1e1f22] rounded-3xl overflow-y-auto max-h-[95vh] border border-white/10">

        {/* CLOSE */}
        <button
          onClick={close}
          className="absolute top-3 right-3 w-10 h-10 bg-black/60 rounded-full text-white"
        >
          ✕
        </button>

        {/* BANNER */}
        <div className="relative h-[200px]">
          {profile.banner ? (
            <img src={profile.banner} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}

          {isOwnProfile && (
            <label className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded text-white text-sm cursor-pointer">
              Change Banner
              <input
                type="file"
                hidden
                onChange={(e) =>
                  handleImage(e.target.files[0], "banner")
                }
              />
            </label>
          )}
        </div>

        {/* AVATAR */}
        <div className="-mt-16 px-5 flex items-end gap-4">
          <div className="relative">
            <img
              src={profile.avatar}
              className="w-[120px] h-[120px] rounded-full border-4 border-[#1e1f22] object-cover"
            />

            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 rounded-full cursor-pointer">
                ✎
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleImage(e.target.files[0], "avatar")
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
        <Section
          title="Bio"
          value={profile.bio}
          editable={isOwnProfile}
          onEdit={() => setEditingField("bio")}
        />

        {editingField === "bio" && (
          <EditBox
            value={profile.bio}
            onSave={(val) => {
              updateField("bio", val);
              setEditingField(null);
            }}
            onClose={() => setEditingField(null)}
          />
        )}

        {/* HOMETOWN */}
        <Section
          title="Hometown"
          value={profile.hometown}
          editable={isOwnProfile}
          onEdit={() => setEditingField("hometown")}
        />

        {editingField === "hometown" && (
          <EditBox
            value={profile.hometown}
            onSave={(val) => {
              updateField("hometown", val);
              setEditingField(null);
            }}
            onClose={() => setEditingField(null)}
          />
        )}

        {/* STATUS */}
        <Section
          title="Status"
          value={profile.status}
          editable={isOwnProfile}
          onEdit={() => setEditingField("status")}
        />

        {editingField === "status" && (
          <select
            value={profile.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="w-full p-3 bg-[#2a2b30] text-white"
          >
            <option>Single</option>
            <option>In a relationship</option>
            <option>Married</option>
            <option>Complicated</option>
          </select>
        )}

      </div>
    </div>
  );
}

// --------------------
// SECTION UI
// --------------------
function Section({ title, value, editable, onEdit }) {
  return (
    <div className="p-4 text-white border-t border-white/10">
      <div className="flex justify-between">
        <h3 className="font-bold">{title}</h3>
        {editable && (
          <button onClick={onEdit} className="text-white/60">
            ✎
          </button>
        )}
      </div>
      <p className="text-white/70 mt-2">{value || "Not set"}</p>
    </div>
  );
}

// --------------------
// EDIT BOX
// --------------------
function EditBox({ value, onSave, onClose }) {
  const [text, setText] = useState(value || "");

  return (
    <div className="p-4 bg-black/40">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 bg-[#2a2b30] text-white rounded"
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onSave(text)}
          className="bg-blue-600 px-4 py-2 text-white rounded"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="bg-gray-600 px-4 py-2 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
