import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import AvatarCard from "../../components/Shared/AvatarCard";
import { mainColor } from "../../constants/constants";
import { setIsDetailsOpen } from "../../redux/reducers/uiReducer";
import DetailsPage from "../DetailsPage";

export const MessageHead = ({ chatDetails }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const chat = chatDetails?.data?.chat;
  const isGroupChat = chat?.groupChat;
  const openChat = chat?.members?.find((member) => member._id !== user._id);
  const details = isGroupChat ? chat : openChat;

  const handleGroupDetailsOpen = () => {
    dispatch(setIsDetailsOpen(true));
  };
  const { userTyping } = useSelector((state) => state.chat);

  if (!chat) return null;

  return (
    <Stack px={{ lg: "3px", xs: "1rem" }} width="100%" mb="0px" p="0.1rem">
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row">
          <AvatarCard
            avatar={isGroupChat ? chat.groupAvatar : openChat?.avatar}
          />
          <Stack justifyContent="center" px="0.7rem">
            <Typography fontSize="18px" fontWeight="600">
              {isGroupChat ? chat.name : openChat?.name}
            </Typography>
            <Typography
              fontSize="18px"
              fontWeight="600"
              color={mainColor}
              display={{ sm: "none", xs: "block" }}
            >
              {chat._id == userTyping ? "typing..." : null}
            </Typography>
          </Stack>
        </Stack>

        <Stack justifyContent="center" px={{ lg: "1.4rem" }}>
          <IconButton onClick={handleGroupDetailsOpen}>
            <MoreHorizIcon sx={{ color: "#A6A6A6", fontSize: "27px" }} />
          </IconButton>
        </Stack>
      </Stack>
      <DetailsPage data={details} />
    </Stack>
  );
};

MessageHead.propTypes = {
  chatDetails: PropTypes.shape({
    data: PropTypes.shape({
      chat: PropTypes.shape({
        groupChat: PropTypes.bool,
        groupAvatar: PropTypes.string,
        name: PropTypes.string,
        members: PropTypes.arrayOf(
          PropTypes.shape({
            _id: PropTypes.string.isRequired,
            avatar: PropTypes.string,
            name: PropTypes.string,
          })
        ),
      }),
    }),
  }).isRequired,
};
