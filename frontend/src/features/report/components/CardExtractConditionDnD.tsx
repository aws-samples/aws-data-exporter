import { Grid } from "@mui/material";
import React, { memo, useCallback } from "react";
import { useDrop } from "react-dnd";
import { ExtractCondition, TableColumn } from "../../../@types/report";
import CardAreaDnD from "./CardAreaDnD";
import ItemExtractConditionDnD from "./ItemExtractConditionDnD";

export interface Props {
  droppedConditions: ExtractCondition[];
  onDrop: (item: TableColumn) => void;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onChange: (value: ExtractCondition, index: number) => void;
  onDelete: (index: number) => void;
}

const CardExtractConditionDnD: React.FC<Props> = ({
  onDrop,
  droppedConditions,
  moveItem,
  onChange,
  onDelete,
}) => {
  // Settings for Drag & Drop
  const [, drop] = useDrop({
    accept: "item",
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const renderItem = useCallback(
    (item: ExtractCondition, index: number) => {
      return (
        <Grid
          item
          xs={12}
          sx={{ pr: 1, pb: 1 }}
          key={`${item.columnName}-${index}`}
        >
          <ItemExtractConditionDnD
            index={index}
            id={item.columnName}
            condition={item}
            moveItem={moveItem}
            onChange={(value) => {
              onChange(value, index);
            }}
            onDelete={(index) => {
              onDelete(index);
            }}
          />
        </Grid>
      );
    },
    [moveItem, onChange, onDelete]
  );

  return (
    <CardAreaDnD ref={drop} height="calc(100% - 57px)">
      <Grid container>
        {droppedConditions.map((condition, i) => renderItem(condition, i))}
      </Grid>
    </CardAreaDnD>
  );
};

export default memo(CardExtractConditionDnD);
