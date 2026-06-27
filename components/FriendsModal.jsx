"use client";

import { useEffect, useState } from "react";

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

  const [
    incomingRequests,
    setIncomingRequests,
  ] = useState([]);

  // =========================
  // LOAD REQUESTS
  // =========================
  const loadRequests =
    async () => {

      try {

        const res =
          await fetch(
            `/api/get-friend-requests?userId=${currentUser.userId}`
          );

        const data =
          await res.json();

        if (
          data.success
        ) {

          setIncomingRequests(
            data.requests || []
          );

        } else {

          setIncomingRequests([]);

        }

      } catch (err) {

        console.log(err);

        setIncomingRequests([]);

      }

    };

  useEffect(() => {

    if (
      !currentUser?.userId
    )
      return;

    loadRequests();

    const interval =
      setInterval(
        loadRequests,
        3000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [
    currentUser?.userId,
  ]);

  // =========================
  // SEARCH USER
  // =========================
  const searchUser =
    async () => {

      if (
        !search.trim()
      )
        return;

      try {

        setLoading(
          true
        );

        const res =
          await fetch(
            "/api/search-user",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  search,
                }),
            }
          );

        const data =
          await res.json();

        if (
          !data.success
        ) {

          setResults([]);

          alert(
            data.message ||
            "User not found"
          );

          return;

        }

        if (
          data.user.userId ===
          currentUser.userId
        ) {

          alert(
            "You cannot add yourself"
          );

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

        setLoading(
          false
        );

      }

    };

  // =========================
  // SEND REQUEST
  // =========================
  const addFriend =
    async (user) => {

      try {

        const res =
          await fetch(
            "/api/send-friend-request",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({

                  fromUserId:
                    currentUser.userId,

                  toUserId:
                    user.userId,

                  username:
                    currentUser.username,

                  avatar:
                    currentUser.avatar || "",

                }),
            }
          );

        const data =
          await res.json();

        if (
          !data.success
        ) {

          alert(
            data.message ||
            "Failed to send request"
          );

          return;

        }

        alert(
          "Friend request sent"
        );

        setResults([]);

        setSearch("");

      } catch (err) {

        console.log(err);

        alert(
          "Server error"
        );

      }

    };

  // =========================
  // ACCEPT REQUEST
  // =========================
  const acceptRequest =
    async (user) => {

      try {

        const res =
          await fetch(
            "/api/accept-friend-requests",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({

                  currentUserId:
                    currentUser.userId,

                  fromUserId:
                    user.userId,

                }),
            }
          );

        const data =
          await res.json();

        if (
          !data.success
        ) {

          alert(
            data.message ||
            "Failed to accept"
          );

          return;

        }

        const newFriend = data.friend;

        // ADD FRIEND
        setFriends(
          (prev) => {

            const exists =
              prev.find(
                (f) =>
                  f.userId ===
                  newFriend.userId
              );

            if (exists)
              return prev;

            return [
              ...prev,
              newFriend,
            ];

          }
        );

        // REMOVE REQUEST
        setIncomingRequests(
          (prev) =>
            prev.filter(
              (r) =>
                r._id !==
                user._id
            )
        );

        // OPEN DM
        setActiveChat({

          type: "dm",

          id:
            newFriend.userId,

          user:
            newFriend,

        });

        close();

      } catch (err) {

        console.log(err);

        alert(
          "Server error"
        );

      }

    };

  return (

    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1e1f22] border border-white/10 shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="px-6 py-5 border-b border-black/10 dark:border-white/10 flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-black">
              Friends
            </h2>

            <p className="text-sm opacity-60">
              Add and accept friends
            </p>

          </div>

          <button
            onClick={close}
            className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10"
          >
            ✕
          </button>

        </div>

        <div className="p-5">

          {/* SEARCH */}

          <div className="flex gap-2">

            <input
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

              placeholder="Search username or ID..."

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

              disabled={
                loading
              }

              className="
                shrink-0
                h-12
                px-5
                rounded-2xl
                bg-blue-600
                text-white
                font-bold
              "
            >

              {loading
                ? "..."
                : "Search"}

            </button>

          </div>

          {/* RESULTS */}

          <div className="mt-5 space-y-3">

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
                        w-12
                        h-12
                        rounded-full
                        object-cover
                      "
                    />

                  ) : (

                    <div className="
                      w-12
                      h-12
                      rounded-full
                      bg-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                    ">

                      {user.username
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                  )}

                  {/* INFO */}

                  <div className="flex-1 min-w-0">

                    <div className="font-bold truncate">
                      {user.username}
                    </div>

                    <div className="text-sm opacity-60 truncate">
                      {user.userId}
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      addFriend(
                        user
                      )
                    }

                    className="
                      shrink-0
                      px-4
                      h-10
                      rounded-xl
                      bg-blue-600
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

          {/* REQUESTS */}

          <div className="mt-8">

            <div className="font-bold mb-3">
              Incoming Friend Requests
            </div>

            <div className="space-y-3">

              {incomingRequests.length === 0 && (

                <div className="text-sm opacity-60">
                  No requests
                </div>

              )}

              {incomingRequests.map(
                (user) => (

                  <div
                    key={user._id}

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

                    {user.fromAvatar ? (

                      <img
                        src={
                          user.fromAvatar
                        }

                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        w-12
                        h-12
                        rounded-full
                        bg-blue-600
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                      ">

                        {user.fromUsername
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>

                    )}

                    {/* INFO */}

                    <div className="flex-1 min-w-0">

                      <div className="font-bold truncate">
                        {user.fromUsername}
                      </div>

                      <div className="text-sm opacity-60 truncate">
                        {user.fromUserId}
                      </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="flex gap-2 shrink-0">

                      {/* ACCEPT */}

                      <button
                        onClick={() =>
                          acceptRequest({

                            _id:
                              user._id,

                            username:
                              user.fromUsername,

                            userId:
                              user.fromUserId,

                            avatar:
                              user.fromAvatar || "",

                          })
                        }

                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-green-600
                          hover:bg-green-700
                          text-white
                          font-bold
                          flex
                          items-center
                          justify-center
                        "
                      >

                        ✓

                      </button>

                      {/* DECLINE */}

                      <button
                        onClick={async () => {

                          try {

                            await fetch(
                              "/api/remove-friend-request",
                              {
                                method:
                                  "POST",

                                headers: {
                                  "Content-Type":
                                    "application/json",
                                },

                                body:
                                  JSON.stringify({
                                    requestId:
                                      user._id,
                                  }),
                              }
                            );

                            setIncomingRequests(
                              (prev) =>
                                prev.filter(
                                  (r) =>
                                    r._id !==
                                    user._id
                                )
                            );

                          } catch (err) {

                            console.log(err);

                          }

                        }}

                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          font-bold
                          flex
                          items-center
                          justify-center
                        "
                      >

                        ✕

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
