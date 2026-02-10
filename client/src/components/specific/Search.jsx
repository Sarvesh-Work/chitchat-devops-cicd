import { Dialog, DialogTitle, List, Stack } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainColor } from "../../constants/constants";
import { useMutationHoot } from "../../hooks/hooks";
import {
  useLazySearchNonFriendsQuery,
  useRequestFriendMutation,
} from "../../redux/apis/apiRtk";
import { setSearching } from "../../redux/reducers/uiReducer";
import Loader from "../layout/Loader";
import UserItem from "../Shared/UserItem";
import { SearchBox, SearchCompo } from "../styles/StyleComponent";

function Search() {
  const [usersWhichIsNotFriendState, setUsersWhichIsNotFriendState] = useState(
    []
  );
  const [searchValue, setSearchValue] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { isSearching } = useSelector((state) => state.ui);
  const [searchUserNotFriend] = useLazySearchNonFriendsQuery();
  const [sendFriendRequest] = useMutationHoot(useRequestFriendMutation);
  const dispatch = useDispatch();

  const handleChange = (e) => setSearchValue(e.target.value);

  const addFriend = async (id) => {
    await sendFriendRequest("Sending Friend request", { userId: id });
  };

  const handleClose = useCallback(() => {
    dispatch(setSearching(false));
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setIsLoadingUser(true);
      try {
        const response = await searchUserNotFriend(searchValue.trim());
        setUsersWhichIsNotFriendState(response?.data?.users || []);
      } catch (error) {
        console.error("Error in getMyChats:", error);
      } finally {
        setIsLoadingUser(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchValue, searchUserNotFriend]);

  return (
    <Dialog open={isSearching} onClose={handleClose}>
      <Stack sx={{ maxWidth: "100%", width: "30rem", p: "1.5rem" }}>
        <DialogTitle
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            p: 0,
            pb: "4px",
            borderBottom: "1px solid #d3d3d3",
          }}
        >
          Search a new member
        </DialogTitle>
        <SearchCompo sx={{ mt: "10px", mb: "3px" }}>
          <SearchBox
            placeholder="Search..."
            onChange={handleChange}
            value={searchValue}
          />
          <i
            className="bi bi-search"
            style={{
              fontSize: "20px",
              color: "gray",
              width: "15%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </SearchCompo>
        {isLoadingUser ? (
          <Stack height="323px" justifyContent="center">
            <Loader />
          </Stack>
        ) : usersWhichIsNotFriendState.length < 1 ? (
          <Stack
            color={mainColor}
            padding="20px"
            textAlign="center"
            height="54vh"
          >
            <h4>{"The user you're looking for is not found"}</h4>
          </Stack>
        ) : (
          <List
            sx={{
              overflowY: "scroll",
              mt: "5px",
              height: "20rem",
              padding: "10px",
            }}
          >
            {usersWhichIsNotFriendState.map((user) => (
              <UserItem user={user} key={user._id} handler={addFriend} />
            ))}
          </List>
        )}
      </Stack>
    </Dialog>
  );
}

export default Search;
