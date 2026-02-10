import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrors, useMutationHoot } from "../../../hooks/hooks";
import {
  useAddGroupMembersMutation,
  useFetchFriendsQuery,
} from "../../../redux/apis/apiRtk";
import { setAddingMember } from "../../../redux/reducers/uiReducer";
import UserItem from "../../Shared/UserItem";
import Loader from "../../layout/Loader";

function AddMember({ chatId }) {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const dispatch = useDispatch();

  const [addMembers, isLoadingAddMembers] = useMutationHoot(
    useAddGroupMembersMutation
  );

  const { isLoading, data, isError, error } = useFetchFriendsQuery(chatId);
  const { isAddingMember } = useSelector((state) => state.ui);

  useErrors([{ isError, error }]);

  const selectMemberHandler = useCallback(
    (id) => {
      setSelectedMembers((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((memberId) => memberId !== id)
          : [...prevSelected, id]
      );
    },
    [setSelectedMembers]
  );

  const handleClose = useCallback(() => {
    setSelectedMembers([]);
    dispatch(setAddingMember(false));
  }, [dispatch]);

  const addMemberSubmitHandler = useCallback(() => {
    if (selectedMembers.length > 0) {
      addMembers("Adding Members...", { members: selectedMembers, chatId });
    }
    handleClose();
  }, [selectedMembers, addMembers, chatId, handleClose]);

  return (
    <Dialog open={isAddingMember} onClose={handleClose} fullWidth maxWidth="sm">
      <Stack px="2rem" py="0.8rem">
        <Typography fontSize="25px" fontWeight="500" gutterBottom>
          Add New Member
        </Typography>

        <DialogContent sx={{ border: "1px solid #D3D3D3", mt: 1, p: 2 }}>
          {isLoading ? (
            <Loader />
          ) : data?.friends?.length ? (
            data.friends.map((friend) => (
              <UserItem
                key={friend._id}
                user={friend}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(friend._id)}
              />
            ))
          ) : (
            <Typography>No friends available</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ mt: 1 }}>
          <Box display="flex" justifyContent="end" gap="1rem" width="100%">
            <Tooltip title="Cancel">
              <Button
                sx={{
                  p: 1,
                  px: 2,
                  bgcolor: "white",
                  color: "black",
                  ":hover": { bgcolor: "#f0f0f0" },
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Tooltip>
            <Tooltip title="Add Members">
              <Button
                sx={{
                  p: 1,
                  px: 2,
                  bgcolor: "red",
                  color: "white",
                  ":hover": { bgcolor: "darkred" },
                }}
                onClick={addMemberSubmitHandler}
                disabled={isLoadingAddMembers}
              >
                Add Members
              </Button>
            </Tooltip>
          </Box>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}

AddMember.propTypes = {
  chatId: PropTypes.string.isRequired,
};

export default AddMember;
