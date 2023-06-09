import DeleteIcon from "@mui/icons-material/Delete";
import {
  Grid,
  IconButton,
  Paper,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import type { Identifier } from "dnd-core";
import React, { memo, useCallback } from "react";
import {
  ConditionOperator,
  ExtractCondition,
  TableColumn,
} from "../../../@types/report";
import DisplayColumn from "./DisplayColumn";
import InputConditionDate from "./InputConditionDate";

import { useTranslation } from "react-i18next";
import SelectExtractCondition from "./SelectExtractCondition";

type Props = {
  condition: ExtractCondition;
  sx?: SxProps<Theme>;
  handlerId?: Identifier | null;
  onChange: (value: ExtractCondition) => void;
} & (
  | {
      disableDelete: true;
    }
  | {
      disableDelete?: false;
      index: number;
      onDelete: (index: number) => void;
    }
);

const getColumnType = (
  conditionType: ExtractCondition["type"]
): TableColumn["type"] => {
  switch (conditionType) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "absoluteDate":
      return "date";
    case "relativeDate":
      return "date";
    case "relativeDateN":
      return "date";
    case "time":
      return "date";
  }
};

/**
 * Conditions for String, Number
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ItemExtractCondition = React.forwardRef<any, Props>(
  function ItemExtractConditionconst(props, ref) {
    const { condition, disableDelete, onChange, handlerId, sx } = props;
    const { t } = useTranslation();

    const onChangeOperator = useCallback(
      (value: ConditionOperator) => {
        if (condition.type === "string") {
          onChange({
            ...condition,
            operator: value,
          });
        } else if (condition.type === "number") {
          onChange({
            ...condition,
            operator: value,
          });
        }
      },
      [condition, onChange]
    );

    const onChangeValue = useCallback(
      (value: string | number) => {
        if (condition.type === "string") {
          onChange({
            ...condition,
            value: value as string,
          });
        } else if (condition.type === "number") {
          onChange({
            ...condition,
            value: value as number,
          });
        }
      },
      [condition, onChange]
    );

    return (
      <Paper
        ref={ref}
        sx={{
          ...sx,
          p: 1,
        }}
        data-handler-id={handlerId}
      >
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Paper
              sx={{
                p: 1,
              }}
              variant="outlined"
            >
              <DisplayColumn
                col={{
                  name: condition.columnName,
                  type: getColumnType(condition.type),
                }}
              />
            </Paper>
          </Grid>

          {condition.type === "absoluteDate" ||
          condition.type === "relativeDate" ||
          condition.type === "relativeDateN" ||
          condition.type === "time" ? (
            <Grid item xs>
              <InputConditionDate value={condition} onChange={onChange} />
            </Grid>
          ) : (
            <>
              <Grid item xs={5} md={4} lg={3}>
                <SelectExtractCondition
                  type={condition.type}
                  operator={condition.operator}
                  onChange={onChangeOperator}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  value={condition.value ?? ""}
                  size="small"
                  label={t("reportPage.field.extractConditionValue")}
                  fullWidth
                  onChange={(e) => {
                    onChangeValue(e.target.value);
                  }}
                />
              </Grid>
            </>
          )}

          {!disableDelete ? (
            <Grid item xs="auto">
              <IconButton
                color="error"
                onClick={() => {
                  props.onDelete(props.index);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          ) : null}
        </Grid>
      </Paper>
    );
  }
);

export default memo(ItemExtractCondition);
