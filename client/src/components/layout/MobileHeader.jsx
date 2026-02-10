import {
  Add,
  Group,
  GroupAdd,
  Logout,
  Notifications,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  IconButton,
  Stack,
  styled,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mainColor } from "../../constants/constants";
import {
  setCreatingNewGroup,
  setHasNotification,
  setIsProfileOpen,
  setSearching,
} from "../../redux/reducers/uiReducer";
import { reSetNotificationCount } from "../../redux/reducers/chatReducer";
import { useMutationHoot } from "../../hooks/hooks";
import { useLogoutUserMutation } from "../../redux/apis/apiRtk";

const MobileHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { notificationCount } = useSelector((state) => state.chat);

  const [logoutUser] = useMutationHoot(useLogoutUserMutation);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      color: "white",
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0.2px",
      backgroundColor: mainColor,
      top: 18,
      right: 35,
    },
  }));
  const handleLogout = async () => {
    await logoutUser("Logging out", dispatch);
  };

  const headerItems = useMemo(
    () => [
      {
        key: "Profile",
        label: "Profile",
        icon: <Avatar src={user.avatar?.url} sx={{ height: 30, width: 30 }} />,
        onClick: () => dispatch(setIsProfileOpen(true)),
      },
      {
        key: "Notifications",
        label: "Notifications",
        icon: <Notifications sx={{ color: mainColor }} />,
        onClick: () => {
          dispatch(setHasNotification(true));
          dispatch(reSetNotificationCount());
        },
        badgeContent: notificationCount,
      },
      {
        key: "Group",
        label: "Create group",
        icon: <GroupAdd sx={{ color: mainColor }} />,
        onClick: () => dispatch(setCreatingNewGroup(true)),
      },
      {
        key: "Manage",
        label: "Manage groups",
        icon: <Group sx={{ color: mainColor }} />,
        onClick: () => navigate("/groups"),
      },
      {
        key: "Add",
        label: "New friend",
        icon: <Add sx={{ color: mainColor }} />,
        onClick: () => dispatch(setSearching(true)),
      },
      {
        key: "Logout",
        label: "Logout",
        icon: <Logout sx={{ color: mainColor }} />,
        onClick: handleLogout,
      },
    ],
    [user.avatar?.url, notificationCount, dispatch, navigate]
  );

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      height="10vh"
      borderTop={`1px solid ${mainColor}`}
      sx={{ width: "100%" }}
    >
      {headerItems.map(({ key, label, icon, badgeContent, onClick }) => (
        <Tooltip key={key} title={label}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: "150px",
              height: "100%",
              ":hover": { bgcolor: "#E6E6E6" },
            }}
          >
            {badgeContent > 0 ? (
              <StyledBadge badgeContent={badgeContent}>
                <IconButton
                  onClick={onClick}
                  sx={{ ":hover": { bgcolor: "#E6E6E6" } }}
                >
                  {icon}
                </IconButton>
              </StyledBadge>
            ) : (
              <IconButton
                onClick={onClick}
                sx={{ ":hover": { bgcolor: "#E6E6E6" } }}
              >
                {icon}
              </IconButton>
            )}
          </Stack>
        </Tooltip>
      ))}
    </Stack>
  );
};

export default MobileHeader;
