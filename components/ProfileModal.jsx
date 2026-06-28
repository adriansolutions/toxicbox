"use client";

import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileModal({
  close,
  userId,
  currentUserId,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);

  const isOwnProfile = userId === currentUserId;

  // LOAD PROFILE
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(
          `/api/get-profile?userId=${userId}`
        );

        const data = await res.json();

        if (data.success) {
          setProfile(data.user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // UPDATE AFTER SAVE (NO RELOAD)
  const handleUpdate = (updatedUser) => {
    setProfile(updatedUser);
    setOpenEdit(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 text-white">
        Loading...
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-4">

        <div className="relative w-full max-w-2xl bg-[#1e1f22] rounded-3xl overflow-hidden">

          {/* CLOSE */}
          <button
            onClick={close}
            className="absolute top-3 right-3 w-10 h-10 bg-black/60 text-white rounded-full"
          >
            ✕
          </button>

          {/* BANNER */}
          <div className="h-[200px]">
            {profile.banner ? (
              <img
                src={profile.banner}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
            )}
          </div>

          {/* AVATAR + NAME */}
          <div className="-mt-16 px-5 flex items-end gap-4">

            {profile.avatar ? (
              <img
                src={profile.avatar}
                className="w-[120px] h-[120px] rounded-full border-4 border-[#1e1f22] object-cover"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                {profile.username?.charAt(0)}
              </div>
            )}

            <div>
              <h1 className="text-white text-2xl font-bold">
                {profile.username}
              </h1>
              <p className="text-white/60 text-sm">
                {profile.userId}
              </p>
            </div>
          </div>

          {/* FRIENDS */}
          <div className="px-5 mt-4 text-white">
            <b>{profile.friends?.length || 0}</b> Friends
          </div>

          {/* BIO */}
          <div className="px-5 mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-bold">Bio</h2>

              {isOwnProfile && (
                <button
                  onClick={() => setOpenEdit(true)}
                  className="text-white/60"
                >
                  ⋮
                </button>
              )}
            </div>

            <p className="text-white/70 mt-2">
              {profile.bio || "No bio yet"}
            </p>
          </div>

          {/* EDIT BUTTON */}
          {isOwnProfile && (
            <div className="p-5">
              <button
                onClick={() => setOpenEdit(true)}
                className="w-full h-11 bg-blue-600 text-white rounded-xl font-bold"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {openEdit && (
        <EditProfileModal
          profile={profile}
          close={() => setOpenEdit(false)}
          onSave={handleUpdate}
        />
      )}
    </>
  );
}
