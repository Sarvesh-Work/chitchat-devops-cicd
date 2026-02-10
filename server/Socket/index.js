import { v4 as uuid } from "uuid";
import { userSocketId } from "../app.js";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
  UPDATE_LAST_MESSAGE,
} from "../constants/index.js";
import { Message } from "../models/message.models.js";
import { ErrorHandler, getSocketIds } from "../utils/feature.js";

const onlineUsers = new Set();
function setupSocketEvents(io) {
  io.on("connection", (socket) => {
    const user = socket.user;
    const userId = user._id.toString();

    userSocketId.set(user._id.toString(), socket.id);

    socket.on(NEW_MESSAGE, async ({ chatId, message, members, time }) => {
      try {
        const messageForRealTime = {
          content: message,
          _id: uuid(),
          sender: { _id: userId, name: user.name },
          chat: chatId,
          createdAt: new Date().toISOString(),
        };

        const messageForDb = {
          sender: userId,
          content: message,
          chat: chatId,
        };

        const membersSocketIds = getSocketIds(members);

        io.to(membersSocketIds).emit(NEW_MESSAGE, {
          chatId,
          message: messageForRealTime,
        });
        io.to(membersSocketIds).emit(NEW_MESSAGE_ALERT, { chatId });
        io.to(membersSocketIds).emit(UPDATE_LAST_MESSAGE, {
          chatId,
          message,
          time,
        });
        await Message.create(messageForDb);
      } catch (error) {
        console.error("Error saving message to database", error);
        socket.emit(
          "error",
          new ErrorHandler("Error sending new message", 400)
        );
      }
    });

    socket.on(START_TYPING, ({ members, chatId }) => {
      const membersSockets = getSocketIds(members);

      socket.to(membersSockets).emit(START_TYPING, { chatId });
    });

    socket.on(STOP_TYPING, ({ members, chatId }) => {
      const membersSockets = getSocketIds(members);

      socket.to(membersSockets).emit(STOP_TYPING, { chatId });
    });

    socket.on(CHAT_JOINED, ({ userId, members }) => {
      onlineUsers.add(userId.toString());

      const membersSocket = getSocketIds(members);
      io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on(CHAT_LEAVED, ({ userId, members }) => {
      onlineUsers.delete(userId.toString());

      const membersSocket = getSocketIds(members);
      io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
      userSocketId.delete(user._id.toString());
      onlineUsers.delete(user._id.toString());
      socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
    });
  });
}

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSocketIds(users);
  io.to(usersSocket).emit(event, data);
};

export { emitEvent, setupSocketEvents };
