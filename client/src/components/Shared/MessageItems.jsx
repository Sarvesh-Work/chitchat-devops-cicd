import { Badge, Box, Stack, styled, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainColor } from "../../constants/constants";
import { setMobileMenuOpen } from "../../redux/reducers/uiReducer";
import { Link } from "../styles/StyleComponent";
import AvatarCard from "./AvatarCard";
import moment from "moment";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -1,
    top: 37,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0.2px",
  },
}));

function MessageItems({
  avatar,
  _id,
  name,
  groupChat = false,
  sameSender,
  newMessage,
  handleDeleteChat,
  isOnline,
  lastMessage,
}) {
  const dispatch = useDispatch();
  const { userTyping, updateLastMessage } = useSelector((state) => state.chat);

  const handleMobileMenuClose = () => {
    dispatch(setMobileMenuOpen(false));
  };

  const updateLastMessageFunc = useMemo(() => {
    return updateLastMessage?.find((data) => data.chatId === _id)?.message;
  }, [updateLastMessage, _id]);

  const updateLastMessageTimeFun = useMemo(() => {
    return updateLastMessage?.find((data) => data.chatId === _id)?.time;
  }, [updateLastMessage, _id]);

  const renderMessage = useMemo(() => {
    const messageContent =
      updateLastMessage.length === 0
        ? lastMessage.content
        : updateLastMessageFunc || lastMessage?.content;

    return (
      <Typography
        color={_id === userTyping ? mainColor : "#858585"}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {_id === userTyping ? "typing..." : messageContent}
      </Typography>
    );
  }, [userTyping, updateLastMessageFunc, lastMessage, _id]);

  const time = useMemo(() => {
    const lastMessageTime = lastMessage?.createdAt;
    const updateTime = updateLastMessageTimeFun;

    return updateTime || lastMessageTime || moment().format(); // fallback to current time if none
  }, [lastMessage, updateLastMessageTimeFun]);

  const formattedTime = useMemo(() => {
    const now = moment();
    const messageTime = moment(time);

    if (messageTime.isSame(now, "day")) {
      return messageTime.format("h:mm A");
    }

    if (messageTime.isSame(now.subtract(1, "day"), "day")) {
      return "Yesterday";
    }

    return messageTime.format("DD/MM/YYYY");
  }, [time]);

  return (
    <Stack  width="100%">
      <Link
        to={`/messages/${_id}`}
        onContextMenu={(e) => handleDeleteChat(e, _id, groupChat, name)}
        onClick={handleMobileMenuClose}
        style={{ width: "100%" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={{ lg: "1rem", sm: "0.7rem", xs: "1rem" }}
          sx={{
            backgroundColor: sameSender ? "#Fbf4fb" : "white",
            px: { lg: "13px", xs: "7px" },
            py: { lg: "10px", xs: "7px" },
            width: "100%",
            overflow: "hidden",
          }}
        >
          <StyledBadge badgeContent="" color="success" invisible={!isOnline}>
            <AvatarCard avatar={avatar} />
          </StyledBadge>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", overflow: "hidden" }}
          >
            <Box
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "calc(100% - 50px)",
                  }}
                >
                  {name}
                </Typography>
                <Typography color="#858585">{formattedTime}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                {renderMessage}

                {newMessage && (
                  <Stack
                    sx={{
                      fontWeight: "300",
                      backgroundColor: mainColor,
                      color: "white",
                      px: "0.5rem",
                      borderRadius: "7px",
                      ml: "auto",
                    }}
                  >
                    {newMessage.count}
                  </Stack>
                )}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Link>
    </Stack>
  );
}

MessageItems.propTypes = {
  avatar: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  groupChat: PropTypes.bool,
  sameSender: PropTypes.bool,
  newMessage: PropTypes.shape({
    count: PropTypes.number.isRequired,
  }),
  handleDeleteChat: PropTypes.func.isRequired,
  isOnline: PropTypes.bool,
  lastMessage: PropTypes.shape({
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }),
};

export default memo(MessageItems);
