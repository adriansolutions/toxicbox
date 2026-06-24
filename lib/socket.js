"use client";

import { io } from "socket.io-client";

const socket = io("https://bluechat-server-v3d6.onrender.com");

export default socket;
