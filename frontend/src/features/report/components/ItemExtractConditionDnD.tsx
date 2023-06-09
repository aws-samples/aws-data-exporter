import React, { memo, useMemo } from "react";
import { ExtractCondition } from "../../../@types/report";
import useSortableDnD from "../../../hooks/useSortableDnD";
import ItemExtractCondition from "./ItemExtractCondition";

type Props = {
  id: string;
  index: number;
  condition: ExtractCondition;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onChange: (value: ExtractCondition) => void;
  onDelete: (index: number) => void;
};

const ItemExtractConditionDnD: React.FC<Props> = (props) => {
  // Settings Drag & Drop
  const { handlerId, isDragging, ref } = useSortableDnD({
    id: props.id,
    index: props.index,
    moveItem: props.moveItem,
    type: "ConditionItem",
  });
  const opacity = useMemo(() => (isDragging ? 0 : 1), [isDragging]);

  return (
    <ItemExtractCondition
      ref={ref}
      {...props}
      sx={{
        opacity,
        cursor: "move",
      }}
      handlerId={handlerId}
    />
  );
};

export default memo(ItemExtractConditionDnD);
