import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events";
import { resetUserTyping, setUserTyping } from "../redux/reducers/chatReducer";
import { useSocket } from "../socket/socket";

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

const useChatSocket = ({ chatId, members, setMessages, setValue }) => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const typingTimeout = useRef(null);
  const [IamTyping, setIamTyping] = useState(false);

  const onSubmit = (data) => {
    socket.emit(NEW_MESSAGE, {
      chatId,
      members,
      message: data.message,
      time: Date.now(),
    });
    setValue("message", "");
  };

  const onChangeMessage = useCallback(() => {
    if (socket?.connected) {
      if (!IamTyping) {
        socket.emit(START_TYPING, { members, chatId });
        setIamTyping(true);
      }

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        socket.emit(STOP_TYPING, { members, chatId });
        setIamTyping(false);
      }, 2000);
    }
  }, [IamTyping, members, socket]);

  const handleNewMessageListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId, setMessages]
  );

  const startTypingListener = (data) => {
    dispatch(setUserTyping(data));
  };

  const stopTypingListener = () => {
    dispatch(resetUserTyping());
  };

  useSocketEvents(socket, {
    [NEW_MESSAGE]: handleNewMessageListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  });

  return { onSubmit, onChangeMessage };
};

export { useChatSocket, useSocketEvents };
