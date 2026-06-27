"use client";

import { useState } from "react";

export default function FriendsModal({
  close,
  currentUser,
  friends,
  setFriends,
}) {

  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState([]);

  // SEARCH USER
  const searchUser = () => {

    const users =
      JSON.parse(
        localStorage.getItem(
          "bluechat-users"
        ) || "[]"
      );

    const filtered =
      users.filter((u) => {

        if (
          u.userId ===
          currentUser.userId
        )
          return false;

        return (
          u.username
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          u.userId
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );

      });

    setResults(filtered);

  };

  // ADD FRIEND
  const addFriend = (
    user
  ) => {

    const already =
      friends.find(
        (f) =>
          f.userId ===
          user.userId
      );

    if (already) {

      alert(
        "Already added"
      );

      return;

    }

    const updated = [
      ...friends,
      user,
    ];

    setFriends(updated);

    localStorage.setItem(
      `bluechat-friends-${currentUser.userId}`,
      JSON.stringify(updated)
    );

    alert(
      "Friend added"
    );

  };

  return (

    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1e1f22] border border-white/10 shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="px-6 py-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-black">
              Add Friend
            </h2>

            <p className="text-sm opacity-60">
              Search username or ID
            </p>

          </div>

          <button
            onClick={close}
            className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10"
          >
            ✕
          </button>

        </div>

        {/* SEARCH */}

        <div className="p-5">

<div className="flex gap-2 items-center w-full">

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                flex-1
                min-w-0
                h-12
                px-4
                rounded-2xl
                bg-gray-100
                dark:bg-[#383a40]
                outline-none
              "
            />

<button
  onClick={
    searchUser
  }
  className="
    h-12
    px-4
    shrink-0
    rounded-2xl
    bg-blue-600
    hover:bg-blue-700
    text-white
    font-bold
    transition
  "
>
  Search
</button>

          </div>

          {/* RESULTS */}

          <div className="mt-5 space-y-3 max-h-[350px] overflow-y-auto">

            {results.map(
              (user) => (

                <div
                  key={
                    user.userId
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-2xl
                    bg-black/5
                    dark:bg-white/5
                  "
                >

                  {/* AVATAR */}

                  {user.avatar ? (

                    <img
                      src={
                        user.avatar
                      }
                      className="
                        avatar
                        object-cover
                      "
                    />

                  ) : (

                    <div className="avatar">

                      {user.username
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                  )}

                  {/* INFO */}

                  <div className="flex-1 min-w-0">

                    <div className="font-bold truncate">

                      {
                        user.username
                      }

                    </div>

                    <div className="text-sm opacity-60">

                      {
                        user.userId
                      }

                    </div>

                  </div>

                  {/* ADD */}

                  <button
                    onClick={() =>
                      addFriend(
                        user
                      )
                    }
                    className="
                      px-4
                      h-10
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-bold
                    "
                  >
                    Add
                  </button>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>

  );

}
