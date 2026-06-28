"use client";

import { useState } from "react";

export default function ProfileModal({
close,
profileUser,
currentUser,
refreshUser,
}) {

const isOwner =
currentUser?.userId ===
profileUser?.userId;

const [editing, setEditing] =
useState(false);

const [saving, setSaving] =
useState(false);

const [form, setForm] =
useState({

  username:
    profileUser?.username || "",

  bio:
    profileUser?.bio || "",

  avatar:
    profileUser?.avatar || "",

  banner:
    profileUser?.banner || "",

  hometown:
    profileUser?.hometown || "",

  birthday:
    profileUser?.birthday || "",

  status:
    profileUser?.status || "",

  language:
    profileUser?.language || "",

  work:
    profileUser?.work || "",

  education:
    profileUser?.education || "",

  hobbies:
    profileUser?.hobbies || "",

});

// =========================
// SAVE PROFILE
// =========================
const saveProfile = async () => {

try {

  setSaving(true);

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
          JSON.stringify({

            userId:
              currentUser.userId,

            ...form,

          }),
      }
    );

  const data =
    await res.json();

  if (!data.success) {

    alert(
      data.message ||
      "Failed to update"
    );

    return;

  }

  alert(
    "Profile updated"
  );

  setEditing(false);

  if (refreshUser) {
    refreshUser();
  }

} catch (err) {

  console.log(err);

  alert(
    "Server error"
  );

} finally {

  setSaving(false);

}

};

return (

<div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">

  <div
    className="
      relative
      w-full
      max-w-2xl
      max-h-[95vh]
      overflow-y-auto
      rounded-[28px]
      bg-[#1e1f22]
      border
      border-white/10
      shadow-2xl
    "
  >

    {/* CLOSE BUTTON */}

    <button
      onClick={close}
      className="
        fixed
        sm:absolute
        top-4
        right-4
        z-[999999]
        w-11
        h-11
        rounded-full
        bg-black/70
        text-white
        flex
        items-center
        justify-center
        text-xl
        backdrop-blur-xl
      "
    >

      ✕

    </button>

    {/* BANNER */}

    <div className="relative h-[180px] sm:h-[240px] w-full overflow-hidden rounded-t-[28px]">

      {form.banner ? (

        <img
          src={form.banner}
          alt="banner"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
        />

      ) : (

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
          "
        />

      )}

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-black/30" />

    </div>

    {/* PROFILE SECTION */}

    <div className="relative px-4 sm:px-7 pb-7">

      {/* AVATAR */}

      <div
        className="
          -mt-[60px]
          sm:-mt-[75px]
          relative
          z-20
          flex
          flex-col
          items-start
        "
      >

        {form.avatar ? (

          <img
            src={form.avatar}
            alt="avatar"
            className="
              w-[110px]
              h-[110px]
              sm:w-[140px]
              sm:h-[140px]
              rounded-full
              object-cover
              border-[5px]
              border-[#1e1f22]
              bg-[#1e1f22]
              shadow-2xl
            "
          />

        ) : (

          <div
            className="
              w-[110px]
              h-[110px]
              sm:w-[140px]
              sm:h-[140px]
              rounded-full
              bg-blue-600
              border-[5px]
              border-[#1e1f22]
              flex
              items-center
              justify-center
              text-white
              text-5xl
              font-black
            "
          >

            {form.username
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

        )}

      </div>

      {/* USER INFO */}

      <div className="mt-4">

        <div
          className="
            text-[26px]
            sm:text-[34px]
            font-black
            break-words
            leading-tight
          "
        >

          {form.username}

        </div>

        <div
          className="
            opacity-60
            text-sm
            sm:text-base
            break-all
            mt-1
          "
        >

          ID:
          {" "}
          {profileUser?.userId}

        </div>

      </div>

      {/* FRIENDS */}

      <div className="mt-5 text-sm opacity-80">

        Friends:
        {" "}
        <strong>

          {profileUser?.friends?.length || 0}

        </strong>

      </div>

      {/* BIO */}

      <div
        className="
          mt-5
          p-4
          rounded-2xl
          bg-white/5
          text-sm
          leading-relaxed
          break-words
        "
      >

        {form.bio ||
          "No bio yet."}

      </div>

      {/* EDIT BUTTON BELOW BIO */}

      {isOwner && (

        <button
          onClick={() =>
            setEditing(
              !editing
            )
          }
          className="
            mt-4
            w-full
            h-12
            rounded-2xl
            bg-blue-600
            text-white
            font-bold
            text-sm
            sm:text-base
          "
        >

          {editing
            ? "Close Edit"
            : "Edit Profile"}

        </button>

      )}

      {/* EDIT FORM */}

      {editing && (

        <div className="mt-5 space-y-3">

          <input
            value={form.avatar}
            onChange={(e) =>
              setForm({
                ...form,
                avatar:
                  e.target.value,
              })
            }
            placeholder="Avatar URL"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <input
            value={form.banner}
            onChange={(e) =>
              setForm({
                ...form,
                banner:
                  e.target.value,
              })
            }
            placeholder="Banner URL"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <textarea
            value={form.bio}
            onChange={(e) =>
              setForm({
                ...form,
                bio:
                  e.target.value,
              })
            }
            placeholder="Bio"
            className="
              w-full
              h-28
              p-4
              rounded-2xl
              bg-white/10
              outline-none
              resize-none
            "
          />

          <input
            value={form.hometown}
            onChange={(e) =>
              setForm({
                ...form,
                hometown:
                  e.target.value,
              })
            }
            placeholder="Hometown"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <input
            value={form.birthday}
            onChange={(e) =>
              setForm({
                ...form,
                birthday:
                  e.target.value,
              })
            }
            placeholder="Birthday"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <input
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status:
                  e.target.value,
              })
            }
            placeholder="Relationship Status"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <input
            value={form.language}
            onChange={(e) =>
              setForm({
                ...form,
                language:
                  e.target.value,
              })
            }
            placeholder="Language"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <input
            value={form.work}
            onChange={(e) =>
              setForm({
                ...form,
                work:
                  e.target.value,
              })
            }
            placeholder="Work"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <input
            value={form.education}
            onChange={(e) =>
              setForm({
                ...form,
                education:
                  e.target.value,
              })
            }
            placeholder="Education"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <input
            value={form.hobbies}
            onChange={(e) =>
              setForm({
                ...form,
                hobbies:
                  e.target.value,
              })
            }
            placeholder="Hobbies"
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              bg-white/10
              outline-none
            "
          />

          <button
            onClick={saveProfile}
            disabled={saving}
            className="
              w-full
              h-12
              rounded-2xl
              bg-green-600
              text-white
              font-bold
            "
          >

            {saving
              ? "Saving..."
              : "Save Profile"}

          </button>

        </div>

      )}

      {/* DETAILS */}

      <div className="mt-7 space-y-3">

        <div className="font-black text-lg">
          Personal Details
        </div>

        <div className="grid gap-3">

          <div className="rounded-2xl bg-white/5 p-4">
            🏠 Hometown:
            {" "}
            {form.hometown || "N/A"}
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            🎂 Birthday:
            {" "}
            {form.birthday || "N/A"}
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            ❤️ Status:
            {" "}
            {form.status || "N/A"}
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            🌐 Language:
            {" "}
            {form.language || "N/A"}
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            💼 Work:
            {" "}
            {form.work || "N/A"}
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            🎓 Education:
            {" "}
            {form.education || "N/A"}
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            🎮 Hobbies:
            {" "}
            {form.hobbies || "N/A"}
          </div>

        </div>

      </div>

    </div>

  </div>

</div>

);

}
