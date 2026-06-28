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
  const [error, setError] = useState(null);

  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/get-profile?userId=${userId}`
        );

        const data = await res.json();

        console.log("PROFILE API RESPONSE:", data);

        if (!data?.success || !data?.user) {
          setError("Profile not found");
          return;
        }

        setProfile(data.user);

      } catch (err) {
        console.log("PROFILE LOAD ERROR:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadProfile();
  }, [userId]);

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center">
        <div className="text-white text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  /* =========================
     ERROR FIX (IMPORTANT)
  ========================= */
  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-4">
        <div className="bg-[#1e1f22] p-6 rounded-2xl text-white text-center">
          <p className="text-red-400 font-bold mb-2">
            {error}
          </p>

          <button
            onClick={close}
            className="mt-3 px-4 py-2 bg-blue-600 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     SAFETY CHECK (FIX BLANK SCREEN)
  ========================= */
  if (!profile) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center">
        <div className="text-white">No profile found</div>
      </div>
    );
  }

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">

        <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-[#1e1f22] border border-white/10">

          {/* CLOSE */}
          <button
            onClick={close}
            className="absolute top-3 right-3 z-50 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center"
          >
            ✕
          </button>

          {/* BANNER */}
          <div className="h-[200px] w-full">
            {profile.banner ? (
              <img
                src={profile.banner}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-500" />
            )}
          </div>

          {/* CONTENT */}
          <div className="p-5">

            {/* AVATAR */}
            <div className="flex items-end gap-4 -mt-14">

              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  className="w-[120px] h-[120px] rounded-full border-4 border-[#1e1f22] object-cover"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-[#1e1f22]">
                  {profile.username?.charAt(0) || "U"}
                </div>
              )}

              <div>
                <h1 className="text-white text-2xl font-bold">
                  {profile.username || "Unknown User"}
                </h1>

                <p className="text-white/60 text-sm">
                  ID: {profile.userId || "Unknown ID"}
                </p>

                <p className="text-blue-400 text-sm mt-1">
                  {profile.friends?.length || 0} Friends
                </p>
              </div>
            </div>

            {/* BIO */}
            <div className="mt-5">
              <h2 className="text-white font-bold mb-2">Bio</h2>
              <p className="text-white/70">
                {profile.bio || "No bio yet"}
              </p>
            </div>

            {/* EDIT BUTTON */}
            {isOwnProfile && (
              <button
                onClick={() => setOpenEdit(true)}
                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-xl font-bold"
              >
                Edit Profile
              </button>
            )}

          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {openEdit && (
        <EditProfileModal
          profile={profile}
          close={() => setOpenEdit(false)}
          onSave={(updated) => {
            setProfile(updated);
            setOpenEdit(false);
          }}
        />
      )}
    </>
  );
}
