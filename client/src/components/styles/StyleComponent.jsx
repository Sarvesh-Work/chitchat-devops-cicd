import { styled } from "@mui/material";
import { Link as LinkCompo } from "react-router-dom";

export const VisuallyHiddenInput = styled("input")({
  clipPath: "rect(0 0 0 0)",
  padding: 0,
  position: "absolute",
});

export const SearchBox = styled("input")({
  width: "85%",
  borderRadius: "20px",
  padding: "13px",
  fontSize: "20px",
  border: "none",
  color: "black",
  backgroundColor: "#E9EAEC",
  outline: "none",
});

export const SearchCompo = styled("div")({
  width: "100%",
  position: "relative",
  display: "flex",
  borderRadius: "13px",
  outline: "none",
  fontSize: "13px",
  textDecoration: "none",
  backgroundColor: "#E9EAEC",
});

export const Link = styled(LinkCompo)({
  textDecoration: "none",
  color: "black",
  ":hover": {
    backgroundColor: "#FBF4FB",
  },
  width: "100%",
  marginTop: "3px",
  backgroundColor: "white",
});


