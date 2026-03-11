import PropTypes from "prop-types";
import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { server } from "../constants/config";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io("/", {
        withCredentials: true,
        transports: ["websocket"],
      }),
    [],
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node,
};
