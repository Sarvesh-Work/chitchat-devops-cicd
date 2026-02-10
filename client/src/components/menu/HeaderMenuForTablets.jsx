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
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  styled,
} from "@mui/material";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mainColor } from "../../constants/constants";
import { useMutationHoot } from "../../hooks/hooks";
import { getOrSaveFromStorage } from "../../lib/features";
import { useLogoutUserMutation } from "../../redux/apis/apiRtk";
import { reSetNotificationCount } from "../../redux/reducers/chatReducer";
import {
  setCreatingNewGroup,
  setHasNotification,
  setIsProfileOpen,
  setSearching,
} from "../../redux/reducers/uiReducer";

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

const HeaderMenuForTablet = ({ anchorE1, closeHeaderMobileMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isMobileAndTabletHeaderMenuOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { notificationCount } = useSelector((state) => state.chat);

  const [logoutUser, isLoading] = useMutationHoot(useLogoutUserMutation);

  useEffect(() => {
    getOrSaveFromStorage({ key: "notifications", value: notificationCount });
  }, [notificationCount]);

  const logout = async () => {
    await logoutUser("Logout Loading", dispatch);
    closeHeaderMobileMenu();
  };

  const headerItems = useMemo(
    () => [
      {
        key: "Profile",
        label: "Profile",
        icon: (
          <Avatar src={user.avatar?.url} sx={{ height: 30, width: 30, m: 0 }} />
        ),
        toggle: () => {
          dispatch(setIsProfileOpen(true));
          closeHeaderMobileMenu();
        },
      },
      {
        key: "Notifications",
        label: "Notifications",
        icon: <Notifications sx={{ color: mainColor }} />,
        toggle: () => {
          dispatch(setHasNotification(true));
          dispatch(reSetNotificationCount());
          closeHeaderMobileMenu();
        },
        value: notificationCount,
      },
      {
        key: "Group",
        label: "Create group",
        icon: <GroupAdd sx={{ color: mainColor }} />,
        toggle: () => {
          dispatch(setCreatingNewGroup(true));
          closeHeaderMobileMenu();
        },
      },
      {
        key: "Manage",
        label: "Manage groups",
        icon: <Group sx={{ color: mainColor }} />,
        toggle: () => {
          navigate("/groups");
          closeHeaderMobileMenu();
        },
      },
      {
        key: "Add",
        label: "New friend",
        icon: <Add sx={{ color: mainColor }} />,
        toggle: () => {
          dispatch(setSearching(true));
          closeHeaderMobileMenu();
        },
      },
      {
        key: "Logout",
        label: "Logout",
        icon: <Logout sx={{ color: mainColor }} />,
        toggle: logout,
      },
    ],
    [user, notificationCount, navigate, dispatch, logoutUser]
  );

  const menuItems = useMemo(
    () =>
      headerItems.map(({ key, label, icon, toggle, value }) => (
        <Stack key={key} direction="row">
          <MenuItem
            onClick={toggle}
            sx={{ width: "100%", justifyContent: "space-evenly" }}
          >
            {icon}
            <ListItemText sx={{ ml: "0.5rem" }}>{label}</ListItemText>
          </MenuItem>
          {value > 0 && <StyledBadge badgeContent={value} />}
        </Stack>
      )),
    [headerItems]
  );

  return (
    <>
      <Menu
        open={isMobileAndTabletHeaderMenuOpen}
        onClose={closeHeaderMobileMenu}
        anchorEl={anchorE1}
      >
        <MenuList sx={{ width: "12rem", p: "3px" }}>{menuItems}</MenuList>
      </Menu>
    </>
  );
};

export default HeaderMenuForTablet;
