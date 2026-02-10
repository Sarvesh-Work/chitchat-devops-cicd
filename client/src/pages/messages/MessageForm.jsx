import { AttachFile, Send } from "@mui/icons-material";
import { IconButton, styled, TextField } from "@mui/material";
import PropTypes from "prop-types";

const TypeMessage = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    border: "10px sold gray",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      border: "1px solid gray",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
      border: "1px solid gray",
    },
  },
});

function MessageForm({
  register,
  handleSubmit,
  onSubmit,
  openFileMenu,
  iconButtonStyles,
  onChangeMessage,
}) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        width: "100%",
        gap: "8px",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px",
      }}
    >
      <IconButton sx={iconButtonStyles} onClick={openFileMenu}>
        <AttachFile />
      </IconButton>

      <TypeMessage
        multiline
        maxRows={3}
        type="text"
        placeholder="Write a message..."
        {...register("message", {
          required: "Message is required",
          onChange: onChangeMessage,
        })}
        style={{
          flexGrow: 1,
        }}
      />

      <IconButton sx={iconButtonStyles} type="submit">
        <Send />
      </IconButton>
    </form>
  );
}

MessageForm.propTypes = {
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  openFileMenu: PropTypes.func.isRequired,
  iconButtonStyles: PropTypes.object,
  onChangeMessage: PropTypes.func,
};

export default MessageForm;
