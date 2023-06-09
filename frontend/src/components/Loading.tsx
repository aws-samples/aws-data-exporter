import { Box } from "@mui/material";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

type Props = {
  color?: "primary" | "gray";
};
const Loading: React.FC<Props> = ({ color }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <ThreeDots color={color === "gray" ? "#A9A9A9" : "#42a5f5"} />
    </Box>
  );
};

export default Loading;
