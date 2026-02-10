import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import warningIcon from "../../assets/Icons/warning (1).png";
import { useDispatch, useSelector } from "react-redux";
import { setOpenConformDelate } from "../../redux/reducers/uiReducer";

function ConfirmDelete({ name, target, DeleteGroupFunction }) {
  const dispatch = useDispatch();
  const openConformDelate = useSelector((state) => state.ui.openConformDelate);

  const handleClose = () => {
    dispatch(setOpenConformDelate(false));
  };

  const isGroup = target === "Group";
  const actionText = isGroup ? "Exit" : "Delete";
  const dialogTitle = isGroup ? "Exit Group" : "Delete Chat";

  return (
    <Dialog open={openConformDelate} onClose={handleClose}>
      <Stack px="1rem" py="0.5rem" maxWidth="30rem">
        <Typography color="red" fontSize="25px" fontWeight="500">
          {dialogTitle}
        </Typography>
        <DialogContent sx={{ border: "1px solid #D3D3D3", mt: "4px" }}>
          <DialogContentText
            color="black"
            display="flex"
            gap="6px"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              component="img"
              src={warningIcon}
              alt=""
              height="60px"
              width="60px"
            />
            <Stack width="100%">
              <Typography>
                Are you sure you want to{" "}
                <span
                  style={{ color: "red", fontWeight: "600", padding: "3px" }}
                >
                  {actionText}
                </span>{" "}
                <Typography component="span" fontSize="20px" fontWeight="600">
                  {name}
                </Typography>{" "}
                this {target}?
              </Typography>
              <Typography color="grey">This action cannot be undone</Typography>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box mt="4px" display="flex" justifyContent="end" gap="1rem">
            <Tooltip title="Cancel">
              <Button
                sx={{
                  p: "1px",
                  px: "10px",
                  bgcolor: "white",
                  color: "black",
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Tooltip>
            <Tooltip title={`${actionText} the ${target?.toLowerCase()}`}>
              <Button
                sx={{
                  p: "1px",
                  px: "10px",
                  bgcolor: "red",
                  color: "white",
                  ":hover": { bgcolor: "red" },
                }}
                onClick={DeleteGroupFunction}
              >
                {actionText}
              </Button>
            </Tooltip>
          </Box>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}

ConfirmDelete.propTypes = {
  name: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  DeleteGroupFunction: PropTypes.func.isRequired,
};

export default ConfirmDelete;
