import {
  Box,
  Button,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { mainColor } from "../../../constants/constants";
import { useMutationHoot } from "../../../hooks/hooks";
import { useRenameGroupMutation } from "../../../redux/apis/apiRtk";
import Loader from "../../layout/Loader";

const GroupNameSection = ({
  groupName,
  setUpdateGroupName,
  updateGroupName,
  edit,
  setEdit,
  chatId,
}) => {
  const [updateGroupNameFunction, isLoadingGroupName] = useMutationHoot(
    useRenameGroupMutation
  );

  const handleUpdateGroupName = () => {
    setEdit(false);
    updateGroupNameFunction("Updating group name", {
      chatId,
      name: updateGroupName,
    });
  };

  return edit ? (
    <Stack
      direction="column"
      display="flex"
      p="3px"
      alignItems="center"
      width="100%"
    >
      <Stack width={{ lg: "50%", xs: "100%" }}>
        <Typography p="2px">New name</Typography>
        <TextField
          sx={{ width: "100%", p: "2px" }}
          placeholder="New name of group..."
          onChange={(e) => setUpdateGroupName(e.target.value)}
        />
        <Box display="flex" justifyContent="end" mt="7px" gap="10px">
          <Button
            sx={{ color: "black", fontWeight: "600" }}
            onClick={() => setEdit(false)}
          >
            Cancel
          </Button>
          <Tooltip title="Save new name" placement="left">
            <Button
              sx={{
                p: "1px",
                px: "5px",
                bgcolor: mainColor,
                color: "white",
                ":hover": { bgcolor: mainColor },
              }}
              onClick={handleUpdateGroupName}
            >
              Save
            </Button>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  ) : isLoadingGroupName ? (
    <Loader />
  ) : (
    <Stack
      direction="row"
      gap="1rem"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Stack
        width={{ lg: "50%", xs: "100%" }}
        direction="column"
        alignItems="center"
        textAlign="center"
      >
        <Typography
          sx={{
            pt: "0.4rem",
            fontSize: "20px",
            fontWeight: "500",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          Group name
        </Typography>
        <Typography
          sx={{
            pt: "0.4rem",
            fontSize: "30px",
            fontWeight: "500",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {groupName}
        </Typography>
        <Box display="flex" alignItems="end" mt="0.2rem">
          <Tooltip title="Change group name" placement="right">
            <Button
              sx={{
                p: "1px",
                px: "5px",
                bgcolor: mainColor,
                color: "white",
                ":hover": { bgcolor: mainColor },
              }}
              onClick={() => setEdit(true)}
            >
              Change
            </Button>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  );
};

GroupNameSection.propTypes = {
  groupName: PropTypes.string,
  setUpdateGroupName: PropTypes.func,
  updateGroupName: PropTypes.string,
  edit: PropTypes.bool,
  setEdit: PropTypes.func,
  chatId: PropTypes.string,
};

export default GroupNameSection;
