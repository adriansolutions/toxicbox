"use client";

import { useState } from "react";

export default function ProfileModal({
  close,
  profile,
  currentUser,
  updateProfile,
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
  profile?.language || [],

    work:
  Array.isArray(profile?.work)
    ? profile.work
    : [],

education:
  Array.isArray(profile?.education)
    ? profile.education
    : [],

hobbies:
  Array.isArray(profile?.hobbies)
    ? profile.hobbies
    : [],

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

  const [saving, setSaving] =
    useState(false);

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
  Array.isArray(
    safeProfile.language
  )
    ? safeProfile.language
    : [],

      work:
  Array.isArray(safeProfile.work)
    ? safeProfile.work
    : [],

education:
  Array.isArray(safeProfile.education)
    ? safeProfile.education
    : [],

hobbies:
  Array.isArray(safeProfile.hobbies)
    ? safeProfile.hobbies
    : [],

      gender:
        safeProfile.gender,
    });

// =========================
// IMAGE UPLOAD
// =========================

const handleImageUpload =
  async (file, field) => {

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend =
      async () => {

        const image =
          reader.result;

        // UPDATE UI INSTANTLY
        setForm((prev) => ({
          ...prev,
          [field]:
            image,
        }));

        try {

          // AUTO SAVE TO DATABASE
          const payload = {
            userId:
              currentUser.userId,

            [field]:
              image,
          };

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
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await res.json();

          if (!data.success) {

            alert(
              data.message ||
              "Failed to save image"
            );

            return;

          }

          // UPDATE PARENT SIDEBAR
          updateProfile?.({
            [field]:
              image,
          });

        } catch (err) {

          console.log(err);

          alert(
            "Failed to upload image"
          );

        }

      };

    reader.readAsDataURL(file);

  };

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile = async () => {

  try {

    setSaving(true);

    const payload = {
  userId: currentUser.userId,
  
  avatar: form.avatar || "",
  banner: form.banner || "",
  bio: form.bio || "",
  hometown: form.hometown || "",
  birthday: form.birthday || "",
  status: form.status || "",
  gender: form.gender || "",
  
  // FIXED
  language: Array.isArray(form.language) ?
    form.language.join(", ") :
    form.language || "",
  
  // FIXED
  work: Array.isArray(form.work) ?
    form.work :
    [],
  
  // FIXED
  education: Array.isArray(form.education) ?
    form.education :
    [],
  
  // FIXED
  hobbies: Array.isArray(form.hobbies) ?
    form.hobbies :
    [],
};

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
            JSON.stringify(
              payload
            ),
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

setForm((prev) => ({
  ...prev,
  ...payload,
}));

updateProfile?.({
  ...payload,
});

setEditingField(null);

setMenuOpen(false);

    alert("Profile updated!");

  } catch (err) {

    console.log(err);

    alert("Server error");

  } finally {

    setSaving(false);

  }

};

  return (

    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">

      {/* MODAL */}

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
  onClick={(e) => {
    e.stopPropagation();
    close();
  }}
  className="
    absolute
    top-4
    right-4
    z-[99999999]
    w-11
    h-11
    rounded-full
    bg-black/70
    hover:bg-black
    text-white
    flex
    items-center
    justify-center
    text-xl
    cursor-pointer
  "
>
  ✕
</button>

{ /* MENU */ }

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
        w-[200px]
        rounded-2xl
        bg-[#2a2b30]
        border
        border-white/10
        overflow-hidden
      "
    >

      {isOwner ? (

        <>

          {/* CHANGE AVATAR */}

          <label
            className="
              block
              w-full
              px-4
              py-3
              hover:bg-white/10
              text-white
              cursor-pointer
            "
          >

            Change Avatar

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleImageUpload(
                  e.target.files[0],
                  "avatar"
                )
              }
            />

          </label>

          {/* CHANGE BANNER */}

          <label
            className="
              block
              w-full
              px-4
              py-3
              hover:bg-white/10
              text-white
              cursor-pointer
            "
          >

            Change Banner

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleImageUpload(
                  e.target.files[0],
                  "banner"
                )
              }
            />

          </label>

        </>

      ) : (

        <>
          
          {/* REPORT USER */}

          <button
            onClick={() => {

              alert(
                "User reported"
              );

              setMenuOpen(false);

            }}
            className="
              w-full
              px-4
              py-3
              text-left
              hover:bg-red-500/20
              text-red-400
              transition
            "
          >
            Report User
          </button>

        </>

      )}

    </div>

  )}

