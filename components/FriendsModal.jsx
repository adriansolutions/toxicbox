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

// LOAD REQUESTS
useEffect(() => {

const saved =
  localStorage.getItem(
    `bluechat-requests-${currentUser.userId}`
  );

if (saved) {

  setIncomingRequests(
    JSON.parse(saved)
  );

}

}, [currentUser.userId]);

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

  if (!data.success) {

    setResults([]);

    alert(
      data.message ||
      "User not found"
    );

    return;

  }

  // BLOCK SELF
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

// SEND REQUEST
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
    "Already friends"
  );

  return;

}

// SAVE REQUEST TO TARGET USER
const existing =
  JSON.parse(
    localStorage.getItem(
      `bluechat-requests-${user.userId}`
    ) || "[]"
  );

const alreadyRequested =
  existing.find(
    (r) =>
      r.userId ===
      currentUser.userId
  );

if (
  alreadyRequested
) {

  alert(
    "Friend request already sent"
  );

  return;

}

const updatedRequests = [
  ...existing,

  {
    username:
      currentUser.username,

    userId:
      currentUser.userId,

    avatar:
      currentUser.avatar || "",
  },
];

localStorage.setItem(
  `bluechat-requests-${user.userId}`,
  JSON.stringify(updatedRequests)
);

alert(
  "Friend request sent"
);

};

// ACCEPT REQUEST
const acceptRequest = (
user
) => {

// ADD TO MY FRIENDS
const updatedFriends = [
  ...friends,
  user,
];

setFriends(
  updatedFriends
);

localStorage.setItem(
  `bluechat-friends-${currentUser.userId}`,
  JSON.stringify(updatedFriends)
);

// REMOVE REQUEST
const updatedRequests =
  incomingRequests.filter(
    (r) =>
      r.userId !==
      user.userId
  );

setIncomingRequests(
  updatedRequests
);

localStorage.setItem(
  `bluechat-requests-${currentUser.userId}`,
  JSON.stringify(updatedRequests)
);

// ALSO ADD YOU TO THEIR FRIENDS
const theirFriends =
  JSON.parse(
    localStorage.getItem(
      `bluechat-friends-${user.userId}`
    ) || "[]"
  );

const already =
  theirFriends.find(
    (f) =>
      f.userId ===
      currentUser.userId
  );

if (!already) {

  theirFriends.push({
    username:
      currentUser.username,

    userId:
      currentUser.userId,

    avatar:
      currentUser.avatar || "",
  });

  localStorage.setItem(
    `bluechat-friends-${user.userId}`,
    JSON.stringify(theirFriends)
  );

}

// OPEN DM
setActiveChat({
  type: "dm",
  id: user.userId,
  user,
});

alert(
  "Friend request accepted"
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

          Friends

        </h2>

        <p className="text-sm opacity-60">

          Add and accept friends

        </p>

      </div>

      <button
        onClick={close}
        className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10"
      >
        ✕
      </button>

    </div>

    <div className="p-5">

      {/* SEARCH */}

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

      {/* SEARCH RESULTS */}

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

          {incomingRequests.length ===
            0 && (

            <div className="text-sm opacity-60">

              No requests

            </div>

          )}

          {incomingRequests.map(
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

                <div className="flex-1">

                  <div className="font-bold">

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

                <button
                  onClick={() =>
                    acceptRequest(
                      user
                    )
                  }
                  className="
                    px-4
                    h-10
                    rounded-xl
                    bg-green-600
                    text-white
                    font-bold
                  "
                >

                  Accept

                </button>

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
