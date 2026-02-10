import { Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { mainColor } from "../../../constants/constants";
import AvatarCard from "../../Shared/AvatarCard";
import { Link } from "../../styles/StyleComponent";

const GroupList = ({ groups = [], chatId, width = "100%" }) => {
  return (
    <Stack
      color="white"
      width={width}
      height="100%"
      p={{ lg: "2rem", xs: "1rem" }}
      bgcolor="black"
      overflow="auto"
    >
      <Typography
        textAlign="center"
        fontSize="30px"
        fontWeight="600"
        color={mainColor}
      >
        Manage Groups
      </Typography>
      <Typography mt="15px">All groups created by you</Typography>
      <Stack>
        {groups.map((group, index) => (
          <AllGroups key={index} group={group} chatId={chatId} />
        ))}
      </Stack>
    </Stack>
  );
};

const AllGroups = ({ group, chatId }) => {
  const { name, avatar, _id } = group;

  const handleClick = (e) => {
    if (chatId === _id) {
      e.preventDefault();
    }
  };

  return (
    <>
      {_id && (
        <Link
          sx={{
            mt: "7px",
            borderRadius: "10px",
            backgroundColor: chatId === _id ? "#FBF4FB" : "white",
          }}
          to={`?group=${_id}`}
          onClick={handleClick}
        >
          <Stack
            spacing="1rem"
            px="0.7rem"
            py="1rem"
            direction="row"
            display="flex"
            alignItems="center"
          >
            <AvatarCard avatar={avatar} />
            <Typography>{name}</Typography>
          </Stack>
        </Link>
      )}
    </>
  );
};

GroupList.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      avatar: PropTypes.object,
    })
  ),
  chatId: PropTypes.string,
  width: PropTypes.string,
  toggleGroupList: PropTypes.func,
};

AllGroups.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.object,
  }),
  chatId: PropTypes.string,
  toggleGroupList: PropTypes.func,
};

export default GroupList;
