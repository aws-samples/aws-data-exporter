import {
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ConditionType,
  ExtractCondition,
  RelativeDateNPeriod,
  RelativeDatePeriod,
} from "../../../@types/report";
import DatePicker from "../../../components/DatePicker";

type Props = {
  value: ExtractCondition;
  onChange: (value: ExtractCondition) => void;
};

/**
 * Component for date type search condition
 * @param param0
 * @returns
 */
const InputConditionDate: React.FC<Props> = ({ value, onChange }) => {
  const { t, i18n } = useTranslation();

  const SearchTypeOption = useMemo<{ label: string; value: ConditionType }[]>(
    () => [
      {
        label: t("reportPage.dateConditions.relative"),
        value: "relativeDate",
      },
      {
        label: t("reportPage.dateConditions.relativeN"),
        value: "relativeDateN",
      },
      {
        label: t("reportPage.dateConditions.absolute"),
        value: "absoluteDate",
      },
    ],
    [i18n.language]
  );

  const RelativeTypeOption = useMemo<
    { label: string; value: RelativeDatePeriod }[]
  >(
    () => [
      {
        label: t("reportPage.dateConditions.today"),
        value: "today",
      },
      {
        label: t("reportPage.dateConditions.yesterday"),
        value: "yesterday",
      },
      {
        label: t("reportPage.dateConditions.lastWeek"),
        value: "lastWeek",
      },
      {
        label: t("reportPage.dateConditions.lastMonth"),
        value: "lastMonth",
      },
      {
        label: t("reportPage.dateConditions.lastYear"),
        value: "lastYear",
      },
    ],
    [i18n.language]
  );

  const RelativeNTypeOption = useMemo<
    {
      label: string;
      value: RelativeDateNPeriod;
    }[]
  >(
    () => [
      {
        label: t("reportPage.dateConditions.dayBefore"),
        value: "day",
      },
      {
        label: t("reportPage.dateConditions.weekBefore"),
        value: "week",
      },
      {
        label: t("reportPage.dateConditions.monthBofore"),
        value: "month",
      },
      {
        label: t("reportPage.dateConditions.yearBefore"),
        value: "year",
      },
    ],
    [i18n.language]
  );

  // render ToggleButton options for each search type
  const renderOption = useCallback(
    (options: { label: string; value: string }[]) => {
      return options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ));
    },
    []
  );

  const renderSearchType = useCallback(() => {
    return renderOption(SearchTypeOption);
  }, [i18n.language]);

  const renderRelativeType = useCallback(() => {
    return renderOption(RelativeTypeOption);
  }, [i18n.language]);

  const renderRelativeNType = useCallback(() => {
    return renderOption(RelativeNTypeOption);
  }, [i18n.language]);

  const onChangeSearchType = useCallback(
    (type: ConditionType) => {
      if (type) {
        if (type === "relativeDate") {
          onChange({
            columnName: value.columnName,
            type: "relativeDate",
            period: "today",
          });
        } else if (type === "relativeDateN") {
          onChange({
            columnName: value.columnName,
            type: "relativeDateN",
            period: "day",
            n: 1,
          });
        } else if (type === "absoluteDate") {
          onChange({
            columnName: value.columnName,
            type: "absoluteDate",
            startDate: "",
            endDate: "",
          });
        }
      }
    },
    [value.columnName]
  );

  const onChangeRelative = useCallback(
    (period: RelativeDatePeriod) => {
      onChange({
        columnName: value.columnName,
        type: "relativeDate",
        period,
      });
    },
    [value.columnName]
  );

  const onChangeRelativeN = useCallback(
    (n: number, period: RelativeDateNPeriod) => {
      onChange({
        columnName: value.columnName,
        type: "relativeDateN",
        period,
        n,
      });
    },
    [value.columnName]
  );

  const onChangeAbsolute = useCallback(
    (startDate: string, endDate: string) => {
      onChange({
        columnName: value.columnName,
        type: "absoluteDate",
        startDate,
        endDate,
      });
    },
    [value.columnName]
  );

  return (
    <>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs="auto">
          <ToggleButtonGroup
            size="small"
            color="primary"
            value={value.type}
            exclusive
            onChange={(e, value) => onChangeSearchType(value)}
          >
            {renderSearchType()}
          </ToggleButtonGroup>
        </Grid>
        {value.type === "relativeDate" ? (
          <Grid item xs="auto">
            <ToggleButtonGroup
              color="primary"
              size="small"
              value={value.period}
              exclusive
              onChange={(e, period) => {
                onChangeRelative(period);
              }}
            >
              {renderRelativeType()}
            </ToggleButtonGroup>
          </Grid>
        ) : value.type === "relativeDateN" ? (
          <>
            <Grid item xs="auto">
              <TextField
                sx={{ maxWidth: "5rem", mr: 1 }}
                size="small"
                placeholder="N"
                value={value.n}
                type="number"
                onChange={(e) => {
                  onChangeRelativeN(
                    Number.parseInt(e.target.value),
                    value.period
                  );
                }}
              />

              <ToggleButtonGroup
                color="primary"
                size="small"
                value={value.period}
                exclusive
                onChange={(e, period) => {
                  onChangeRelativeN(value.n, period);
                }}
              >
                {renderRelativeNType()}
              </ToggleButtonGroup>
            </Grid>
          </>
        ) : value.type === "absoluteDate" ? (
          <Grid container alignItems="center" sx={{ mt: 1, ml: 1 }}>
            <Grid item xs="auto">
              <DatePicker
                value={value.startDate}
                onChange={(startDate) => {
                  onChangeAbsolute(startDate, value.endDate);
                }}
              />
            </Grid>
            <Grid item xs="auto" sx={{ mx: 2 }}>
              <Typography>〜</Typography>
            </Grid>
            <Grid item xs="auto">
              <DatePicker
                value={value.endDate}
                onChange={(endDate) => {
                  onChangeAbsolute(value.startDate, endDate);
                }}
              />
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

export default InputConditionDate;
