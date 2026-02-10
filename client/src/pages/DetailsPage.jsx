import { ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import { Avatar, Box, Button, Drawer, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDetailsOpen,
  setOpenConformDelate,
} from "../redux/reducers/uiReducer";
import { mainColor } from "../constants/constants";
import ConformDelete from "../components/Shared/ConformDelete";
import { useMutationHoot } from "../hooks/hooks";
import { useExitGroupMutation } from "../redux/apis/apiRtk";
import moment from "moment";

function DetailsPage({ data }) {
  const { isDetailsOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [exitGroup] = useMutationHoot(useExitGroupMutation);

  const handleClose = () => {
    dispatch(setIsDetailsOpen(false));
  };

  const handleOpenConfirmDelete = () => {
    dispatch(setOpenConformDelate(true));
  };

  const confirmDeleteHandler = () => {
    exitGroup("Leaving Group...", data._id);
    dispatch(setOpenConformDelate(false));
    dispatch(setIsDetailsOpen(false));
  };

  if (!data) return null;

  return (
    <Drawer anchor="right" open={isDetailsOpen} onClose={handleClose}>
      <Stack
        width={{ lg: "30vw", sm: "40vw", xs: "70vw" }}
        p="2rem"
        justifyContent="center"
        alignItems="center"
        mt="1rem"
      >
        <Avatar
          src={data.groupChat ? data.groupAvatar : data.avatar}
          sx={{ width: "7rem", height: "7rem" }}
        />
        <Typography
          textAlign="center"
          fontSize="30px"
          mt="3px"
          fontWeight="500"
        >
          {data.name}
        </Typography>
        {data.groupChat && (
          <Typography
            textAlign="center"
            fontSize="17px"
            mt="1px"
            color="#858585"
          >
            Group. {data.members?.length} Members
          </Typography>
        )}

        {data.groupChat && (
          <Stack mt="2rem" width="100%">
            <Box fontSize="18px" borderBottom="1.4px solid #E9EAEC">
              Members
            </Box>
            {data.members.map((member) => (
              <Stack
                key={member._id}
                mt="1rem"
                justifyContent="space-between"
                direction="row"
              >
                <Stack direction="row" gap="0.6rem">
                  <Avatar src={member.avatar} />
                  <Stack justifyContent="center">
                    <Typography>{member.name}</Typography>
                  </Stack>
                </Stack>
                {data.creator === member._id && (
                  <Stack justifyContent="center">
                    <Stack
                      justifyContent="center"
                      height="30px"
                      px="6px"
                      borderRadius="7px"
                      border={`1px solid ${mainColor}`}
                      sx={{ color: mainColor, backgroundColor: "#f2c8e0" }}
                    >
                      Group Admin
                    </Stack>
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        )}

        {data.groupChat ? (
          <Stack direction="row" width="100%" mt="2rem" gap="0.6rem">
            <Button
              sx={{
                p: "0.2rem",
                color: mainColor,
                width: "100%",
                border: `1px solid ${mainColor}`,
              }}
              onClick={handleOpenConfirmDelete}
            >
              <Stack alignItems="center" width="40px">
                <ExitToAppIcon sx={{ color: mainColor, fontSize: "30px" }} />
              </Stack>
              <Stack justifyContent="center">
                <Typography>Exit Group</Typography>
              </Stack>
            </Button>
          </Stack>
        ) : (
          <Stack mt="1.5rem" width="100%">
            <InfoSection title="Bio" content={data.bio} />
            <InfoSection
              title="Join date"
              content={moment(data.createdAt).format("LL")}
            />
            <InfoSection title="Email" content={data.email} />
          </Stack>
        )}

        <ConformDelete
          name={data.name}
          target="Group"
          DeleteGroupFunction={confirmDeleteHandler}
        />
      </Stack>
    </Drawer>
  );
}

const InfoSection = ({ title, content }) => (
  <Stack mt="1.5rem">
    <Typography
      color="#858585"
      fontSize="20px"
      borderBottom="1.4px solid #E9EAEC"
    >
      {title}
    </Typography>
    <Stack px="0.4rem" py="2px" fontSize="18px">
      {content}
    </Stack>
  </Stack>
);

InfoSection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

DetailsPage.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    groupAvatar: PropTypes.string,
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired,
    groupChat: PropTypes.bool.isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        name: PropTypes.string.isRequired,
      })
    ),
    creator: PropTypes.string,
    bio: PropTypes.string,
    createdAt: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default DetailsPage;
