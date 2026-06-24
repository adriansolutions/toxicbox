export default function Header({
  username,
  userId,
}) {

  return (

    <div
      className="
        chat-header
        pt-[max(18px,env(safe-area-inset-top))]
      "
    >

      <div className="logo-wrap ml-14 md:ml-0">

        <div className="logo-circle">
          B
        </div>

        <div>

          <div className="logo-title">
            toxicbox
          </div>

          <div className="text-xs opacity-60">
            Realtime Chat
          </div>

        </div>

      </div>

      <div className="user-tag">

        {username}
        {" "}
        {userId}

      </div>

    </div>

  );

}
