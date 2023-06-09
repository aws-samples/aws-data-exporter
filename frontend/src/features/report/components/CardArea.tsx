import { Box, Paper } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { ReactNode } from "react";
import useMuiTheme from "../../../hooks/useMuiTheme";

type Props = {
  height: string;
  children: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CardArea = React.forwardRef<any, Props>(function CardAreaDnD(
  { height, children },
  ref
) {
  const { isDark } = useMuiTheme();

  return (
    <Paper
      ref={ref}
      sx={{
        height,
        overflowY: "auto",
      }}
      variant="outlined"
      square
    >
      <Box
        sx={{
          p: 1,
          bgcolor: isDark ? "rgba(255, 255, 255, 0.12)" : grey[200],
          height: "100%",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
});

export default CardArea;