</div>

        {/* BANNER */}

        <div className="relative h-[190px] sm:h-[260px] overflow-hidden">

          {form.banner ? (

            <img
              src={form.banner}
              className="
                w-full
                h-full
                object-cover
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

          <div className="absolute inset-0 bg-black/30" />

        </div>

        {/* PROFILE SECTION */}

        <div className="relative px-4 sm:px-7 pb-8">

          {/* AVATAR + NAME */}

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
                }{" "}
                Friends

              </div>

            </div>

          </div>

          {/* BIO */}

          <div className="mt-6">

            <div className="flex items-center justify-between mb-2">

              <div className="text-lg font-bold text-white">
                Bio
              </div>

              {(

                <button
                  onClick={() =>
                    setEditingField(
                      "bio"
                    )
                  }
                  className="text-white/60 text-xl"
                >
                  ✎
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
  value={
    Array.isArray(form.language)
      ? form.language.join(", ")
      : form.language
  }
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

              <div className="text-2xl font-black text-white capitalize">
                Edit {editingField}
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

           {/* INPUT */}

{editingField === "status" ? (

  <select
    value={form.status}
    onChange={(e) =>
      setForm({
        ...form,
        status: e.target.value,
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

    <option value="">
      Select Status
    </option>

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
      Divorced
    </option>

  </select>

) : editingField === "gender" ? (

  <select
    value={form.gender}
    onChange={(e) =>
      setForm({
        ...form,
        gender: e.target.value,
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

    <option value="">
      Select Gender
    </option>

    <option>
      Male
    </option>

    <option>
      Female
    </option>

    <option>
      Non-Binary
    </option>

  </select>

) : editingField === "bio" ? (

  <div>

    <textarea
      maxLength={32}
      value={form.bio}
      onChange={(e) =>
        setForm({
          ...form,
          bio: e.target.value,
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

    <div className="text-right text-xs text-white/50 mt-2">
      {form.bio.length}/32
    </div>

  </div>

) : editingField === "hometown" ? (

  <div className="space-y-3">

    <select
      value={form.country || ""}
      onChange={(e) => {

        const country =
          e.target.value;

        setForm((prev) => ({
          ...prev,
          country,

          hometown:
            prev.city
              ? `${country}, ${prev.city}`
              : country,
        }));

      }}
      className="
        w-full
        h-12
        rounded-2xl
        bg-[#2a2b30]
        px-4
        text-white
      "
    >

      <option value="">
        Select Country
      </option>

      <option>
        Philippines
      </option>

      <option>
        United States
      </option>

      <option>
        Japan
      </option>

      <option>
        Korea
      </option>

      <option>
        Canada
      </option>

      <option>
        Australia
      </option>

    </select>

    <input
      placeholder="City"
      value={form.city || ""}
      onChange={(e) => {

        const city =
          e.target.value;

        setForm((prev) => ({
          ...prev,
          city,

          hometown:
            prev.country
              ? `${prev.country}, ${city}`
              : city,
        }));

      }}
      className="
        w-full
        h-12
        rounded-2xl
        bg-[#2a2b30]
        px-4
        text-white
      "
    />

  </div>

) : editingField === "birthday" ? (

  <input
    type="date"
    value={form.birthdayRaw || ""}
    onChange={(e) => {

      const raw = e.target.value;

      const date =
        new Date(raw);

      const formatted =
        date.toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        );

      setForm({
        ...form,
        birthdayRaw: raw,
        birthday: formatted,
      });

    }}
    className="
      w-full
      h-12
      rounded-2xl
      bg-[#2a2b30]
      px-4
      text-white
    "
  />

) : editingField === "language" ? (

  <div className="space-y-3">

    <select
      onChange={(e) => {

        if (!e.target.value)
          return;

        const current =
          Array.isArray(
            form.language
          )
            ? form.language
            : [];

        if (
          current.length >= 5
        )
          return;

        if (
          current.includes(
            e.target.value
          )
        )
          return;

        setForm({
          ...form,
          language: [
            ...current,
            e.target.value,
          ],
        });

      }}
      className="
        w-full
        h-12
        rounded-2xl
        bg-[#2a2b30]
        px-4
        text-white
      "
    >

            <option value="">
        Select Language
      </option>

      <option>
        English
      </option>

      <option>
        Filipino
      </option>

      <option>
        Japanese
      </option>

      <option>
        Korean
      </option>

      <option>
        Chinese
      </option>

    </select>

    <div className="flex flex-wrap gap-2">

      {(Array.isArray(form.language)
        ? form.language
        : []
      ).map((lang, i) => (

        <div
          key={i}
          className="
            px-3
            py-1
            rounded-full
            bg-blue-600
            text-white
            text-sm
            flex
            items-center
            gap-2
          "
        >

          {lang}

          <button
            onClick={() => {

              setForm({
                ...form,
                language:
                  form.language.filter(
                    (
                      _,
                      index
                    ) =>
                      index !== i
                  ),
              });

            }}
          >
            ✕
          </button>

        </div>

      ))}

    </div>

  </div>

) : editingField === "work" ? (

  <div className="space-y-4">

    {(Array.isArray(form.work)
      ? form.work
      : []
    ).map((job, i) => (

      <div
        key={i}
        className="space-y-2"
      >

        <input
          placeholder="Workplace"
          value={job.workplace || ""}
          onChange={(e) => {

            const updated =
              [...form.work];

            updated[i].workplace =
              e.target.value;

            setForm({
              ...form,
              work: updated,
            });

          }}
          className="
            w-full
            h-12
            rounded-2xl
            bg-[#2a2b30]
            px-4
            text-white
          "
        />

        <input
          placeholder="Job Title"
          value={job.title || ""}
          onChange={(e) => {

            const updated =
              [...form.work];

            updated[i].title =
              e.target.value;

            setForm({
              ...form,
              work: updated,
            });

          }}
          className="
            w-full
            h-12
            rounded-2xl
            bg-[#2a2b30]
            px-4
            text-white
          "
        />

      </div>

    ))}

    {(Array.isArray(form.work)
      ? form.work.length
      : 0
    ) < 3 && (

      <button
        onClick={() =>
          setForm({
            ...form,
            work: [
              ...(Array.isArray(
                form.work
              )
                ? form.work
                : []),
              {
                workplace: "",
                title: "",
              },
            ],
          })
        }
        className="
          w-full
          h-12
          rounded-2xl
          bg-blue-600
          text-white
        "
      >
        Add Work
      </button>

    )}

  </div>

) : editingField === "education" ? (

  <select
    value={form.education}
    onChange={(e) =>
      setForm({
        ...form,
        education:
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

    <option value="">
      Select Education
    </option>

    <option>
      Elementary
    </option>

    <option>
      High School
    </option>

    <option>
      Senior High School
    </option>

    <option>
      College
    </option>

    <option>
      Graduate School
    </option>

  </select>

) : editingField === "hobbies" ? (

  <div className="space-y-3">

    <input
      maxLength={12}
      placeholder="Add Hobby"
      onKeyDown={(e) => {

        if (
          e.key === "Enter"
        ) {

          e.preventDefault();

          if (!e.target.value)
            return;

          const current =
            Array.isArray(
              form.hobbies
            )
              ? form.hobbies
              : [];

          if (
            current.length >= 5
          )
            return;

          setForm({
            ...form,
            hobbies: [
              ...current,
              e.target.value,
            ],
          });

          e.target.value = "";

        }

      }}
      className="
        w-full
        h-12
        rounded-2xl
        bg-[#2a2b30]
        px-4
        text-white
      "
    />

    <div className="flex flex-wrap gap-2">

      {(Array.isArray(form.hobbies)
        ? form.hobbies
        : []
      ).map((hobby, i) => (

        <div
          key={i}
          className="
            px-3
            py-1
            rounded-full
            bg-purple-600
            text-white
            text-sm
            flex
            items-center
            gap-2
          "
        >

          {hobby}

          <button
            onClick={() => {

              setForm({
                ...form,
                hobbies:
                  form.hobbies.filter(
                    (
                      _,
                      index
                    ) =>
                      index !== i
                  ),
              });

            }}
          >
            ✕
          </button>

        </div>

      ))}

    </div>

  </div>

) : (

  <input
    value={
      form[
        editingField
      ] || ""
    }
    onChange={(e) =>
      setForm({
        ...form,
        [editingField]:
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

)}

            {/* SAVE */}

            <button
              onClick={
                saveProfile
              }
              disabled={saving}
              className="
                mt-5
                w-full
                h-12
                rounded-2xl
                bg-blue-600
                text-white
                font-bold
                disabled:opacity-50
              "
            >

              {saving
                ? "Saving..."
                : "Save"}

            </button>

          </div>

        </div>

      )}

    </div>

  );
}

// INFO CARD

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
            ✎
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
