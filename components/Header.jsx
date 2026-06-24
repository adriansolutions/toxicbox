export default function Header({
  username,
  userId,
}) {
  return (
    <div className="h-[70px] bg-white dark:bg-gray-800 border-b flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold">
        BlueChat
      </h1>

      <div className="font-semibold">
        {username} {userId}
      </div>
    </div>
  );
}
