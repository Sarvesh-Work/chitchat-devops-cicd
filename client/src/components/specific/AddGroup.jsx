import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useErrors, useMutationHoot } from "../../hooks/hooks";
import {
  useCreateGroupMutation,
  useFetchFriendsQuery,
} from "../../redux/apis/apiRtk";
import { setCreatingNewGroup } from "../../redux/reducers/uiReducer";

import { mainColor } from "../../constants/constants";
import { handleAvatarChange } from "../../lib/features";
import AvatarUpload from "../Shared/AvatarUpload";
import MemberList from "./MemberList";

function AddGroup() {
  const [avatarPath, setAvatarPath] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createNewGroup, isLoadingNewGroup] = useMutationHoot(
    useCreateGroupMutation
  );

  const { isError, isLoading, data, error } = useFetchFriendsQuery();
  useErrors([{ isError, error }]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const onSubmit = (data) => {
    if (selectedMembers.length < 2) {
      return toast.error("Please select at least 3 members");
    }

    const formData = new FormData();
    formData.append("name", data.groupName);
    formData.append("avatar", data.photo[0]);
    formData.append("members", JSON.stringify(selectedMembers));

    createNewGroup("Creating new group", formData);
    handleClose();
  };

  const handleClose = () => {
    dispatch(setCreatingNewGroup(false));
  };

  return (
    <Dialog open onClose={handleClose}>
      <Stack
        sx={{
          maxWidth: "100%",
          width: "30rem",
          p: "1.5rem",
          height: { md: "85vh", xs: "70vh" },
        }}
      >
        <DialogTitle sx={{ fontSize: "20px", fontWeight: "600", p: 0 }}>
          Create a new group
        </DialogTitle>
        <Typography
          mt={"1px"}
          color={"gray"}
          borderBottom={"1px solid #d3d3d3"}
          pb={"10px"}
          fontSize={"15px"}
        >
          Create a group with a minimum of 3 members
        </Typography>

        <form
          style={{ marginTop: "1rem", overflow: "auto" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <label
            style={{ marginTop: "1rem", color: "#6E6E6E", fontSize: "20px" }}
          >
            Choose a group profile photo
          </label>

          <AvatarUpload
            avatarPath={avatarPath}
            setAvatarPath={setAvatarPath}
            handleAvatarChange={handleAvatarChange}
            register={register}
            errors={errors}
          />

          <label>Name</label>
          <TextField
            type="text"
            placeholder="Group name"
            sx={{
              width: "100%",
              pb: "15px",
              borderBottom: "1px solid #d3d3d3",
            }}
            {...register("groupName", { required: "GroupName is required" })}
          />
          {errors.groupName && (
            <div
              style={{ color: mainColor, textAlign: "center", padding: "5px" }}
            >
              {errors.groupName.message}
            </div>
          )}

          <MemberList
            isLoading={isLoading}
            friends={data?.friends || []}
            selectedMembers={selectedMembers}
            selectMemberHandler={selectMemberHandler}
          />

          <Stack
            direction={"row"}
            mt={"1.5rem"}
            borderTop={"1px solid #D3D3D3"}
          >
            <Box
              mt={"15px"}
              width={"100%"}
              display={"flex"}
              justifyContent={"end"}
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
                disabled={isLoadingNewGroup}
              >
                Create
              </Button>
            </Box>
          </Stack>
        </form>
      </Stack>
    </Dialog>
  );
}

export default AddGroup;
