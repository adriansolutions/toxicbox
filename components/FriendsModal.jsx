"use client";

import { useState } from "react";

export default function FriendsModal({
  close,
  currentUser,
  friends,
  setFriends,
  setActiveChat,
}) {

  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // SEARCH USER
  const searchUser = async () => {

    if (!search.trim())
      return;

    try {

      setLoading(true);

      const res = await fetch(
        "/api/search-user",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            search,
          }),
        }
      );

      const data =
        await res.json();

      console.log(data);

      if (!data.success) {

        setResults([]);

        alert(
          data.message ||
          "User not found"
        );

        return;

      }

      // DON'T SHOW YOURSELF
      if (
        data.user.userId ===
        currentUser.userId
      ) {

        alert(
          "You cannot add yourself"
        );

        setResults([]);

        return;

      }

      setResults([
        data.user,
      ]);

    } catch (err) {

      console.log(err);

      alert(
        "Search failed"
      );

    } finally {

      setLoading(false);

    }

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

    // AUTO OPEN DM
    setActiveChat({
      type: "dm",
      id: user.userId,
      user,
    });

    alert(
      "Friend added"
    );

    close();

  };

  return (

    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

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

              placeholder="Search username or ID..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              onKeyDown={(e) => {

                if (
                  e.key ===
                  "Enter"
                ) {

                  searchUser();

                }

              }}

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
              disabled={loading}
              className="
                h-12
                px-4
                shrink-0
                rounded-2xl
                bg-blue-600
                hover:bg-blue-700
                disabled:opacity-50
                text-white
                font-bold
                transition
              "
            >

              {loading
                ? "..."
                : "Search"}

            </button>

          </div>

          {/* RESULTS */}

          <div className="mt-5 space-y-3 max-h-[350px] overflow-y-auto">

            {!loading &&
              results.length ===
                0 && (

                <div className="text-center text-sm opacity-60 py-6">

                  No results

                </div>

              )}

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

                      alt="avatar"

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

                    <div className="text-sm opacity-60 truncate">

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
                      shrink-0
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
