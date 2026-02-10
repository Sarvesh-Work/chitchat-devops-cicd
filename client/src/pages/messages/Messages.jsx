import { Menu } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import Loader from "../../components/layout/Loader";
import FileMenu from "../../components/menu/FileMenu";
import MessageComponent from "../../components/Shared/MessageComponent";
import { chatBg, mainColor } from "../../constants/constants";
import { CHAT_JOINED, CHAT_LEAVED } from "../../constants/events";
import { useErrors } from "../../hooks/hooks";
import { useChatSocket } from "../../hooks/socketHooks";
import {
  useFetchChatDetailsQuery,
  useFetchMessagesQuery,
} from "../../redux/apis/apiRtk";
import { reSetNewMessageAlert } from "../../redux/reducers/chatReducer";
import {
  setFileMenuOpen,
  setMobileMenuOpen,
} from "../../redux/reducers/uiReducer";
import { useSocket } from "../../socket/socket";
import MessageForm from "./MessageForm";
import { MessageHead } from "./MessageHead";

const iconButtonStyles = {
  bgcolor: mainColor,
  color: "white",
  p: "5px",
  ":hover": {
    bgcolor: mainColor,
    color: "white",
  },
  height: "2.3rem",
  width: "2.3rem",
};

function Messages({ chatId, setOnlineUsers }) {
  const containerRef = useRef(null);
  const socket = useSocket();
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, setValue } = useForm();
  const chatDetails = useFetchChatDetailsQuery(chatId, { skip: !chatId });
  const { data: oldMessagesData, isFetching: oldMessagesFetching } =
    useFetchMessagesQuery({ chatId, page });

  const members = chatDetails.data?.chat.members.map((member) => member._id);

  const [messages, setMessages] = useState([]);
  const [scrollToBottom, setScrollToBottom] = useState(true);

  const { onSubmit, onChangeMessage } = useChatSocket({
    chatId,
    members,
    setValue,
    setMessages,
  });

  useEffect(() => {
    if (!chatId || !user._id) return;
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(reSetNewMessageAlert(chatId));
    return () => {
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
      setMessages([]);
      setOnlineUsers;
    };
  }, [chatId, user._id]);

  useEffect(() => {
    if (oldMessagesData?.messages) {
      setMessages((prevMessages) => [
        ...oldMessagesData.messages,
        ...prevMessages,
      ]);

      if (containerRef.current) {
        const prevScrollHeight = containerRef.current.scrollHeight;
        setTimeout(() => {
          containerRef.current.scrollTop =
            containerRef.current.scrollHeight - prevScrollHeight;
        }, 0);
      }
    }
  }, [oldMessagesData]);

  useEffect(() => {
    if (scrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (chatDetails.isError || oldMessagesData?.isError) {
      return navigate("/");
    }
  }, [chatDetails.isError, oldMessagesData?.isError]);

  const handleScroll = () => {
    if (
      containerRef.current.scrollTop === 0 &&
      !oldMessagesFetching &&
      page < oldMessagesData?.totalPages
    ) {
      setPage((prevPage) => prevPage + 1);
      setScrollToBottom(false);
    } else if (
      containerRef.current.scrollTop + containerRef.current.clientHeight >=
      containerRef.current.scrollHeight
    ) {
      setScrollToBottom(true);
    }
  };

  const handleMobileMenu = () => dispatch(setMobileMenuOpen(true));

  const openFileMenu = (e) => {
    dispatch(setFileMenuOpen(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const errors = [
    { isError: chatDetails?.isError, error: chatDetails?.error },
    { isError: oldMessagesData?.isError, error: oldMessagesData?.error },
  ];

  useErrors(errors);

  return chatDetails.isLoading ? (
    <Loader />
  ) : (
    <Stack height="100vh">
      <Stack
        display={"flex"}
        justifyContent={"center"}
        p={"0.5rem"}
        borderBottom={"1px solid #E9EAEC"}
        direction="row"
      >
        <Stack p="4px">
          <Tooltip title="Friends Menu" placement="right">
            <IconButton
              sx={{
                borderRadius: "10px",
                height: "40px",
                width: "45px",
                bgcolor: mainColor,
                color: "white",
                padding: "0.2rem",
                fontSize: "13px",
                ":hover": { bgcolor: mainColor },
                display: { sm: "none", xs: "flex" },
              }}
              onClick={handleMobileMenu}
            >
              <Menu />
            </IconButton>
          </Tooltip>
        </Stack>
        <MessageHead chatDetails={chatDetails} />
      </Stack>

      <Stack
        ref={containerRef}
        onScroll={handleScroll}
        height={{ sm: "90vh", xs: "84vh" }}
        padding="1rem"
        spacing="1rem"
        sx={{ overflowX: "hidden", overflowY: "auto" }}
        bgcolor={"#ECF2F9"}
      >
        {messages.map((data) => (
          <MessageComponent message={data} key={data?._id} user={user} />
        ))}
        <div ref={bottomRef} />
      </Stack>

      <Stack
        sx={{
          padding: "0.4rem",
          bgcolor: chatBg,
          position: "relative",
          alignItems: "center",
          borderTop: "1px solid #E9EAEC",
          flexWrap: "wrap",
        }}
      >
        <MessageForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          openFileMenu={openFileMenu}
          iconButtonStyles={iconButtonStyles}
          setFileMenuAnchor={setFileMenuAnchor}
          onChangeMessage={onChangeMessage}
        />
        <FileMenu anchor={fileMenuAnchor} chatId={chatId} />
      </Stack>
    </Stack>
  );
}

Messages.propTypes = {
  chatId: PropTypes.string.isRequired,
  setOnlineUsers: PropTypes.func.isRequired,
};

export default AppLayout(Messages);
