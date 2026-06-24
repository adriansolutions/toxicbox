export default function SettingsModal({
  close,
  darkMode,
  setDarkMode,
  themeColor,
  setThemeColor,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-[90%] max-w-md p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Settings
          </h2>

          <button onClick={close}>
            ✕
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span>Dark Mode</span>

          <input
            type="checkbox"
            checked={darkMode}
            onChange={() =>
              setDarkMode(!darkMode)
            }
          />
        </div>

        <div>
          <span>Theme Color</span>

          <input
            type="color"
            className="w-full mt-3 h-12"
            value={themeColor}
            onChange={(e) =>
              setThemeColor(e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
}
