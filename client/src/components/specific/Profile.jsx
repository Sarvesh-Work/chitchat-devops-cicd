import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { mainColor } from "../../constants/constants";
import { useMutationHoot } from "../../hooks/hooks";
import { useEditProfileMutation } from "../../redux/apis/apiRtk";
import { fetchUserApi } from "../../redux/apis/authApi";
import { setUser } from "../../redux/reducers/authReducer";
import { setIsProfileOpen } from "../../redux/reducers/uiReducer";
import { VisuallyHiddenInput } from "../styles/StyleComponent";
import Loader from "../layout/Loader";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { isProfileOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [avatarPath, setAvatarPath] = useState(user.avatar?.url);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const handleAvatarChange = (e) => {
    setAvatarPath(URL.createObjectURL(e.target.files[0]));
    setIsSaveEnabled(true);
  };

  const [editProfile, isLoadingEditProfile] = useMutationHoot(
    useEditProfileMutation
  );

  const handleClose = () => dispatch(setIsProfileOpen(false));

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.name !== user.name) formData.append("name", data.name);
    if (data.email !== user.email) formData.append("email", data.email);
    if (data.bio !== user.bio) formData.append("bio", data.bio);

    if (data.photo && data.photo[0]) {
      formData.append("avatar", data.photo[0]);
    }

    await editProfile("Updating profile", formData);
    const { profile } = await fetchUserApi();
    if (profile) {
      dispatch(setUser(profile));
    }
    setIsSaveEnabled(false);
    handleClose();
  };

  useEffect(() => {
    setValue("bio", user.bio);
    setValue("name", user.name);
    setValue("email", user.email);
  }, [setValue, user]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "bio" || name === "name" || name === "email") {
        setIsSaveEnabled(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Dialog open={isProfileOpen} onClose={handleClose}>
      {isLoadingEditProfile ? (
        <Stack width="26rem" height="30rem">
          <Loader />
        </Stack>
      ) : (
        <Stack
          sx={{
            maxWidth: "100%",
            width: "26rem",
            px: "1.4rem",
            py: "0.7rem",
          }}
        >
          <Box width={"100%"}>
            <DialogTitle fontSize={"20px"} fontWeight={"600"} sx={{ p: "0px" }}>
              Profile
            </DialogTitle>
            <Typography
              color={"grey"}
              pb={"7px"}
              borderBottom={"1px solid #d3d3d3"}
            >
              Edit your public information
            </Typography>
          </Box>

          <Box mt={"7px"}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={"1rem"}>
                <Box>
                  <label>Name</label>
                  <TextField
                    type="text"
                    placeholder="Name..."
                    fullWidth
                    {...register("name", {
                      onChange: () => setIsSaveEnabled(true),
                    })}
                  />
                </Box>
              </Stack>

              <Stack spacing={"0.5rem"} mt={"0.5rem"}>
                <Box>
                  <label>Email</label>
                  <TextField
                    type="email"
                    placeholder="Email..."
                    fullWidth
                    {...register("email", {
                      onChange: () => setIsSaveEnabled(true),
                    })}
                  />
                </Box>
              </Stack>

              <Stack spacing={"1rem"} mt={"0.5rem"}>
                <Box>
                  <label>Bio</label>
                  <TextField
                    type="text"
                    placeholder="Bio..."
                    fullWidth
                    multiline
                    maxRows={2}
                    {...register("bio", {
                      onChange: () => setIsSaveEnabled(true),
                    })}
                  />
                </Box>
              </Stack>

              <Stack width={"100%"} position={"relative"} mt={"0.5rem"}>
                <label>Profile photo</label>
                <Stack
                  direction={"row"}
                  spacing={"10px"}
                  mt={"10px"}
                  alignItems={"center"}
                >
                  <Avatar
                    sx={{ width: "5rem", height: "5rem" }}
                    src={avatarPath}
                  />
                  <Button
                    sx={{
                      bgcolor: mainColor,
                      color: "white",
                      p: "5px",
                      height: "30px",
                      "&:hover": {
                        color: "white",
                        bgcolor: mainColor,
                      },
                    }}
                    component="label"
                  >
                    <VisuallyHiddenInput
                      type="file"
                      {...register("photo", {
                        validate: (value) => {
                          if (value[0]?.size > 5242880)
                            return "Max size is 5MB";
                          return true;
                        },
                      })}
                      onChange={handleAvatarChange}
                    />
                    <Typography>Change</Typography>
                  </Button>
                </Stack>
              </Stack>

              {errors.photo && (
                <Typography color={mainColor} textAlign="center" pt="5px">
                  {errors.photo.message}
                </Typography>
              )}

              <Stack
                direction={"row"}
                mt={"1rem"}
                borderTop={"1px solid #D3D3D3"}
              >
                <Box
                  mt={"10px"}
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"flex-end"}
                  gap={"1rem"}
                >
                  <Button
                    sx={{ color: "black", fontWeight: "600" }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{
                      bgcolor: mainColor,
                      "&:hover": { bgcolor: mainColor },
                      height: "30px",
                      color: "white",
                    }}
                    type="submit"
                    disabled={!isSaveEnabled}
                  >
                    Save
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Stack>
      )}
    </Dialog>
  );
}

export default Profile;
