import {
  Add,
  Group,
  GroupAdd,
  Logout,
  Notifications,
} from "@mui/icons-material";
import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Backdrop,
  Badge,
  Box,
  Container,
  IconButton,
  styled,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { mainColor } from "../../constants/constants.js";
import { useMutationHoot } from "../../hooks/hooks.jsx";
import { useLogoutUserMutation } from "../../redux/apis/apiRtk.js";
import { reSetNotificationCount } from "../../redux/reducers/chatReducer.js";
import {
  setCreatingNewGroup,
  setHasNotification,
  setIsProfileOpen,
  setSearching,
} from "../../redux/reducers/uiReducer.js";
import Profile from "../specific/Profile.jsx";
import Loader from "./Loader.jsx";

const Search = lazy(() => import("../specific/Search"));
const AddGroup = lazy(() => import("./../specific/AddGroup"));
const Notification = lazy(() => import("./../specific/Notification"));

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { notificationCount } = useSelector((state) => state.chat);

  const [logoutUser, isLoading] = useMutationHoot(useLogoutUserMutation);

  const profileHandler = () => {
    dispatch(setIsProfileOpen(true));
  };

  const { isSearching, hasNotification, isCreatingNewGroup, isProfileOpen } =
    useSelector((state) => state.ui);
  const openSearch = () => dispatch(setSearching(true));
  const openNotifications = () => {
    dispatch(setHasNotification(true));
    dispatch(reSetNotificationCount());
  };

  const openCreateGroup = () => {
    dispatch(setCreatingNewGroup(true));
  };

  const navigate = useNavigate();

  const logout = async () => {
    logoutUser("Logout Loading", dispatch);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      color: "white",
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0.2px",
      backgroundColor: mainColor,
    },
  }));

  const navigation = [
    { title: "Search new friend", toggle: () => openSearch(), icon: <Add /> },
    {
      title: "Notification",
      toggle: () => openNotifications(),
      icon: <Notifications sx={{ color: "white" }} />,
      value: notificationCount,
    },
    {
      title: "Create Group",
      toggle: () => openCreateGroup(),
      icon: <GroupAdd />,
    },
  ];

  return (
    <>
      {isProfileOpen && (
        <Suspense fallback={<Backdrop open />}>
          <Profile />
        </Suspense>
      )}

      {isSearching && (
        <Suspense fallback={<Backdrop open />}>
          <Search />
        </Suspense>
      )}

      {isCreatingNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <AddGroup />
        </Suspense>
      )}

      {hasNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notification />
        </Suspense>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        user && (
          <Container maxWidth="xl" sx={{ height: "100%" }}>
            <Box color={"white"} height={"27%"} pt={"15px"}>
              <Tooltip title="Profile" placement="right">
                <Avatar
                  sx={{
                    width: "100%",
                    height: "60px",
                    border: `2px solid ${mainColor}`,
                    cursor: "pointer",
                  }}
                  src={user.avatar?.url}
                  onClick={() => profileHandler()}
                />
              </Tooltip>
            </Box>

            <Box color={"white"} height={"calc(100% - 27%)"} mt={"0px"}>
              {navigation.map((data) => (
                <Box color={"white"} mb={"2rem"} key={data.title}>
                  <Tooltip title={data.title} placement="right">
                    <IconButton
                      sx={{
                        borderRadius: "7px",
                        ":hover": { backgroundColor: mainColor },
                        width: "100%",
                      }}
                      color="inherit"
                      size="medium"
                      onClick={data.toggle}
                    >
                      {data.value ? (
                        <StyledBadge badgeContent={data.value}>
                          {data.icon}
                        </StyledBadge>
                      ) : (
                        data.icon
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}

              <Box color={"white"} mb={"2rem"}>
                <Tooltip title="Manage Group" placement="right">
                  <IconButton
                    sx={{
                      borderRadius: "7px",
                      ":hover": { backgroundColor: mainColor },
                      width: "100%",
                    }}
                    color="inherit"
                    size="medium"
                    onClick={() => navigate("/groups")}
                  >
                    <Group />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box color={"white"} mb={"2rem"}>
                <Tooltip title="Logout" placement="right">
                  <IconButton
                    sx={{
                      borderRadius: "7px",
                      ":hover": { backgroundColor: mainColor },
                      width: "100%",
                    }}
                    color="inherit"
                    size="medium"
                    onClick={() => logout()}
                  >
                    <Logout />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Container>
        )
      )}
    </>
  );
};

export default Header;
