"use client";

import { useState } from "react";

export default function Login({
setUser,
openRegister,
}) {

const [username, setUsername] =
useState("");

const [password, setPassword] =
useState("");

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState("");

const [rememberMe, setRememberMe] =
useState(true);

const login = async () => {

setError("");

if (
  !username ||
  !password
) {
  setError(
    "Fill all fields"
  );
  return;
}

try {

  setLoading(true);

  const res =
    await fetch(
      "/api/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

  const data =
    await res.json();

  if (!data.success) {

    setError(
      data.message
    );

    setLoading(false);

    return;

  }

  if (rememberMe) {

    localStorage.setItem(
      "bluechat-user",
      JSON.stringify(
        data.user
      )
    );

    localStorage.setItem(
      "bluechat-token",
      data.token
    );

  }

  setUser(data.user);

} catch {

  setError(
    "Login failed"
  );

}

setLoading(false);

};

return (

<div className="login-screen">

  <div className="login-box">

    <h1 className="text-3xl font-bold mb-2">

      BlueChat

    </h1>

    <p className="opacity-70 mb-6">

      Login to continue

    </p>

    {error && (

      <div className="mb-4 text-red-500 text-sm">

        {error}

      </div>

    )}

    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) =>
        setUsername(
          e.target.value
        )
      }
      className="login-input mb-4"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) =>
        setPassword(
          e.target.value
        )
      }
      className="login-input"
    />

    <label className="flex items-center gap-2 mt-4 text-sm">

      <input
        type="checkbox"
        checked={rememberMe}
        onChange={() =>
          setRememberMe(
            !rememberMe
          )
        }
      />

      Remember me

    </label>

    <button
      onClick={login}
      className="login-btn"
    >

      {loading
        ? "Loading..."
        : "Login"}

    </button>

    <button
      onClick={openRegister}
      className="w-full mt-4 text-sm opacity-70"
    >

      Create Account

    </button>

  </div>

</div>

);

}
