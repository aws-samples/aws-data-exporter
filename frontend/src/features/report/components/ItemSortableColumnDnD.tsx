import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, IconButton, Paper } from "@mui/material";
import React, { memo, useMemo } from "react";
import { TableColumn } from "../../../@types/report";
import useSortableDnD from "../../../hooks/useSortableDnD";
import DisplayColumn from "./DisplayColumn";

export interface Props {
  id: string;
  index: number;
  col: TableColumn;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (index: number) => void;
}

const ItemSortableColumnDnD: React.FC<Props> = ({
  id,
  col,
  index,
  moveItem,
  onDelete,
}) => {
  // Settings Drag & Drop
  const { handlerId, isDragging, ref } = useSortableDnD({
    id,
    index,
    moveItem,
    type: "SelectItem",
  });
  const opacity = useMemo(() => (isDragging ? 0 : 1), [isDragging]);

  return (
    <Paper
      ref={ref}
      sx={{
        opacity,
        px: 1,
        py: 0.5,
        cursor: "move",
      }}
      data-handler-id={handlerId}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <DisplayColumn col={col} />
        </Grid>
        <Grid item>
          <IconButton
            color="error"
            size="small"
            onClick={() => {
              onDelete(index);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default memo(ItemSortableColumnDnD);
