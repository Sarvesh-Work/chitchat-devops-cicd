import { Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Stack height="100vh" justifyContent="center" alignItems="center">
      <Typography fontSize="15rem" fontWeight="600">
        404!
      </Typography>
      <Stack textAlign="center">
        <Typography fontSize="20px" fontWeight="600">
          PAGE NOT FOUND
        </Typography>
        <Typography fontSize="20px" fontWeight="600">
          {"LET'S"} GET YOU BACK TO THE FUN STUFF
        </Typography>
        <Link to="/">HOME PAGE</Link>
      </Stack>
    </Stack>
  );
};

export default PageNotFound;
