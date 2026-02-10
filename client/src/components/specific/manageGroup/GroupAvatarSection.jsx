import { Button, Stack, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { mainColor } from "../../../constants/constants";
import { useMutationHoot } from "../../../hooks/hooks";
import { handleAvatarChange } from "../../../lib/features";
import { useChangeGroupAvatarMutation } from "../../../redux/apis/apiRtk";
import Loader from "../../layout/Loader";
import AvatarUpload from "../../Shared/AvatarUpload";

const GroupAvatarSection = ({
  avatarPath,
  newAvatarPath,
  setNewAvatarPath,
  chatId,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [updateGroupAvatarFunction, isLoadingGroupAvatar] = useMutationHoot(
    useChangeGroupAvatarMutation
  );

  const handleUpdateGroupAvatar = (data) => {
    const formData = new FormData();
    formData.append("avatar", data.photo[0]);
    updateGroupAvatarFunction("Updating group profile image", {
      chatId,
      formData,
    });
    setNewAvatarPath("");
  };

  return isLoadingGroupAvatar ? (
    <Loader />
  ) : (
    <Stack
      mt="0.4rem"
      direction="column"
      justifyContent="center"
      spacing="10px"
      alignItems="center"
    >
      <form onSubmit={handleSubmit(handleUpdateGroupAvatar)}>
        <AvatarUpload
          avatarPath={newAvatarPath || avatarPath}
          handleAvatarChange={handleAvatarChange}
          setAvatarPath={setNewAvatarPath}
          register={register}
          errors={errors}
        />
        {newAvatarPath && (
          <Tooltip title="Save group image">
            <Button
              sx={{
                bgcolor: mainColor,
                "&:hover": { bgcolor: mainColor },
                height: "30px",
                color: "white",
                width: "100%",
              }}
              type="submit"
            >
              Save
            </Button>
          </Tooltip>
        )}
      </form>
    </Stack>
  );
};

GroupAvatarSection.propTypes = {
  avatarPath: PropTypes.string,
  newAvatarPath: PropTypes.string,
  setNewAvatarPath: PropTypes.func.isRequired,
  chatId: PropTypes.string.isRequired,
};

export default GroupAvatarSection;
