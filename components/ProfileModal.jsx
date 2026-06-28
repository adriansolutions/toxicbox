"use client";

import { FiX, FiEdit2 } from "react-icons/fi";

export default function ProfileModal({
  user,
  currentUser,
  close,
  onEdit,
}) {

  const isOwnProfile =
    currentUser?.userId === user?.userId;

  return (

    <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">

      {/* MODAL */}
      <div
        className="
          relative
          w-full
          max-w-3xl
          rounded-[28px]
          overflow-hidden
          bg-[#111214]
          border
          border-white/10
          shadow-2xl
          animate-[fadeIn_.2s_ease]
        "
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={close}
          className="
            absolute
            top-4
            right-4
            z-50
            w-11
            h-11
            rounded-2xl
            bg-black/50
            hover:bg-black/70
            text-white
            flex
            items-center
            justify-center
            transition
            backdrop-blur-md
          "
        >
          <FiX size={24} />
        </button>

        {/* BANNER */}
        <div className="relative h-[180px] sm:h-[230px] md:h-[280px] bg-[#1b1c1f]">

          {user?.banner ? (

            <img
              src={user.banner}
              alt="banner"
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
                via-purple-600
                to-pink-600
              "
            />

          )}

        </div>

        {/* CONTENT */}
        <div className="px-4 sm:px-6 md:px-8 pb-8">

          {/* AVATAR + USER INFO */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 relative z-20">

            {/* AVATAR */}
            <div
              className="
                w-[120px]
                h-[120px]
                sm:w-[150px]
                sm:h-[150px]
                rounded-full
                border-[5px]
                border-[#111214]
                overflow-hidden
                bg-[#1e1f22]
                shadow-2xl
                shrink-0
              "
            >

              {user?.avatar ? (

                <img
                  src={user.avatar}
                  alt="avatar"
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
                    flex
                    items-center
                    justify-center
                    text-5xl
                    font-black
                    text-white
                    bg-blue-600
                  "
                >
                  {user?.username
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

              )}

            </div>

            {/* USER DETAILS */}
            <div className="flex-1 min-w-0 pb-2">

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                <h1
                  className="
                    text-2xl
                    sm:text-3xl
                    font-black
                    text-white
                    truncate
                  "
                >
                  {user?.username}
                </h1>

                {/* EDIT BUTTON */}
                {isOwnProfile && (

                  <button
                    onClick={onEdit}
                    className="
                      h-11
                      px-5
                      rounded-2xl
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-bold
                      flex
                      items-center
                      justify-center
                      gap-2
                      transition
                      w-fit
                    "
                  >

                    <FiEdit2 />

                    Edit Profile

                  </button>

                )}

              </div>

              <div
                className="
                  text-sm
                  sm:text-base
                  text-white/60
                  mt-1
                  break-all
                "
              >
                {user?.userId}
              </div>

              {/* FRIEND COUNT */}
              <div
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-2xl
                  bg-white/5
                  text-white
                  text-sm
                  font-medium
                "
              >

                👥

                {user?.friends?.length || 0}
                {" "}
                Friends

              </div>

            </div>

          </div>

          {/* BIO */}
          <div className="mt-7">

            <div className="text-lg font-bold text-white mb-2">
              Bio
            </div>

            <div
              className="
                rounded-3xl
                bg-white/5
                border
                border-white/10
                p-5
                text-white/80
                leading-relaxed
                break-words
              "
            >

              {user?.bio || "No bio yet."}

            </div>

          </div>

          {/* PERSONAL DETAILS */}
          <div className="mt-7">

            <div className="text-lg font-bold text-white mb-4">
              Personal Details
            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              "
            >

              <InfoCard
                title="Hometown"
                value={user?.hometown}
              />

              <InfoCard
                title="Birthday"
                value={user?.birthday}
              />

              <InfoCard
                title="Status"
                value={user?.status}
              />

              <InfoCard
                title="Language"
                value={user?.language}
              />

              <InfoCard
                title="Work"
                value={user?.work}
              />

              <InfoCard
                title="Education"
                value={user?.education}
              />

              <InfoCard
                title="Hobbies"
                value={user?.hobbies}
              />

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

/* ========================= */
/* INFO CARD */
/* ========================= */

function InfoCard({
  title,
  value,
}) {

  return (

    <div
      className="
        rounded-3xl
        bg-white/5
        border
        border-white/10
        p-5
      "
    >

      <div
        className="
          text-xs
          uppercase
          tracking-wider
          text-white/40
          mb-2
        "
      >
        {title}
      </div>

      <div
        className="
          text-white
          font-medium
          break-words
        "
      >
        {value || "Not set"}
      </div>

    </div>

  );

}
