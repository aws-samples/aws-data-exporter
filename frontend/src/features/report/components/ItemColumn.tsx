import { Paper } from "@mui/material";
import React, { memo } from "react";
import { useDrag } from "react-dnd";
import { TableColumn } from "../../../@types/report";
import DisplayColumn from "./DisplayColumn";

export type Props = {
  col: TableColumn;
};

const ItemColumn: React.FC<Props> = ({ col }) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "item",
      item: col,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [col]
  );

  return (
    <Paper
      ref={drag}
      sx={{
        mb: 1,
        p: 1,
        cursor: "move",
        opacity,
      }}
    >
      <DisplayColumn col={col} />
    </Paper>
  );
};

export default memo(ItemColumn);
