import { Server } from "socket.io";

let io = null;
export const establishConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  return io;
};

export const getSocket = () => io;
