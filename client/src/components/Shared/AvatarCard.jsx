import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import { PropTypes } from "prop-types";

function AvatarCard({ avatar }) {
  return (
    <Stack direction={"row"} spacing={"0.5"}>
      <AvatarGroup max={4}>
        <Box width={"3rem"} height={"3rem"}>
          <Avatar
            key={Math.random * 100}
            src={avatar}
            sx={{
              width: "3rem",
              height: "2.9rem",
              p: "0px",
            }}
          ></Avatar>
        </Box>
      </AvatarGroup>
    </Stack>
  );
}

export default AvatarCard;

AvatarCard.propTypes = {
  avatar: PropTypes.string,
};
