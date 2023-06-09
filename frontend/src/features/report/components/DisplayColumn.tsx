import AbcIcon from "@mui/icons-material/Abc";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NumbersIcon from "@mui/icons-material/Numbers";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback } from "react";
import { TableColumn } from "../../../@types/report";

export type Props = {
  col: TableColumn;
};

const DisplayColumn: React.FC<Props> = ({ col }) => {
  const renderIcon = useCallback((type: TableColumn["type"]) => {
    return type === "string" ? (
      <AbcIcon />
    ) : type === "number" ? (
      <NumbersIcon />
    ) : (
      <CalendarMonthIcon />
    );
  }, []);
  return (
    <Grid container>
      {renderIcon(col.type)}
      <Box sx={{ ml: 1 }}>{col.name}</Box>
    </Grid>
  );
};

export default DisplayColumn;
