import { FileOpen } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { memo } from "react";
import { mainColor } from "../../constants/constants";
import { fileFormat, transFormImage } from "../../lib/features";

const messageStyles = (sameSender) => ({
  boxShadow:
    "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
  borderRadius: "7px",
  px: "8px",
  py: "4px",
  fontSize: "14px",
  fontWeight: "400",
  bgcolor: sameSender ? "black" : "white",
  color: sameSender ? "white" : "black",
  maxWidth: "100%",
  wordWrap: "break-word",
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
});

const attachmentStyle = (sameSender) => ({
  boxShadow:
    "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
  borderRadius: "10px",
  p: "3px",
  bgcolor: sameSender ? "black" : "white",
  color: sameSender ? "white" : "black",
  mb: "0px",
  display: "flex",
  alignItems: "center",
});

const timeStyles = (sameSender) => ({
  textAlign: sameSender ? "end" : "start",
  color: "text.secondary",
  fontSize: "12px",
});

function MessageComponent({ message, user }) {
  const { sender, attachments, content, createdAt } = message;
  const sameSender = sender._id === user._id;
  const time = moment(createdAt).fromNow();

  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        padding: "0.3rem",
        maxWidth: "70%",
        wordBreak: "break-word",
      }}
    >
      {!sameSender && (
        <Typography color={mainColor} px="2px" fontWeight="600" fontSize="13px">
          {sender.name}
        </Typography>
      )}
      {content && <Stack sx={messageStyles(sameSender)}>{content}</Stack>}
      {attachments?.length > 0 &&
        attachments.map((att, index) => {
          const url = att.url;
          const file = fileFormat(url);

          return (
            <Stack key={index} sx={attachmentStyle(sameSender)}>
              <a href={url} target="_blank" rel="noopener noreferrer" download>
                {attachmentCompo({ file, url })}
              </a>
            </Stack>
          );
        })}
      <Typography sx={timeStyles(sameSender)}>{time}</Typography>
    </div>
  );
}

const attachmentCompo = ({ file, url }) => {
  switch (file) {
    case "video":
      return <video src={url} width="200px" preload="none" controls />;
    case "image":
      return (
        <img
          src={transFormImage(url, 200)}
          alt="Attachment"
          height="170px"
          width="100%"
          style={{
            objectFit: "contain",
            borderRadius: "8px",
            marginBottom: "0px",
          }}
        />
      );
    case "audio":
      return <audio src={url} preload="none" controls />;
    default:
      return <FileOpen />;
  }
};

MessageComponent.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        fileName: PropTypes.string,
      })
    ),
    content: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  user: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default memo(MessageComponent);
