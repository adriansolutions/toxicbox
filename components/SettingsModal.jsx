export default function SettingsModal({
  close,
  darkMode,
  setDarkMode,
  themeColor,
  setThemeColor,
}) {

  return (

    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1e1f22] shadow-2xl border border-white/10 overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-black">
              Settings
            </h2>

            <p className="text-sm opacity-60 mt-1">
              Customize your chat
            </p>

          </div>

          <button
            onClick={close}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#383a40] hover:scale-105 transition"
          >
            ✕
          </button>

        </div>

        <div className="p-6 space-y-8">

          <div className="flex items-center justify-between">

            <div>

              <div className="font-semibold">
                Dark Mode
              </div>

              <div className="text-sm opacity-60">
                Toggle dark appearance
              </div>

            </div>

            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`w-16 h-9 rounded-full transition relative
              ${
                darkMode
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >

              <div
                className={`absolute top-1 w-7 h-7 rounded-full bg-white transition
                ${
                  darkMode
                    ? "left-8"
                    : "left-1"
                }`}
              />

            </button>

          </div>

          <div>

            <div className="font-semibold mb-3">
              Theme Color
            </div>

            <input
              type="color"
              value={themeColor}
              onChange={(e) =>
                setThemeColor(
                  e.target.value
                )
              }
              className="w-full h-16 rounded-2xl border-none cursor-pointer bg-transparent"
            />

          </div>

        </div>

      </div>

    </div>

  );

}
