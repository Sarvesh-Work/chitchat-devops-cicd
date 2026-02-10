import { KeyboardBackspace, Menu } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { mainColor } from "../../../constants/constants";

const GroupHeader = ({ toggleGroupList, navigateBack }) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Tooltip title="Back" placement="right">
        <IconButton
          sx={{
            borderRadius: "10px",
            bgcolor: mainColor,
            color: "white",
            p: { sm: "0.6rem", xs: "0.5rem" },
            ":hover": { bgcolor: mainColor },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspace />
        </IconButton>
      </Tooltip>
      <Tooltip title="Menu" placement="right">
        <IconButton
          sx={{
            borderRadius: "10px",
            bgcolor: mainColor,
            color: "white",
            p: "0.5rem",
            ":hover": { bgcolor: mainColor },
            display: { sm: "none", xs: "flex" },
          }}
          onClick={toggleGroupList}
        >
          <Menu />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

GroupHeader.propTypes = {
  toggleGroupList: PropTypes.func.isRequired,
  navigateBack: PropTypes.func.isRequired,
};

export default GroupHeader;
