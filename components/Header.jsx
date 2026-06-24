export default function Header({
  username,
  userId,
}) {

  return (

    <div className="chat-header">

      <div className="logo-wrap">

        <div className="logo-circle">
          B
        </div>

        <div>

          <div className="logo-title">
            BlueChat
          </div>

          <div className="text-xs opacity-70">
            Live Community Chat
          </div>

        </div>

      </div>

      <div className="user-tag">
        {username} {userId}
      </div>

    </div>

  );

}
