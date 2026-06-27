"use client";

import { useEffect, useState } from "react";

export default function FriendsModal({
  close,
  currentUser,
  friends,
  setFriends,
  setActiveChat,
}) {

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);

  // =========================
  // LOAD REQUESTS
  // =========================
  const loadRequests = async () => {

    try {

      const res = await fetch(
        `/api/get-friend-requests?userId=${currentUser.userId}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.success) {

        setIncomingRequests(data.requests || []);

      }

    } catch (err) {

      console.log(err);

    }

  };

  // =========================
  // LOAD FRIENDS
  // =========================
  const loadFriends = async () => {

    try {

      const res = await fetch(
        `/api/get-friends?userId=${currentUser.userId}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.success) {

        setFriends(data.friends || []);

      }

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    if (!currentUser?.userId) return;

    loadRequests();
    loadFriends();

    const interval = setInterval(() => {

      loadRequests();
      loadFriends();

    }, 3000);

    return () => clearInterval(interval);

  }, [currentUser?.userId]);

  // =========================
  // SEARCH USER
  // =========================
  const searchUser = async () => {

    if (!search.trim()) return;

    try {

      setLoading(true);

      const res = await fetch(
        "/api/search-user",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            search,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {

        alert(
          data.message || "User not found"
        );

        setResults([]);

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

      setResults([data.user]);

    } catch (err) {

      console.log(err);

      alert("Search failed");

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // SEND REQUEST
  // =========================
  const addFriend = async (user) => {

    try {

      const res = await fetch(
        "/api/send-friend-request",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            fromUserId:
              currentUser.userId,

            fromUsername:
              currentUser.username,

            fromAvatar:
              currentUser.avatar || "",

            toUserId:
              user.userId,

          }),
        }
      );

      const data = await res.json();

      if (!data.success) {

        alert(
          data.message ||
          "Failed to send request"
        );

        return;

      }

      alert("Friend request sent");

      setSearch("");
      setResults([]);

    } catch (err) {

      console.log(err);

      alert("Server error");

    }

  };

  // =========================
  // ACCEPT REQUEST
  // =========================
  const acceptRequest = async (request) => {

    try {

      const res = await fetch(
        "/api/accept-friend-requests",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            currentUserId:
              currentUser.userId,

            fromUserId:
              request.fromUserId,

          }),
        }
      );

      const data = await res.json();

      console.log("ACCEPT DATA:", data);

      if (!data.success) {

        alert(
          data.message ||
          "Failed to accept"
        );

        return;

      }

      const newFriend = {

        username:
          request.fromUsername,

        userId:
          request.fromUserId,

        avatar:
          request.fromAvatar || "",

      };

      // UPDATE SIDEBAR
      setFriends((prev) => {

        const exists = prev.find(
          (f) =>
            f.userId ===
            newFriend.userId
        );

        if (exists) return prev;

        return [
          ...prev,
          newFriend,
        ];

      });

      // REMOVE REQUEST
      setIncomingRequests((prev) =>
        prev.filter(
          (r) =>
            r._id !== request._id
        )
      );

      // FORCE RELOAD FRIENDS FROM DB
      await loadFriends();

      // OPEN CHAT
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

      alert("Server error");

    }

  };

  // =========================
  // DECLINE REQUEST
  // =========================
  const declineRequest = async (requestId) => {

    try {

      await fetch(
        "/api/remove-friend-request",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            requestId,
          }),
        }
      );

      setIncomingRequests((prev) =>
        prev.filter(
          (r) =>
            r._id !== requestId
        )
      );

    } catch (err) {

      console.log(err);

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
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

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
              onClick={searchUser}
              disabled={loading}
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
              {loading ? "..." : "Search"}
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}
