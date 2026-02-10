import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import notificationIcon from "../../assets/Icons/silent.png";
import { mainColor } from "../../constants/constants";
import { useMutationHoot } from "../../hooks/hooks";
import {
  useAcceptFriendMutation,
  useFetchNotificationsQuery,
} from "../../redux/apis/apiRtk";
import { reSetNotificationCount } from "../../redux/reducers/chatReducer";
import { setHasNotification } from "../../redux/reducers/uiReducer";
import Loader from "../layout/Loader";

const NotificationItem = ({ sender: { name, avatar }, _id, handler }) => (
  <ListItem
    sx={{
      p: "0.7rem",
      display: "block",
      mt: "4px",
      border: "1px solid #d3d3d3",
    }}
  >
    <Stack width="100%" spacing="0.7rem" direction="row" alignItems="center">
      <Avatar src={avatar} alt={`${name}'s avatar`} />
      <Typography sx={{ fontSize: "15px", fontWeight: "600", flexGrow: 1 }}>
        {name}
      </Typography>
      <Stack direction="row" spacing="10px">
        <Button
          onClick={() => handler({ _id, accept: true })}
          sx={{
            mt: "2rem",
            bgcolor: mainColor,
            "&:hover": { bgcolor: mainColor },
            height: "30px",
            color: "white",
          }}
        >
          Accept
        </Button>
        <Button
          onClick={() => handler({ _id, accept: false })}
          sx={{
            mt: "2rem",
            bgcolor: "red",
            "&:hover": { bgcolor: "red" },
            height: "30px",
            color: "white",
          }}
        >
          Reject
        </Button>
      </Stack>
    </Stack>
    <Typography textAlign="center" mt="3px" color="gray">
      {`${name} sends you a friend request`}
    </Typography>
  </ListItem>
);

NotificationItem.propTypes = {
  sender: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  _id: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
};

const Notification = () => {
  const { hasNotification } = useSelector((state) => state.ui);
  const { data, isLoading } = useFetchNotificationsQuery();
  const [acceptFriendRequest] = useMutationHoot(useAcceptFriendMutation);
  const dispatch = useDispatch();

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setHasNotification(false));
    await acceptFriendRequest("Accepting...", { requestId: _id, accept });
    dispatch(reSetNotificationCount());
  };

  const handleClose = () => {
    dispatch(setHasNotification(false));
  };

  return (
    <Dialog open={hasNotification} onClose={handleClose}>
      <Stack
        sx={{ maxWidth: "100%", width: "30rem", p: "1.5rem" }}
        height="70vh"
      >
        <DialogTitle
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            p: 0,
            mb: "7px",
            borderBottom: "1px solid #d3d3d3",
          }}
        >
          All Notifications
        </DialogTitle>
        <Stack sx={{ overflow: "auto", height: "100%" }}>
          {isLoading ? (
            <Loader />
          ) : data?.notifications?.length > 0 ? (
            data.notifications.map(({ sender, _id }) => (
              <NotificationItem
                key={_id}
                sender={sender}
                _id={_id}
                handler={friendRequestHandler}
              />
            ))
          ) : (
            <Stack p="4px" mt="10px" alignItems="center">
              <Box width="6rem" height="6rem">
                <img
                  src={notificationIcon}
                  alt="No notifications"
                  width="100%"
                  height="100%"
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "600",
                  mt: "10px",
                  color: mainColor,
                  textAlign: "center",
                }}
              >
                Sorry
              </Typography>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "600",
                  mt: "10px",
                  textAlign: "center",
                }}
              >
                {"You don't have any notifications"}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default Notification;
