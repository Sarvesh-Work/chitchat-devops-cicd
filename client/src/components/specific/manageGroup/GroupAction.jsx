import { Box, Button, Stack, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { mainColor } from "../../../constants/constants";

const GroupActions = ({ toggleDeleteGroup, toggleAddMembers }) => {
  return (
    <Stack width={"100%"} alignItems={"center"} px="2rem">
      <Box
        display="flex"
        justifyContent="space-between"
        borderTop="1px solid #d3d3d3"
        gap="20px"
        pt="10px"
        width={{ lg: "70%", xs: "100%" }}
      >
        <Tooltip title="Add new member">
          <Button
            sx={{
              p: "1px",
              px: "10px",
              bgcolor: mainColor,
              color: "white",
              ":hover": { bgcolor: mainColor },
              mb: "20px",
            }}
            onClick={toggleAddMembers}
          >
            ADD MEMBER
          </Button>
        </Tooltip>
        <Tooltip title="Delete the group">
          <Button
            sx={{
              p: "1px",
              px: "10px",
              bgcolor: "red",
              color: "white",
              ":hover": { bgcolor: "red" },
              mb: "20px",
            }}
            onClick={toggleDeleteGroup}
          >
            Delete group
          </Button>
        </Tooltip>
      </Box>
    </Stack>
  );
};

GroupActions.propTypes = {
  toggleDeleteGroup: PropTypes.func.isRequired,
  toggleAddMembers: PropTypes.func.isRequired,
};

export default GroupActions;
