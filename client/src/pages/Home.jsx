import { Menu } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import chatIcon from "../assets/Icons/open.png";
import { chatBg, mainColor } from "../constants/constants";
import { setMobileMenuOpen } from "../redux/reducers/uiReducer";
import AppLayout from "./../components/layout/AppLayout";

function Home() {
  const dispatch = useDispatch();
  const handelMobile = () => dispatch(setMobileMenuOpen(true));

  return (
    <Stack
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={chatBg}
    >
      <Stack>
        <Tooltip title="Friends Menu" placement="right">
          <IconButton
            sx={{
              borderRadius: "10px",
              height: "50px",
              width: "50px",
              bgcolor: mainColor,
              color: "white",
              p: "0.5rem",
              m: "6px",
              fontSize: "15px",
              ":hover": { bgcolor: mainColor },
              display: { sm: "none", xs: "flex" },
              position: "absolute",
              top: 30,
              left: 30,
            }}
            onClick={handelMobile}
          >
            <Menu />
          </IconButton>
        </Tooltip>
      </Stack>
      <Box maxWidth={"30%"} maxHeight="45%">
        <img src={chatIcon} alt="Group" width="100%" height="100%" />
      </Box>
      <Typography mt={"1rem"}>
        Welcome to
        <span style={{ color: mainColor, fontSize: "20px", fontWeight: "600" }}>
          ChitChat
        </span>
      </Typography>
      <Typography mt="5px" color="grey">
        {`"Select a chat or a group"`}
      </Typography>
    </Stack>
  );
}

export default AppLayout(Home);
