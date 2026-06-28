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

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await fetch(
          `/api/get-profile?userId=${userId}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.success && data?.profile) {
          setProfile(data.profile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.log("Profile load error:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // LOADING UI
  if (loading) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  // NOT FOUND UI
  if (!profile) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center">
        <div className="text-white text-center">
          Profile not found
          <br />
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

  return (
    <>
      {/* MODAL */}
      <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">

        <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-[#1e1f22] border border-white/10 shadow-2xl">

          {/* CLOSE */}
          <button
            onClick={close}
            className="absolute top-3 right-3 z-50 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center text-xl"
          >
            ✕
          </button>

          {/* BANNER */}
          <div className="h-[180px] w-full">
            {profile.banner ? (
              <img
                src={profile.banner}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500" />
            )}
          </div>

          {/* CONTENT */}
          <div className="px-5 pb-6">

            {/* AVATAR */}
            <div className="-mt-[60px] flex gap-4 items-end">

              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  className="w-[120px] h-[120px] rounded-full border-4 border-[#1e1f22] object-cover bg-[#2a2b30]"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-black border-4 border-[#1e1f22]">
                  {profile.username?.charAt(0)?.toUpperCase()}
                </div>
              )}

              {/* USER INFO */}
              <div className="pb-2">
                <div className="text-2xl font-black text-white">
                  {profile.username || "Unknown User"}
                </div>

                <div className="text-sm text-white/60">
                  ID: {profile.userId || "Unknown ID"}
                </div>

                <div className="text-sm text-blue-400 font-semibold mt-1">
                  {profile.friends?.length || 0} Friends
                </div>
              </div>
            </div>

            {/* BIO */}
            <div className="mt-5">
              <div className="text-white font-bold mb-2">Bio</div>
              <div className="text-white/70">
                {profile.bio || "No bio yet"}
              </div>
            </div>

            {/* EDIT BUTTON */}
            {isOwnProfile && (
              <button
                onClick={() => setOpenEdit(true)}
                className="mt-5 w-full sm:w-auto px-5 h-11 rounded-2xl bg-blue-600 text-white font-bold"
              >
                Edit Profile
              </button>
            )}

            {/* DETAILS */}
            <div className="mt-6 space-y-3 text-white">

              <Item label="Hometown" value={profile.hometown} />
              <Item label="Birthday" value={profile.birthday} />
              <Item label="Status" value={profile.status} />
              <Item label="Language" value={profile.language} />
              <Item label="Work" value={profile.work} />
              <Item label="Education" value={profile.education} />
              <Item label="Hobbies" value={profile.hobbies} />

            </div>

          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {openEdit && (
        <EditProfileModal
          profile={profile}
          close={() => setOpenEdit(false)}
          refreshProfile={() => {
            setOpenEdit(false);
            setLoading(true);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}

function Item({ label, value }) {
  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="text-white/50 text-sm">{label}</div>
      <div className="text-white">{value || "Not set"}</div>
    </div>
  );
}
