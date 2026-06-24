import { Server } from "socket.io";

export async function GET(req) {
  if (!global.io) {
    console.log("Socket.IO started");

    global.io = new Server(3001, {
      cors: {
        origin: "*",
      },
    });

    global.io.on("connection", (socket) => {
      console.log("User Connected");

      socket.on("send-message", (message) => {
        global.io.emit("receive-message", message);
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected");
      });
    });
  }

  return Response.json({
    success: true,
  });
}
