import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { Menu, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { mainColor } from "../../constants/constants";
import { useMutationHoot } from "../../hooks/hooks";
import {
  useDeleteChatOrGroupMutation,
  useExitGroupMutation,
} from "../../redux/apis/apiRtk";
import {
  setIsDeleteMenu,
  setOpenConformDelate,
} from "../../redux/reducers/uiReducer";
import ConfirmDelete from "../Shared/ConformDelete";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();
  const { isDeleteMenu, deleteChatSelection } = useSelector(
    (state) => state.ui
  );

  const [deleteChat, , deleteChatData] = useMutationHoot(
    useDeleteChatOrGroupMutation
  );
  const [exitGroup, , exitGroupData] = useMutationHoot(useExitGroupMutation);

  const isGroup = deleteChatSelection.groupChat;
  const target = isGroup ? "Group" : "Chat";

  const closeMenu = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const confirmDeleteHandler = () => {
    closeMenu();
    dispatch(setOpenConformDelate(false));
    if (isGroup) {
      exitGroup("Leaving Group...", deleteChatSelection.chatId);
    } else {
      deleteChat("Deleting Chat...", deleteChatSelection.chatId);
    }
  };

  useEffect(() => {
    if (deleteChatData || exitGroupData) navigate("/");
  }, [deleteChatData, exitGroupData, navigate]);

  const openConfirmDelete = () => {
    dispatch(setOpenConformDelate(true));
  };

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeMenu}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{
          width: "9rem",
          padding: "0.4rem",
          cursor: "pointer",
          height: "2rem",
        }}
        direction="row"
        alignItems="center"
        spacing="0.5rem"
        onClick={openConfirmDelete}
      >
        {isGroup ? (
          <>
            <ExitToAppIcon sx={{ color: mainColor }} />
            <Typography>Exit Group</Typography>
          </>
        ) : (
          <>
            <DeleteIcon sx={{ color: mainColor }} />
            <Typography>Delete Chat</Typography>
          </>
        )}
      </Stack>
      <ConfirmDelete
        name={deleteChatSelection.name}
        target={target}
        DeleteGroupFunction={confirmDeleteHandler}
      />
    </Menu>
  );
};

DeleteChatMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  deleteMenuAnchor: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default DeleteChatMenu;
