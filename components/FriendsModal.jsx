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
            `/api/get-friend-requests?userId=${currentUser.userId}`,
            {
              cache:
                "no-store",
            }
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

          setIncomingRequests(
            []
          );

        }

      } catch (
        err
      ) {

        console.log(
          err
        );

        setIncomingRequests(
          []
        );

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

              headers:
                {
                  "Content-Type":
                    "application/json",
                },

              body:
                JSON.stringify(
                  {
                    search,
                  }
                ),
            }
          );

        const data =
          await res.json();

        if (
          !data.success
        ) {

          setResults(
            []
          );

          alert(
            data.message ||
              "User not found"
          );

          return;

        }

        // BLOCK SELF
        if (
          data.user
            .userId ===
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

      } catch (
        err
      ) {

        console.log(
          err
        );

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
    async (
      user
    ) => {

      try {

        const res =
          await fetch(
            "/api/send-friend-request",
            {
              method:
                "POST",

              headers:
                {
                  "Content-Type":
                    "application/json",
                },

              body:
                JSON.stringify(
                  {
                    fromUserId:
                      currentUser.userId,

                    fromUsername:
                      currentUser.username,

                    fromAvatar:
                      currentUser.avatar ||
                      "",

                    toUserId:
                      user.userId,
                  }
                ),
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

        setSearch(
          ""
        );

        setResults(
          []
        );

      } catch (
        err
      ) {

        console.log(
          err
        );

        alert(
          "Server error"
        );

      }

    };

  // =========================
  // ACCEPT REQUEST
  // =========================
  const acceptRequest =
    async (
      request
    ) => {

      try {

        const friendUser =
          {
            username:
              request.fromUsername,

            userId:
              request.fromUserId,

            avatar:
              request.fromAvatar ||
              "",
          };

        const res =
          await fetch(
            "/api/accept-friend-requests",
            {
              method:
                "POST",

              headers:
                {
                  "Content-Type":
                    "application/json",
                },

              body:
                JSON.stringify(
                  {
                    currentUserId:
                      currentUser.userId,

                    currentUsername:
                      currentUser.username,

                    currentAvatar:
                      currentUser.avatar ||
                      "",

                    fromUserId:
                      request.fromUserId,

                    fromUsername:
                      request.fromUsername,

                    fromAvatar:
                      request.fromAvatar ||
                      "",
                  }
                ),
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

        // UPDATE SIDEBAR
        setFriends(
          (
            prev
          ) => [

            ...prev,

            friendUser,

          ]
        );

        // REMOVE REQUEST UI
        setIncomingRequests(
          (
            prev
          ) =>
            prev.filter(
              (
                r
              ) =>
                r._id !==
                request._id
            )
        );

        // OPEN DM
        setActiveChat(
          {
            type:
              "dm",

            id:
              friendUser.userId,

            user:
              friendUser,
          }
        );

        close();

      } catch (
        err
      ) {

        console.log(
          err
        );

        alert(
          "Server error"
        );

      }

    };

  // =========================
  // DECLINE REQUEST
  // =========================
  const declineRequest =
    async (
      requestId
    ) => {

      try {

        await fetch(
          "/api/remove-friend-request",
          {
            method:
              "POST",

            headers:
              {
                "Content-Type":
                  "application/json",
              },

            body:
              JSON.stringify(
                {
                  requestId,
                }
              ),
          }
        );

        setIncomingRequests(
          (
            prev
          ) =>
            prev.filter(
              (
                r
              ) =>
                r._id !==
                requestId
            )
        );

      } catch (
        err
      ) {

        console.log(
          err
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
            onClick={
              close
            }
            className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10"
          >

            ✕

          </button>

        </div>

        <div className="p-5">

          {/* SEARCH */}

          <div className="flex gap-2">

            <input
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
              onKeyDown={(
                e
              ) => {

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
                h-12
                px-5
                rounded-2xl
                bg-blue-600
                text-white
                font-bold
                shrink-0
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
              (
                user
              ) => (

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
                        shrink-0
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
                      shrink-0
                    ">

                      {user.username
                        ?.charAt(
                          0
                        )
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

                  {/* BUTTON */}

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

          {/* REQUESTS */}

          <div className="mt-8">

            <div className="font-bold mb-3">

              Incoming Friend Requests

            </div>

            <div className="space-y-3">

              {incomingRequests
                .length ===
                0 && (

                <div className="text-sm opacity-60">

                  No requests

                </div>

              )}

              {incomingRequests.map(
                (
                  request
                ) => (

                  <div
                    key={
                      request._id
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

                    {request.fromAvatar ? (

                      <img
                        src={
                          request.fromAvatar
                        }
                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                          shrink-0
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
                        shrink-0
                      ">

                        {request.fromUsername
                          ?.charAt(
                            0
                          )
                          ?.toUpperCase()}

                      </div>

                    )}

                    {/* INFO */}

                    <div className="flex-1 min-w-0">

                      <div className="font-bold truncate">

                        {
                          request.fromUsername
                        }

                      </div>

                      <div className="text-sm opacity-60 truncate">

                        {
                          request.fromUserId
                        }

                      </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="flex gap-2 shrink-0">

                      <button
                        onClick={() =>
                          acceptRequest(
                            request
                          )
                        }
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-green-600
                          text-white
                          font-bold
                        "
                      >

                        ✓

                      </button>

                      <button
                        onClick={() =>
                          declineRequest(
                            request._id
                          )
                        }
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-red-600
                          text-white
                          font-bold
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
