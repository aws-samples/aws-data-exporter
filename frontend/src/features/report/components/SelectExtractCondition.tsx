import { Autocomplete, TextField } from "@mui/material";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ConditionOperator } from "../../../@types/report";

type Props = {
  type: "string" | "number";
  operator: ConditionOperator;
  onChange: (value: ConditionOperator) => void;
};

type Option = {
  label: string;
  value: ConditionOperator;
};

const SelectExtractCondition: React.FC<Props> = ({
  type,
  operator,
  onChange,
}) => {
  const { t } = useTranslation();

  const options: Option[] = useMemo(() => {
    if (type === "string") {
      return [
        {
          label: t("app.stringOperator.eq"),
          value: "eq",
        },
        {
          label: t("app.stringOperator.neq"),
          value: "neq",
        },
        {
          label: t("app.stringOperator.contains"),
          value: "contains",
        },
      ];
    } else if (type === "number") {
      return [
        {
          label: t("app.numberOperator.eq"),
          value: "eq",
        },
        {
          label: t("app.numberOperator.neq"),
          value: "neq",
        },
        {
          label: t("app.numberOperator.gt"),
          value: "gt",
        },
        {
          label: t("app.numberOperator.gte"),
          value: "gte",
        },
        {
          label: t("app.numberOperator.lt"),
          value: "lt",
        },
        {
          label: t("app.numberOperator.lte"),
          value: "lte",
        },
      ];
    } else {
      return [];
    }
  }, [type]);

  const selectedOption: Option = useMemo(() => {
    return options.filter((opt) => opt.value === operator)[0];
  }, [options, operator]);

  return (
    <>
      <Autocomplete
        disablePortal
        options={options}
        value={selectedOption}
        isOptionEqualToValue={(option, v) => {
          return option.value === v.value;
        }}
        disableClearable
        onChange={(e, opt) => {
          if (opt) {
            onChange(opt.value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("app.field.conditionOperator")}
            size="small"
          />
        )}
      />
    </>
  );
};

export default SelectExtractCondition;
