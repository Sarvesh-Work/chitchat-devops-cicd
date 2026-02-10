import { Drawer, Grid } from "@mui/material";
import { lazy, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
  UPDATE_LAST_MESSAGE,
} from "../../constants/events";
import { useErrors } from "../../hooks/hooks";
import { useSocketEvents } from "../../hooks/socketHooks";
import { getOrSaveFromStorage } from "../../lib/features";
import { useFetchChatsQuery } from "../../redux/apis/apiRtk";
import {
  setNewMessagesAlert,
  setNotificationCount,
  setUpdateLastMessage,
} from "../../redux/reducers/chatReducer";
import {
  setDeleteChatSelection,
  setIsDeleteMenu,
  setMobileMenuOpen,
} from "../../redux/reducers/uiReducer";
import { useSocket } from "../../socket/socket";

import Title from "../Shared/Title";
import DeleteChatMenu from "./../menu/DeleteChatMenue";
import Header from "./Header";
import Loader from "./Loader";

const MessageList = lazy(() => import("./../specific/MessageList"));

const AppLayout = (WrappedComponent) => {
  const HOC = (props) => {
    const { id: chatId } = useParams();
    const isLoadingUser = useSelector((state) => state.auth.isLoading);
    const dispatch = useDispatch();
    const { isMobileMenuOpen } = useSelector((state) => state.ui);
    const { newMessageAlerts } = useSelector((state) => state.chat);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [filteredChats, setFilteredChats] = useState([]);
    const { isLoading, data, refetch, isError, error } = useFetchChatsQuery("");
    const socket = useSocket();
    const deleteMenuAnchor = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessageAlerts });
    }, [newMessageAlerts]);

    const handleNewRequest = useCallback(() => {
      dispatch(setNotificationCount());
    }, [dispatch]);

    const handleNewMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const handleDeleteChat = (e, chatId, groupChat, name) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setDeleteChatSelection({ chatId, groupChat, name }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const updateLastMessageListener = useCallback((data) => {
      dispatch(setUpdateLastMessage(data));
    }, []);

    const allEventsArray = {
      [NEW_MESSAGE_ALERT]: handleNewMessageAlertListener,
      [NEW_REQUEST]: handleNewRequest,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
      [UPDATE_LAST_MESSAGE]: updateLastMessageListener,
    };

    useSocketEvents(socket, allEventsArray);

    useEffect(() => {
      setLoading(true);
      const delayDebounceFn = setTimeout(() => {
        const result =
          data?.Chats?.filter((chat) =>
            chat.name.toLowerCase().includes(searchValue.toLowerCase())
          ) || [];
        setFilteredChats(result);
        setLoading(false);
      }, 1000);

      return () => {
        clearTimeout(delayDebounceFn);
        dispatch(setUpdateLastMessage([]));
      };
    }, [data, searchValue]);

    const handleMobileMenuClose = () => dispatch(setMobileMenuOpen(false));

    return isLoadingUser ? (
      <Loader />
    ) : (
      <>
        <Title />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />
        <Drawer open={isMobileMenuOpen} onClose={handleMobileMenuClose}>
          <MessageList
            w="75vw"
            chats={filteredChats}
            chatId={chatId}
            newMessagesAlert={newMessageAlerts}
            handleDeleteChat={handleDeleteChat}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isLoadingChats={isLoading || loading}
            onlineUsers={onlineUsers}
          />
        </Drawer>
        <Grid container height="100vh">
          <Grid
            item
            sm={1}
            bgcolor="black"
            sx={{ display: { xs: "none", lg: "block" } }}
          >
            <Header />
          </Grid>
          <Grid
            item
            sm={4}
            md={4}
            lg={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height="100%"
          >
            <MessageList
              chats={filteredChats}
              chatId={chatId}
              newMessagesAlert={newMessageAlerts}
              handleDeleteChat={handleDeleteChat}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              isLoadingChats={loading || isLoading}
              onlineUsers={onlineUsers}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={8} lg={8}>
            <WrappedComponent
              {...props}
              chatId={chatId}
              setOnlineUsers={setOnlineUsers}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  return HOC;
};

export default AppLayout;
