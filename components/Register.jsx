"use client";

import { useState } from "react";

export default function Register({
setUser,
openLogin,
}) {

const [username, setUsername] =
useState("");

const [password, setPassword] =
useState("");

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState("");

const [suggestions,
setSuggestions] =
useState([]);

const register =
async () => {

  setError("");

  if (
    password.length < 6
  ) {

    setError(
      "Password too short"
    );

    return;

  }

  try {

    setLoading(true);

    const res =
      await fetch(
        "/api/register",
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

      setSuggestions(
        data.suggestions ||
        []
      );

      setLoading(false);

      return;

    }

    localStorage.setItem(
      "bluechat-user",
      JSON.stringify(
        data.user
      )
    );

    setUser(data.user);

  } catch {

    setError(
      "Register failed"
    );

  }

  setLoading(false);

};

return (

<div className="login-screen">

  <div className="login-box">

    <h1 className="text-3xl font-bold mb-2">

      Create Account

    </h1>

    <p className="opacity-70 mb-6">

      Join BlueChat

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

    {suggestions.length >
      0 && (

      <div className="mb-4 flex flex-wrap gap-2">

        {suggestions.map(
          (name) => (

            <button
              key={name}
              onClick={() =>
                setUsername(
                  name
                )
              }
              className="px-3 py-2 rounded-xl bg-black/10 dark:bg-white/10 text-sm"
            >

              {name}

            </button>

          )
        )}

      </div>

    )}

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

    <div className="mt-3 text-sm opacity-70">

      Suggestion:
      Use uppercase,
      lowercase,
      numbers,
      symbols.

    </div>

    <button
      onClick={register}
      className="login-btn"
    >

      {loading
        ? "Loading..."
        : "Create Account"}

    </button>

    <button
      onClick={openLogin}
      className="w-full mt-4 text-sm opacity-70"
    >

      Already have account?

    </button>

  </div>

</div>

);

}
