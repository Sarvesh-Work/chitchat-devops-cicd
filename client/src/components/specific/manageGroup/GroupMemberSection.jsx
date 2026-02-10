import { Box, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types"; // Import PropTypes
import { useMutationHoot } from "../../../hooks/hooks";
import { useRemoveGroupMemberMutation } from "../../../redux/apis/apiRtk";
import UserItem from "../../Shared/UserItem";
import Loader from "../../layout/Loader";

const GroupMembersSection = ({ members = [], chatId }) => {
  const [removeMember, isLoadingRemoveMember] = useMutationHoot(
    useRemoveGroupMemberMutation
  );

  const toggleRemoveMember = (userId) => {
    removeMember("Removing the member", { chatId, userId });
  };

  return (
    <Stack
      mt="1rem"
      padding="2rem"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Stack width={{ lg: "70%", xs: "100%" }}>
        <Typography color="gray" pb="10px" borderBottom="1px solid #d3d3d3">
          Group members
        </Typography>
        {isLoadingRemoveMember ? (
          <Loader />
        ) : (
          <Box mt="1rem">
            {members?.map((member) => (
              <UserItem
                key={member._id}
                user={member}
                isAdded
                handler={toggleRemoveMember}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

GroupMembersSection.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    })
  ).isRequired,
  chatId: PropTypes.string.isRequired,
};

export default GroupMembersSection;
