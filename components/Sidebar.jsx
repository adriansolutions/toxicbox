"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  FiMenu,
  FiSettings,
  FiX,
  FiUserPlus,
} from "react-icons/fi";

import SettingsModal from "./SettingsModal";
import FriendsModal from "./FriendsModal";
import ProfileModal from "./ProfileModal";

export default function Sidebar(props) {

const [openSettings, setOpenSettings] =
useState(false);

const [mobileOpen, setMobileOpen] =
useState(false);

const [openFriends, setOpenFriends] =
useState(false);

const [openProfile, setOpenProfile] =
useState(false);

// FIXED CRASH
const [userData, setUserData] =
useState({
username: props.username,
userId: props.userId,
avatar: props.avatar,
banner: props.banner,
bio: props.bio,
hometown: props.hometown,
birthday: props.birthday,
status: props.status,
language: props.language,
gender: props.gender,
work: props.work,
education: props.education,
hobbies: props.hobbies,
});

// =========================
// LOAD USER DATA
// =========================

useEffect(() => {

  const localUser =
    localStorage.getItem(
      "bluechat-user"
    );

  if (localUser) {

    try {

      const parsed =
        JSON.parse(localUser);

      setUserData({
        username:
          parsed.username ||
          props.username,

        userId:
          parsed.userId ||
          props.userId,

        avatar:
          parsed.avatar ||
          "",

        banner:
          parsed.banner ||
          "",

        bio:
          parsed.bio ||
          "",

        hometown:
          parsed.hometown ||
          "",

        birthday:
          parsed.birthday ||
          "",

        status:
          parsed.status ||
          "",

        language:
          parsed.language ||
          "",

        gender:
          parsed.gender ||
          "",

        work:
          parsed.work ||
          "",

        education:
          parsed.education ||
          "",

        hobbies:
          parsed.hobbies ||
          "",
      });

    } catch (err) {

      console.log(err);

    }

  }

}, []);

const friends =
props.friends || [];

const [friendMenu, setFriendMenu] =
useState(null);

const [confirmRemove, setConfirmRemove] =
useState(null);

const holdTimeout =
useRef(null);

// =========================
// CHANGE CHAT
// =========================

const changeChat =
(chat) => {

props.setActiveChat(chat);

setMobileOpen(false);

};

// =========================
// REMOVE FRIEND
// =========================

const removeFriend =
async (friend) => {

try {

const res =
await fetch(
"/api/remove-friend",
{
method: "POST",

headers: {
"Content-Type":
"application/json",
},

body:
JSON.stringify({
userId:
props.userId,

friendId:
friend.userId,
}),
}
);

const data =
await res.json();

if (!data.success) {

alert(
data.message ||
"Failed to remove friend"
);

return;

}

props.setFriends((prev) =>
prev.filter(
(f) =>
f.userId !==
friend.userId
)
);

if (
props.activeChat?.id ===
friend.userId
) {

props.setActiveChat({
type: "channel",
id: "general",
name: "General",
});

}

setConfirmRemove(null);

} catch (err) {

console.log(err);

}

};

return (

<>

<button
onClick={() =>
setMobileOpen(
!mobileOpen
)
}

className="
fixed
top-4
left-4
z-[9999]
w-[48px]
h-[48px]
rounded-2xl
bg-black/70
text-white
flex
items-center
justify-center
md:hidden
backdrop-blur-xl
"
>

{mobileOpen ? (
<FiX size={24} />
) : (
<FiMenu size={24} />
)}

</button>

<div
className={`
sidebar-glass
fixed
md:relative
top-0
left-0
z-[9998]
h-screen
transition-all
duration-300
flex
flex-col
justify-between

${
mobileOpen
? "translate-x-0"
: "-translate-x-full md:translate-x-0"
}
`}
>

<div>

<button
onClick={() =>
setOpenProfile(true)
}

className="
w-full
flex
items-center
gap-3
mt-20
md:mt-0
px-4
py-3
hover:bg-white/5
transition
"
>

{userData.avatar ? (

<img
src={userData.avatar}
className="
w-14
h-14
rounded-full
object-cover
border-2
border-white/10
"
/>

) : (

<div className="
w-14
h-14
rounded-full
bg-blue-600
text-white
flex
items-center
justify-center
font-bold
text-xl
">

{userData.username
?.charAt(0)
?.toUpperCase()}

</div>

)}

<div className="flex-1 text-left min-w-0">

<div className="font-bold truncate">

{userData.username}

</div>

<div className="text-xs opacity-60 truncate">

{userData.userId}

</div>

</div>

</button>

<div className="flex items-center gap-3 px-4 mt-3">

<div className="logo-circle">
B
</div>

<div className="channel-name text-xl font-bold">
BlueChat
</div>

</div>

<div className="channels">

<button
onClick={() =>
changeChat({
type: "channel",
id: "general",
name: "General",
})
}

className={`
channel
${
props.activeChat?.id ===
"general"
? "active"
: ""
}
`}
>

<div className="channel-icon">
G
</div>

<div className="channel-name">
General
</div>

</button>

</div>

<div className="mt-5 px-3">

<div className="h-[1px] bg-white/10 mb-3 rounded-full" />

<div className="space-y-2">

{friends.length === 0 && (

<div className="text-xs opacity-50 px-2 py-2">

No friends yet

</div>

)}

{friends.map((friend) => (

<div
key={friend.userId}
className="relative"

onContextMenu={(e) => {

e.preventDefault();

setFriendMenu({
x: e.clientX,
y: e.clientY,
friend,
});

}}

onTouchStart={(e) => {

const touch =
e.touches[0];

holdTimeout.current =
setTimeout(() => {

setFriendMenu({
x: touch.clientX,
y: touch.clientY,
friend,
});

}, 500);

}}

onTouchEnd={() => {

clearTimeout(
holdTimeout.current
);

}}
>

<button
onClick={() =>
changeChat({
type: "dm",
id: friend.userId,
user: friend,
})
}

className={`
channel
${
props.activeChat?.id ===
friend.userId
? "active"
: ""
}
`}
>

{friend.avatar ? (

<img
src={friend.avatar}
className="
avatar
object-cover
"
/>

) : (

<div className="avatar">

{friend.username
?.charAt(0)
?.toUpperCase()}

</div>

)}

<div className="channel-name truncate">

{friend.username}

</div>

</button>

</div>

))}

</div>

</div>

</div>

<div className="flex flex-col items-center gap-3 p-4">

<button
onClick={() =>
setOpenFriends(true)
}

className="sidebar-btn"
>

<FiUserPlus size={22} />

</button>

<button
onClick={() =>
setOpenSettings(true)
}

className="sidebar-btn"
>

<FiSettings size={22} />

</button>

</div>

</div>

{/* RIGHT CLICK MENU */}

{friendMenu && (

  <>

    <div
      onClick={() =>
        setFriendMenu(null)
      }

      className="fixed inset-0 z-[9998]"
    />

    <div
  className="
    fixed
    z-[9999]
    w-[200px]
    rounded-2xl
    bg-[#1e1f22]
    border
    border-white/10
    shadow-2xl
    overflow-hidden
  "
  style={{
    left: friendMenu.x,
    top: friendMenu.y,
  }}
>

  {/* VIEW PROFILE */}

  <button
    onClick={() => {

      props.setViewingProfile?.(
        friendMenu.friend
      );

      setFriendMenu(null);

    }}
    className="
      w-full
      px-4
      py-3
      text-left
      hover:bg-white/10
      text-white
      transition
    "
  >
    View Profile
  </button>

  {/* REMOVE FRIEND */}

  <button
    onClick={() => {

      setConfirmRemove(
        friendMenu.friend
      );

      setFriendMenu(null);

    }}
    className="
      w-full
      px-4
      py-3
      text-left
      hover:bg-red-500/20
      text-red-400
      transition
    "
  >
    Remove Friend
  </button>

</div>

  </>

)}

{/* CONFIRM REMOVE */}

{confirmRemove && (

  <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="
      w-full
      max-w-sm
      rounded-3xl
      bg-white
      dark:bg-[#1e1f22]
      border
      border-white/10
      p-6
    ">

      <div className="text-xl font-black mb-2">

        Remove Friend

      </div>

      <div className="opacity-70 text-sm mb-6">

        Remove{" "}
        <strong>

          {confirmRemove.username}

        </strong>{" "}
        from your friends list?

      </div>

      <div className="flex gap-3">

        <button
          onClick={() =>
            setConfirmRemove(null)
          }

          className="
            flex-1
            h-12
            rounded-2xl
            bg-white/10
          "
        >

          Cancel

        </button>

        <button
          onClick={() =>
            removeFriend(
              confirmRemove
            )
          }

          className="
            flex-1
            h-12
            rounded-2xl
            bg-red-500
            text-white
            font-bold
          "
        >

          Remove

        </button>

      </div>

    </div>

  </div>

)}

{openProfile && (

<ProfileModal

updateProfile={async (newData) => {

  // UPDATE SIDEBAR
  setUserData((prev) => ({
    ...prev,
    ...newData,
  }));

  // UPDATE MAIN USER
  if (props.setCurrentUser) {

    props.setCurrentUser((prev) => ({
      ...prev,
      ...newData,
    }));

  }

  // UPDATE LOCAL STORAGE
  try {

    const oldUser =
      JSON.parse(
        localStorage.getItem(
          "bluechat-user"
        ) || "{}"
      );

    const updatedUser = {
      ...oldUser,
      ...newData,
    };

    localStorage.setItem(
      "bluechat-user",
      JSON.stringify(updatedUser)
    );

  } catch (err) {

    console.log(err);

  }

  // SAVE TO DATABASE
  try {

    await fetch(
      "/api/update-profile",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          userId:
            props.userId,

          ...newData,
        }),
      }
    );

  } catch (err) {

    console.log(
      "PROFILE SAVE ERROR:",
      err
    );

  }

}}

close={() =>
setOpenProfile(false)
}

currentUser={{
username:
userData.username,

userId:
userData.userId,

avatar:
userData.avatar,
}}

profile={{
username:
userData.username,

userId:
userData.userId,

avatar:
userData.avatar,

banner:
userData.banner || "",

bio:
userData.bio || "",

hometown:
userData.hometown || "",

birthday:
userData.birthday || "",

status:
userData.status || "",

language:
userData.language || "",

work:
userData.work || "",

education:
userData.education || "",

hobbies:
userData.hobbies || "",

gender:
userData.gender || "",

friends:
friends,
}}

/>

)}

{/* MOBILE BG */}

{mobileOpen && (

  <div
    onClick={() =>
      setMobileOpen(false)
    }

    className="
      fixed
      inset-0
      bg-black/50
      z-[9997]
      md:hidden
    "
  />

)}

{/* FRIENDS MODAL */}

{openFriends && (

  <FriendsModal
    close={() =>
      setOpenFriends(false)
    }

    currentUser={{
      username:
        props.username,

      userId:
        props.userId,

      avatar:
        props.avatar,
    }}

    friends={friends}

    setFriends={
      props.setFriends
    }

    setActiveChat={
      props.setActiveChat
    }
  />

)}

{/* SETTINGS */}

{openSettings && (

  <SettingsModal
    {...props}

    close={() =>
      setOpenSettings(false)
    }
  />

)}

</>

);

}
