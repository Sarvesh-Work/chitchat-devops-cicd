import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Avatar, IconButton, Stack } from "@mui/material";
import PropTypes from "prop-types";
import { mainColor } from "../../constants/constants";
import { VisuallyHiddenInput } from "../styles/StyleComponent";

function AvatarUpload({
  avatarPath,
  handleAvatarChange,
  register,
  errors,
  setAvatarPath,
}) {
  return (
    <Stack
      display={"flex"}
      position={"relative"}
      width={"10rem"}
      mx={"auto"}
      my={"1rem"}
    >
      <Avatar sx={{ width: "10rem", height: "10rem" }} src={avatarPath} />
      <IconButton
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          bgcolor: mainColor,
          color: "white",
          padding: "8px",
          ":hover": {
            color: mainColor,
            bgcolor: "white",
          },
        }}
        component="label"
      >
        <>
          <VisuallyHiddenInput
            type="file"
            {...register("photo", {
              validate: (value) => {
                if (value[0]?.size > 5242880) return "Max size is 5MB";
                return true;
              },
              required: "Avatar is required",
            })}
            onChange={(e) => handleAvatarChange(e, setAvatarPath)}
          />
          <CameraAltIcon />
        </>
      </IconButton>
      {errors.photo && (
        <div
          style={{
            color: mainColor,
            textAlign: "center",
            padding: "5px",
          }}
        >
          {errors.photo.message}
        </div>
      )}
    </Stack>
  );
}

AvatarUpload.propTypes = {
  avatarPath: PropTypes.string,
  handleAvatarChange: PropTypes.func,
  register: PropTypes.func,
  errors: PropTypes.shape({
    photo: PropTypes.shape({
      message: PropTypes.string,
    }),
  }),
  setAvatarPath: PropTypes.func,
};

export default AvatarUpload;
