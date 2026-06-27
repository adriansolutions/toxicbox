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
  const [toast, setToast] = useState(null);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2500);
  };

  // LOAD REQUESTS FROM MONGODB (FIXED)
  const loadRequests = async () => {
    if (!currentUser?.userId) return;

    try {
      const res = await fetch(
        `/api/friends/requests?userId=${currentUser.userId}`
      );

      const data = await res.json();

      if (data.success) {
        setIncomingRequests(data.requests || []);
      } else {
        setIncomingRequests([]);
      }
    } catch (err) {
      console.log("loadRequests error:", err);
      setIncomingRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();

    const interval = setInterval(loadRequests, 2000);

    return () => clearInterval(interval);
  }, [currentUser?.userId]);

  // SEARCH USER
  const searchUser = async () => {
    if (!search.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/search-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "User not found", "error");
        setResults([]);
        return;
      }

      if (data.user.userId === currentUser.userId) {
        showToast("You cannot add yourself", "error");
        setResults([]);
        return;
      }

      setResults([data.user]);
    } catch (err) {
      console.log(err);
      showToast("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // SEND REQUEST (FIXED API ONLY)
  const addFriend = async (user) => {
    try {
      const res = await fetch("/api/friends/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUser.userId,
          toUserId: user.userId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Failed to send request", "error");
        return;
      }

      showToast("Friend request sent");

      setSearch("");
      setResults([]);
    } catch (err) {
      console.log(err);
      showToast("Server error", "error");
    }
  };

  // ACCEPT REQUEST
  const acceptRequest = async (user) => {
    try {
      const res = await fetch("/api/friends/accept-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: currentUser.userId,
          fromUserId: user.userId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Failed", "error");
        return;
      }

      setFriends((prev) => [...prev, user]);

      setIncomingRequests((prev) =>
        prev.filter((r) => r.userId !== user.userId)
      );

      setActiveChat({
        type: "dm",
        id: user.userId,
        user,
      });

      showToast("Friend accepted");

      setTimeout(close, 700);
    } catch (err) {
      console.log(err);
      showToast("Error accepting request", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-white font-bold ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="w-full max-w-md bg-white dark:bg-[#1e1f22] rounded-3xl p-5">

        {/* SEARCH */}
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user..."
            className="flex-1 h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#383a40]"
          />

          <button
            onClick={searchUser}
            disabled={loading}
            className="px-4 bg-blue-600 text-white rounded-xl"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {/* RESULTS */}
        <div className="mt-5 space-y-3">
          {results.map((user) => (
            <div key={user.userId} className="flex items-center gap-3">
              <div className="flex-1 font-bold">{user.username}</div>
              <button
                onClick={() => addFriend(user)}
                className="bg-blue-600 text-white px-3 py-2 rounded-xl"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* REQUESTS */}
        <div className="mt-8">
          <div className="font-bold mb-3">
            Incoming Friend Requests
          </div>

          {incomingRequests.length === 0 ? (
            <div className="opacity-60 text-sm">
              No requests
            </div>
          ) : (
            incomingRequests.map((user) => (
              <div key={user.userId} className="flex items-center gap-3">
                <div className="flex-1">{user.username}</div>
                <button
                  onClick={() => acceptRequest(user)}
                  className="bg-green-600 text-white px-3 py-2 rounded-xl"
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
