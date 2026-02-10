import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { lazy, memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainColor } from "../../constants/constants";
import { setIsMobileAndTabletHeaderMenuOpen } from "../../redux/reducers/uiReducer";
import Loader from "../layout/Loader";
import MobileHeader from "../layout/MobileHeader";
import MessageItems from "../Shared/MessageItems";
import { SearchBox, SearchCompo } from "../styles/StyleComponent";

const HeaderMenuForTablet = lazy(() => import("../menu/HeaderMenuForTablets"));

const MessageList = ({
  w = "100%",
  chats,
  chatId,
  newMessagesAlert,
  handleDeleteChat,
  searchValue,
  setSearchValue,
  isLoadingChats,
  onlineUsers,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [anchor, setAnchor] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleChange = (e) => setSearchValue(e.target.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoadingChats) {
      setDataLoaded(true);
    }
  }, [isLoadingChats]);

  const getFilteredChats = () => {
    if (selectedCategory === "Groups") {
      return chats.filter((chat) => chat.groupChat);
    }
    return chats;
  };

  const load = true;

  const openHeaderMobileMenu = (e) => {
    setAnchor(e.currentTarget); // Set the anchor for the menu
    dispatch(setIsMobileAndTabletHeaderMenuOpen(true)); // Open the menu
  };

  const closeHeaderMobileMenu = () => {
    setAnchor(null);
    dispatch(setIsMobileAndTabletHeaderMenuOpen(false));
  };
  const renderChatItems = () => {
    return getFilteredChats()?.map((data) => {
      const { _id, avatar, groupChat, name, members, lastMessage } = data;
      const isOnline = members?.some((member) => onlineUsers.includes(member));
      const newMessageAlert = newMessagesAlert?.find(
        ({ chatId }) => chatId === _id
      );

      return (
        <MessageItems
          key={_id}
          newMessage={newMessageAlert}
          avatar={avatar}
          name={name}
          groupChat={groupChat}
          _id={_id}
          sameSender={chatId === _id}
          handleDeleteChat={handleDeleteChat}
          isOnline={isOnline}
          lastMessage={lastMessage}
        />
      );
    });
  };

  return (
    <Stack
      height="100vh"
      width={w}
      borderRight="1px solid #E9EAEC"
      justifyContent={{ sm: "inherit", xs: "space-between" }}
    >
      <Stack
        sx={{
          py: "10px",
        }}
        height="100%"
      >
        <HeaderMenuForTablet
          anchorE1={anchor}
          closeHeaderMobileMenu={closeHeaderMobileMenu}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          px={{ lg: "15px", xs: "7px" }}
        >
          <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>
            Messages
          </Typography>
          <IconButton
            size="small"
            sx={{
              display: { lg: "none", sm: "flex", xs: "none" },
              p: 0,
              width: "50px",
              alignItems: "center",
            }}
            onClick={openHeaderMobileMenu}
          >
            <MoreHorizIcon />
          </IconButton>
        </Box>

        <Box
          px={{ lg: "15px", xs: "7px" }}
          display="flex"
          justifyContent="space-between"
          mt="14px"
        >
          <SearchCompo onChange={handleChange} value={searchValue}>
            <SearchBox type="text" placeholder="Search..." />
            <i
              className="bi bi-search"
              style={{
                fontSize: "17px",
                color: "gray",
                width: "15%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </SearchCompo>
        </Box>

        <Box
          px={{ lg: "15px", xs: "7px" }}
          display="flex"
          justifyContent="space-between"
          mt="15px"
        >
          <Stack direction="row" spacing={1}>
            <Button
              onClick={() => setSelectedCategory("All")}
              sx={{
                color: selectedCategory === "All" ? mainColor : "#757575",
                fontWeight: selectedCategory === "All" ? "bold" : "normal",
                p: "2px",
                borderRadius: "7px",
                bgcolor: "#E9EAEC",
                ":hover": {
                  bgcolor: "#E9EAEC",
                },
              }}
            >
              All
            </Button>
            <Button
              onClick={() => setSelectedCategory("Groups")}
              sx={{
                color: selectedCategory === "Groups" ? mainColor : "#757575",
                fontWeight: selectedCategory === "Groups" ? "bold" : "normal",
                p: "2px",
                px: "15px",
                borderRadius: "7px",
                bgcolor: "#E9EAEC",
                ":hover": {
                  bgcolor: "#E9EAEC",
                },
              }}
            >
              Groups
            </Button>
          </Stack>
        </Box>
        <Stack overflow="auto" mt="1rem" height="100%">
          {isLoadingChats ? (
            <Loader />
          ) : dataLoaded && getFilteredChats()?.length === 0 ? (
            <Stack color={mainColor} padding="20px" textAlign="center">
              <Typography variant="h6">No results</Typography>
            </Stack>
          ) : (
            renderChatItems()
          )}
        </Stack>
      </Stack>

      <Stack display={{ sm: "none", xs: "flex" }} width={"100%"}>
        <MobileHeader />
      </Stack>
    </Stack>
  );
};

MessageList.propTypes = {
  w: PropTypes.string,
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      groupChat: PropTypes.bool,
      members: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string,
    })
  ).isRequired,
  onlineUsers: PropTypes.arrayOf(PropTypes.string),
  chatId: PropTypes.string,
  newMessagesAlert: PropTypes.arrayOf(
    PropTypes.shape({
      chatId: PropTypes.string,
      count: PropTypes.number,
    })
  ),
  handleDeleteChat: PropTypes.func,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func,
  isLoadingChats: PropTypes.bool.isRequired,
};

export default memo(MessageList);
