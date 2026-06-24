export default function Header({
  username,
  userId,
}) {

  return (

    <div className="chat-header h-[75px] px-6 flex items-center justify-between border-b border-white/10">

      <div>

        <h1 className="text-2xl font-black text-blue-600 tracking-tight">
          BlueChat
        </h1>

        <p className="text-xs opacity-70">
          Modern realtime messaging
        </p>

      </div>

      <div className="flex items-center gap-3">

        <div className="user-avatar w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg">

          {username?.charAt(0).toUpperCase()}

        </div>

        <div>

          <div className="font-semibold leading-none">
            {username}
          </div>

          <div className="text-xs opacity-60 mt-1">
            {userId}
          </div>

        </div>

      </div>

    </div>

  );

}
