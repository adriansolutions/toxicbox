"use client";

import {
  useState,
  useRef,
} from "react";

import {
  FiEdit2,
} from "react-icons/fi";

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

    banner:
      profile?.banner || "",

    bio:
      profile?.bio || "",

    hometown:
      profile?.hometown || "",

    birthday:
      profile?.birthday || "",

    status:
      profile?.status || "",

    language:
      profile?.language || "",

    work:
      profile?.work || "",

    education:
      profile?.education || "",

    hobbies:
      profile?.hobbies || "",

    gender:
      profile?.gender || "",

    friends:
      profile?.friends || [],

  };

  const isOwner =
    currentUser?.userId ===
    safeProfile?.userId;

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [editingField, setEditingField] =
    useState(null);

  const avatarInputRef =
    useRef(null);

  const bannerInputRef =
    useRef(null);

  const [form, setForm] =
    useState({

      avatar:
        safeProfile.avatar,

      banner:
        safeProfile.banner,

      bio:
        safeProfile.bio,

      hometown:
        safeProfile.hometown,

      birthday:
        safeProfile.birthday,

      status:
        safeProfile.status,

      language:
        safeProfile.language,

      work:
        safeProfile.work,

      education:
        safeProfile.education,

      hobbies:
        safeProfile.hobbies,

      gender:
        safeProfile.gender,

    });

  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleImageUpload =
    (event, type) => {

      const file =
        event.target.files?.[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = () => {

        setForm((prev) => ({
          ...prev,
          [type]:
            reader.result,
        }));

      };

      reader.readAsDataURL(file);

    };

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile =
    async () => {

      try {

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

        setEditingField(null);

        setMenuOpen(false);

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">

      <div
        className="
          relative
          w-full
          max-w-[760px]
          max-h-[95vh]
          overflow-y-auto
          rounded-[28px]
          bg-[#1e1f22]
          border
          border-white/10
          shadow-2xl
        "
      >

        {/* CLOSE */}

        <button
          onClick={close}
          className="
            fixed
            top-3
            right-3
            z-[999999]
            w-11
            h-11
            rounded-full
            bg-black/70
            text-white
            text-xl
            flex
            items-center
            justify-center
          "
        >

          ✕

        </button>

        {/* MENU */}

        {isOwner && (

          <div className="absolute top-4 left-4 z-50">

            <button
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }

              className="
                w-11
                h-11
                rounded-full
                bg-black/60
                text-white
                text-2xl
              "
            >

              ⋮

            </button>

            {menuOpen && (

              <div
                className="
                  mt-2
                  w-[180px]
                  rounded-2xl
                  bg-[#2a2b30]
                  border
                  border-white/10
                  overflow-hidden
                "
              >

                <button
                  onClick={() => {

                    setEditingField(
                      "profile"
                    );

                    setMenuOpen(
                      false
                    );

                  }}

                  className="
                    w-full
                    text-left
                    px-4
                    py-3
                    hover:bg-white/10
                    text-white
                  "
                >

                  Edit Profile

                </button>

              </div>

            )}

          </div>

        )}

        {/* BANNER */}

        <div className="relative h-[190px] sm:h-[260px] overflow-hidden">

          {form.banner ? (

            <img
              src={form.banner}

              onClick={() => {

                if (!isOwner)
                  return;

                bannerInputRef.current?.click();

              }}

              className="
                w-full
                h-full
                object-cover
                cursor-pointer
              "
            />

          ) : (

            <div
              className="
                w-full
                h-full
                bg-gradient-to-r
                from-blue-600
                to-purple-600
              "
            />

          )}

          <input
            type="file"
            hidden
            accept="image/*"

            ref={bannerInputRef}

            onChange={(e) =>
              handleImageUpload(
                e,
                "banner"
              )
            }
          />

          <div className="absolute inset-0 bg-black/30" />

        </div>

        {/* CONTENT */}

        <div className="relative px-4 sm:px-7 pb-8">

          {/* HEADER */}

          <div
            className="
              relative
              z-20
              flex
              flex-col
              sm:flex-row
              gap-4
              items-start
              sm:items-end
              -mt-16
            "
          >

            {/* AVATAR */}

            <div className="shrink-0">

              {form.avatar ? (

                <img
                  src={form.avatar}

                  onClick={() => {

                    if (!isOwner)
                      return;

                    avatarInputRef.current?.click();

                  }}

                  className="
                    w-[115px]
                    h-[115px]
                    sm:w-[140px]
                    sm:h-[140px]
                    rounded-full
                    object-cover
                    border-[5px]
                    border-[#1e1f22]
                    bg-[#1e1f22]
                    cursor-pointer
                  "
                />

              ) : (

                <div
                  className="
                    w-[115px]
                    h-[115px]
                    sm:w-[140px]
                    sm:h-[140px]
                    rounded-full
                    bg-blue-600
                    text-white
                    text-5xl
                    font-black
                    flex
                    items-center
                    justify-center
                    border-[5px]
                    border-[#1e1f22]
                  "
                >

                  {safeProfile.username
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

              )}

              <input
                type="file"
                hidden
                accept="image/*"

                ref={avatarInputRef}

                onChange={(e) =>
                  handleImageUpload(
                    e,
                    "avatar"
                  )
                }
              />

            </div>

            {/* INFO */}

            <div className="min-w-0 flex-1 pb-2">

              <div
                className="
                  text-[28px]
                  sm:text-[36px]
                  font-black
                  text-white
                  leading-tight
                  break-words
                "
              >

                {safeProfile.username}

              </div>

              <div
                className="
                  text-sm
                  text-white/60
                  break-all
                "
              >

                {safeProfile.userId}

              </div>

              <div
                className="
                  mt-2
                  text-blue-400
                  font-semibold
                  text-sm
                "
              >

                {
                  safeProfile
                    ?.friends
                    ?.length || 0
                } Friends

              </div>

            </div>

          </div>

          {/* BIO */}

          <div className="mt-6">

            <div className="flex items-center justify-between mb-2">

              <div className="text-lg font-bold text-white">

                Bio

              </div>

              {isOwner && (

                <button
                  onClick={() =>
                    setEditingField(
                      "bio"
                    )
                  }

                  className="text-white/60 text-xl"
                >

                  <FiEdit2 />

                </button>

              )}

            </div>

            <div
              className="
                bg-white/5
                rounded-2xl
                p-4
                text-white/80
                text-sm
                break-words
              "
            >

              {form.bio ||
                "No bio yet"}

            </div>

          </div>

          {/* DETAILS */}

          <div className="mt-6">

            <div className="text-lg font-bold text-white mb-3">

              Personal Information

            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
              "
            >

              <Info
                label="Gender"
                value={form.gender}
                edit={() =>
                  setEditingField(
                    "gender"
                  )
                }
                isOwner={isOwner}
              />

              <Info
                label="Hometown"
                value={form.hometown}
                edit={() =>
                  setEditingField(
                    "hometown"
                  )
                }
                isOwner={isOwner}
              />

              <Info
                label="Birthday"
                value={form.birthday}
                edit={() =>
                  setEditingField(
                    "birthday"
                  )
                }
                isOwner={isOwner}
              />

              <Info
                label="Status"
                value={form.status}
                edit={() =>
                  setEditingField(
                    "status"
                  )
                }
                isOwner={isOwner}
              />

              <Info
                label="Language"
                value={form.language}
                edit={() =>
                  setEditingField(
                    "language"
                  )
                }
                isOwner={isOwner}
              />

              <Info
                label="Work"
                value={form.work}
                edit={() =>
                  setEditingField(
                    "work"
                  )
                }
                isOwner={isOwner}
              />

              <Info
                label="Education"
                value={form.education}
                edit={() =>
                  setEditingField(
                    "education"
                  )
                }
                isOwner={isOwner}
              />

              <Info
                label="Hobbies"
                value={form.hobbies}
                edit={() =>
                  setEditingField(
                    "hobbies"
                  )
                }
                isOwner={isOwner}
              />

            </div>

          </div>

        </div>

      </div>

      {/* EDIT MODAL */}

      {editingField && (

        <div className="fixed inset-0 z-[9999999] bg-black/80 flex items-center justify-center p-4">

          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-[#1e1f22]
              border
              border-white/10
              p-6
            "
          >

            <div className="flex items-center justify-between mb-5">

              <div className="text-2xl font-black text-white">

                {editingField ===
                "profile"
                  ? "Edit Profile"
                  : `Edit ${editingField}`}

              </div>

              <button
                onClick={() =>
                  setEditingField(
                    null
                  )
                }

                className="text-white text-2xl"
              >

                ✕

              </button>

            </div>

            {editingField ===
            "profile" ? (

              <div className="space-y-3">

                <ProfileButton
                  text="Edit Bio"
                  click={() =>
                    setEditingField(
                      "bio"
                    )
                  }
                />

                <ProfileButton
                  text="Edit Gender"
                  click={() =>
                    setEditingField(
                      "gender"
                    )
                  }
                />

                <ProfileButton
                  text="Edit Hometown"
                  click={() =>
                    setEditingField(
                      "hometown"
                    )
                  }
                />

                <ProfileButton
                  text="Edit Birthday"
                  click={() =>
                    setEditingField(
                      "birthday"
                    )
                  }
                />

                <ProfileButton
                  text="Edit Status"
                  click={() =>
                    setEditingField(
                      "status"
                    )
                  }
                />

              </div>

            ) : editingField ===
            "status" ? (

              <select
                value={form.status}

                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value,
                  })
                }

                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                "
              >

                <option>
                  Single
                </option>

                <option>
                  In a relationship
                </option>

                <option>
                  Engaged
                </option>

                <option>
                  Married
                </option>

                <option>
                  In a civil union
                </option>

                <option>
                  In a domestic partnership
                </option>

                <option>
                  In an open relationship
                </option>

                <option>
                  It's complicated
                </option>

                <option>
                  Separated
                </option>

                <option>
                  Divorced
                </option>

                <option>
                  Widowed
                </option>

              </select>

            ) : editingField ===
            "gender" ? (

              <select
                value={form.gender}

                onChange={(e) =>
                  setForm({
                    ...form,
                    gender:
                      e.target.value,
                  })
                }

                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                "
              >

                <option>
                  Male
                </option>

                <option>
                  Female
                </option>

              </select>

            ) : editingField ===
            "bio" ? (

              <textarea
                value={form.bio}

                onChange={(e) =>
                  setForm({
                    ...form,
                    bio:
                      e.target.value,
                  })
                }

                placeholder="Introduce yourself"

                className="
                  w-full
                  min-h-[140px]
                  rounded-2xl
                  bg-[#2a2b30]
                  p-4
                  text-white
                  resize-none
                "
              />

            ) : editingField ===
            "birthday" ? (

              <input
                type="date"

                value={form.birthday}

                onChange={(e) =>
                  setForm({
                    ...form,
                    birthday:
                      e.target.value,
                  })
                }

                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                "
              />

            ) : editingField ===
            "hobbies" ? (

              <textarea
                value={form.hobbies}

                onChange={(e) =>
                  setForm({
                    ...form,
                    hobbies:
                      e.target.value,
                  })
                }

                placeholder="
Gaming,
Music,
Coding
"

                className="
                  w-full
                  min-h-[120px]
                  rounded-2xl
                  bg-[#2a2b30]
                  p-4
                  text-white
                  resize-none
                "
              />

            ) : (

              <input
                value={
                  form[
                    editingField
                  ]
                }

                onChange={(e) =>
                  setForm({
                    ...form,
                    [
                      editingField
                    ]:
                      e.target
                        .value,
                  })
                }

                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#2a2b30]
                  px-4
                  text-white
                "
              />

            )}

            {editingField !==
            "profile" && (

              <button
                onClick={
                  saveProfile
                }

                className="
                  mt-5
                  w-full
                  h-12
                  rounded-2xl
                  bg-blue-600
                  text-white
                  font-bold
                "
              >

                Save

              </button>

            )}

          </div>

        </div>

      )}

    </div>

  );

}

function ProfileButton({
  text,
  click,
}) {

  return (

    <button
      onClick={click}

      className="
        w-full
        h-12
        rounded-2xl
        bg-white/5
        text-left
        px-4
        text-white
      "
    >

      {text}

    </button>

  );

}

function Info({
  label,
  value,
  edit,
  isOwner,
}) {

  return (

    <div
      className="
        bg-white/5
        rounded-2xl
        p-4
      "
    >

      <div className="flex items-center justify-between mb-1">

        <div
          className="
            text-xs
            uppercase
            opacity-50
            text-white
          "
        >

          {label}

        </div>

        {isOwner && (

          <button
            onClick={edit}

            className="
              text-white/60
              text-sm
            "
          >

            <FiEdit2 />

          </button>

        )}

      </div>

      <div
        className="
          text-sm
          text-white
          break-words
        "
      >

        {value || "Not set"}

      </div>

    </div>

  );

}
