import { List, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Loader from "../layout/Loader";
import UserItem from "../Shared/UserItem";

function MemberList({
  isLoading,
  friends,
  selectedMembers,
  selectMemberHandler,
}) {
  return (
    <>
      <Typography mt={"10px"} variant="h6" color={"grey"}>
        Add members
      </Typography>
      <List sx={{ overflowY: "scroll", height: "20rem", px: "10px" }}>
        {isLoading ? (
          <Loader />
        ) : (
          friends.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={() => selectMemberHandler(user._id)}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))
        )}
      </List>
    </>
  );
}

MemberList.propTypes = {
  isLoading: PropTypes.bool,
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
    })
  ).isRequired,
  selectedMembers: PropTypes.arrayOf(PropTypes.string),
  selectMemberHandler: PropTypes.func,
};

export default MemberList;
