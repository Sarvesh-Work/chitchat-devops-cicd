import { Stack, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { mainColor } from "../constants/constants";
import { Link } from "react-router-dom";

function NoGroupFoundPage() {
  return (
    <Stack height="100vh" justifyContent="center" alignItems="center">
      <Stack>
        <HelpOutlineIcon
          sx={{
            color: mainColor,
            fontSize: "14rem",
          }}
        />
      </Stack>
      <Typography mt="4rem" fontSize="20px" color="#858585">
        “It appears that you haven’t created any groups yet.”
      </Typography>
      <span>Please create a group first</span>
      <span>
        {"Go back to ----"} <Link to="/">Home</Link>
      </span>
    </Stack>
  );
}

export default NoGroupFoundPage;
