import { AudioFile, Image, UploadFile, VideoFile } from "@mui/icons-material";
import { ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { mainColor } from "../../constants/constants";
import { useUploadAttachmentMutation } from "../../redux/apis/apiRtk";
import {
  setFileMenuOpen,
  setUploadingLoader,
} from "../../redux/reducers/uiReducer";

const fileTypes = [
  {
    key: "image",
    label: "Image",
    icon: <Image sx={{ color: mainColor }} />,
    accept: "image/png, image/jpeg, image/gif",
  },
  {
    key: "audio",
    label: "Audio",
    icon: <AudioFile sx={{ color: mainColor }} />,
    accept: "audio/mpeg,audio/wav,audio/ogg",
  },
  {
    key: "video",
    label: "Video",
    icon: <VideoFile sx={{ color: mainColor }} />,
    accept: "video/mp4, video/webm, video/ogg",
  },
  {
    key: "file",
    label: "File",
    icon: <UploadFile sx={{ color: mainColor }} />,
    accept: "*",
  },
];

const FileMenu = ({ anchor, chatId }) => {
  const { isFileMenuOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [sendAttachments] = useUploadAttachmentMutation();
  const inputRefs = useRef({});

  const closeFileMenu = useCallback(() => {
    dispatch(setFileMenuOpen(false));
  }, [dispatch]);

  const handleMenuItemClick = useCallback((key) => {
    inputRefs.current[key]?.click();
  }, []);

  const fileChangeHandler = useCallback(
    async (e, key) => {
      const files = Array.from(e.target.files);
      if (files.length < 1) return toast.error("Please upload attachment");

      if (files.length > 5) {
        return toast.error(`You can only send 5 ${key}s at a time`);
      }

      dispatch(setUploadingLoader(true));
      const toastId = toast.loading(`Sending ${key}`);
      closeFileMenu();

      try {
        const myForm = new FormData();
        myForm.append("chatId", chatId);
        files.forEach((file) => myForm.append("files", file));

        const res = await sendAttachments(myForm);

        if (res.data)
          toast.success(`${key} sent successfully`, { id: toastId });
        else toast.error(`Failed to send ${key}`, { id: toastId });
      } catch (error) {
        toast.error(error.message || `Failed to send ${key}`, { id: toastId });
      } finally {
        dispatch(setUploadingLoader(false));
      }
    },
    [chatId, closeFileMenu, dispatch, sendAttachments]
  );

  const menuItems = useMemo(() => {
    return fileTypes.map(({ key, label, icon, accept }) => (
      <MenuItem key={key} onClick={() => handleMenuItemClick(key)}>
        {icon}
        <ListItemText sx={{ ml: "0.5rem" }}>{label}</ListItemText>
        <input
          type="file"
          multiple
          accept={accept}
          ref={(el) => (inputRefs.current[key] = el)}
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, key)}
        />
      </MenuItem>
    ));
  }, [handleMenuItemClick, fileChangeHandler]);

  return (
    <Menu open={isFileMenuOpen} onClose={closeFileMenu} anchorEl={anchor}>
      <MenuList sx={{ width: "9rem", p: 0, ":hover": { bgcolor: "#FBF4FB" } }}>
        {menuItems}
      </MenuList>
    </Menu>
  );
};

FileMenu.propTypes = {
  anchor: PropTypes.oneOfType([PropTypes.instanceOf(Element), PropTypes.func]),
  chatId: PropTypes.string,
};

export default FileMenu;
