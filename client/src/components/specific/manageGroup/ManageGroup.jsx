import { Backdrop, Stack } from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import { useMutationHoot } from "../../../hooks/hooks";
import {
  useDeleteChatOrGroupMutation,
  useFetchChatDetailsQuery,
} from "../../../redux/apis/apiRtk";
import {
  setAddingMember,
  setOpenConformDelate,
} from "../../../redux/reducers/uiReducer";
import Loader from "../../layout/Loader";
import GroupActions from "./GroupAction";
import GroupAvatarSection from "./GroupAvatarSection";
import GroupHeader from "./GroupHeader";
import GroupMembersSection from "./GroupMemberSection";
import GroupNameSection from "./GroupNameSection";
import NoGroupSelected from "./NoGroupSelected";

const ConformDelete = lazy(() => import("../../Shared/ConformDelete"));
const AddMember = lazy(() => import("./AddMember"));

const ManageGroup = ({ chatId }) => {
  const [openGroupList, setOpenGroupList] = useState(false);
  const [edit, setEdit] = useState(false);
  const [avatarPath, setAvatarPath] = useState("");
  const [newAvatarPath, setNewAvatarPath] = useState("");
  const [groupName, setGroupName] = useState("");
  const [updateGroupName, setUpdateGroupName] = useState("");
  const { isAddingMember } = useSelector((state) => state.ui);
  const [deleteGroup, isLoadingDeleteGroup] = useMutationHoot(
    useDeleteChatOrGroupMutation
  );
  const { openConformDelate } = useSelector((state) => state.ui);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const groupDetails = useFetchChatDetailsQuery(chatId, { skip: !chatId });
  console.log(groupDetails)

  const toggleOpenConformDeleteGroup = () => {
    dispatch(setOpenConformDelate(true));
  };

  const DeleteGroupFunction = () => {
    deleteGroup("Deleting the Group", chatId);
    dispatch(setOpenConformDelate(false));
    navigate("/groups");
  };

  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setAvatarPath(groupDetails.data.chat.groupAvatar);
    }
  }, [groupDetails.data]);

  if (groupDetails.isLoading) {
    return <Loader />;
  }

  return isLoadingDeleteGroup ? (
    <Loader />
  ) : (
    <Stack
      padding="1rem"
      bgcolor="#f4f4f4"
      height="100vh"
      sx={{
        overflowY: "scroll",
      }}
    >
      <GroupHeader
        toggleGroupList={() => setOpenGroupList(!openGroupList)}
        navigateBack={() => navigate("/")}
      />
      {chatId ? (
        <Stack height="100%">
          <GroupAvatarSection
            avatarPath={avatarPath}
            newAvatarPath={newAvatarPath}
            setNewAvatarPath={setNewAvatarPath}
            chatId={chatId}
          />
          <GroupNameSection
            groupName={groupName}
            updateGroupName={updateGroupName}
            setUpdateGroupName={setUpdateGroupName}
            edit={edit}
            setEdit={setEdit}
            chatId={chatId}
          />
          <GroupMembersSection
            members={groupDetails?.data?.chat?.members}
            chatId={chatId}
          />
          <GroupActions
            toggleDeleteGroup={toggleOpenConformDeleteGroup}
            toggleAddMembers={() => dispatch(setAddingMember(true))}
          />
        </Stack>
      ) : (
        <NoGroupSelected />
      )}
      {openConformDelate && (
        <Suspense fallback={<Backdrop open />}>
          <ConformDelete
            groupName={groupName}
            target={"group"}
            DeleteGroupFunction={DeleteGroupFunction}
          />
        </Suspense>
      )}
      {isAddingMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMember chatId={chatId} />
        </Suspense>
      )}
    </Stack>
  );
};

ManageGroup.propTypes = {
  chatId: PropTypes.string,
};

export default ManageGroup;
