import { Grid } from "@mui/material";
import React, { memo, useCallback } from "react";
import { useDrop } from "react-dnd";
import { TableColumn } from "../../../@types/report";
import CardAreaDnD from "./CardAreaDnD";
import ItemSortableColumnDnD from "./ItemSortableColumnDnD";

export interface Props {
  selectedColumns: TableColumn[];
  onDrop: (item: TableColumn) => void;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (index: number) => void;
}

const CardSelectColumnDnD: React.FC<Props> = ({
  onDrop,
  selectedColumns,
  moveItem,
  onDelete,
}) => {
  const [, drop] = useDrop({
    accept: "item",
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const renderColumn = useCallback(
    (col: TableColumn, index: number) => {
      return (
        <Grid item xs={3} sx={{ pr: 1, pb: 1 }} key={col.name}>
          <ItemSortableColumnDnD
            index={index}
            id={col.name}
            col={col}
            moveItem={moveItem}
            onDelete={onDelete}
          />
        </Grid>
      );
    },
    [moveItem, onDelete]
  );

  return (
    <CardAreaDnD ref={drop} height="calc(100% - 57px)">
      <Grid container ref={drop}>
        {selectedColumns.map((col, i) => renderColumn(col, i))}
      </Grid>
    </CardAreaDnD>
  );
};

export default memo(CardSelectColumnDnD);
