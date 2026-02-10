import { Box, Stack, Typography } from "@mui/material";
import GroupIcon from "../../../assets/Icons/people.png";

function NoGroupSelected() {
  return (
    <Stack
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      mt={"4rem"}
      justifyContent={{ lg: "normal", xs: "center" }}
    >
      <Box
        width={{ sm: "70%", md: "60%", lg: "35%", xs: "90%" }}
        height={{ sm: "45%", md: "30%", lg: "60%", xs: "50%" }}
        mt={{ lg: "4rem" }}
      >
        <img src={GroupIcon} alt="Group" width="100%" height="100%" />
      </Box>
      <Typography mt="20px" color="grey">
        {`"Select the group you want to edit."`}
      </Typography>
    </Stack>
  );
}

export default NoGroupSelected;
