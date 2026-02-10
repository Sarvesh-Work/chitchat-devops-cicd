import { Grid } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import GroupList from "../components/specific/manageGroup/GroupList";
import ManageGroup from "../components/specific/manageGroup/ManageGroup";
import { useErrors } from "../hooks/hooks";
import { useFetchGroupsQuery } from "../redux/apis/apiRtk";
import Loader from "./../components/layout/Loader";
import NoGroupFoundPage from "./NoGroupFoundPage";


const Groups = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("group");
  const myGroups = useFetchGroupsQuery("");
  const groups = myGroups?.data?.groups || [];

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
  ];

  useErrors(errors);


  

  return (
    <>
      {myGroups.isLoading ? (
        <Loader />
      ) : groups.length > 0 ? (
        <Grid container height="100vh">
          <Grid
            item
            lg={4}
            sm={5}
            sx={{ display: { sm: "block", xs: "none" }, overflow: "auto" }}
            height="100%"
          >
            <GroupList groups={groups} chatId={chatId} />
          </Grid>
          <Grid
            item
            lg={8}
            sm={7}
            xs={12}
            height="100%"
            sx={{ overflow: "auto" }}
          >
            <ManageGroup groups={groups} chatId={chatId} />
          </Grid>
        </Grid>
      ) : (
        <NoGroupFoundPage/>
        
      )}
    </>
  );
};

export default Groups;
