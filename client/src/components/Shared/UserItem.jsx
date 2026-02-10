import { Avatar, Button, ListItem, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { memo } from "react";
import { mainColor } from "../../constants/constants";

function UserItem({ user: { name, _id, avatar }, handler, isAdded }) {
  return (
    <ListItem sx={{ p: 0 }}>
      <Stack
        width="100%"
        spacing="1rem"
        direction="row"
        mt="15px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar src={avatar} alt={`${name}'s avatar`} />
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "600",
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {name}
        </Typography>
        {isAdded ? (
          <Button
            sx={{
              mt: "2rem",
              bgcolor: "white",
              "&:hover": {
                bgcolor: "white",
              },
              height: "30px",
              boxShadow: "none",
              border: `1px solid  red`,
              color: "red",
              px: "1.4rem",
            }}
            variant="contained"
            onClick={() => handler(_id)}
          >
            Remove
          </Button>
        ) : (
          <Button
            sx={{
              mt: "2rem",
              bgcolor: "white",
              "&:hover": {
                bgcolor: "white",
              },
              height: "30px",
              boxShadow: "none",
              border: `1px solid ${mainColor}`,
              color: mainColor,
            }}
            variant="contained"
            onClick={() => handler(_id)}
          >
            Add
          </Button>
        )}
      </Stack>
    </ListItem>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    avatar: PropTypes.array,
  }).isRequired,
  handler: PropTypes.func,
  isAdded: PropTypes.bool,
};

export default memo(UserItem);
