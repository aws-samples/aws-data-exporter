import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Collapse,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
  SxProps,
} from "@mui/material";
import { TFunction } from "i18next";
import React, { ReactNode, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ExtractHistoryListItem } from "../../../@types/myPage";
import { ConditionOperator, ExtractCondition } from "../../../@types/report";
import useMuiTheme from "../../../hooks/useMuiTheme";
import { formatDatetime } from "../../../utils/DateUtils";

type Props = {
  history: ExtractHistoryListItem;
};

const TextBlock: React.FC<{ column?: boolean; children?: ReactNode }> = ({
  column,
  children,
}) => {
  const { isDark } = useMuiTheme();

  return (
    <Box>
      <Box
        component="span"
        sx={{
          px: 1,
          py: 0.3,
          color: isDark
            ? column
              ? "Chocolate"
              : "rgba(255, 255, 255, 0.7)"
            : column
            ? "Crimson"
            : "Black",
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "whitesmoke",
          borderRadius: 1,
          border: "solid 1px DarkGray",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const getNumberOperator = (operator: ConditionOperator, t: TFunction) => {
  switch (operator) {
    case "eq":
      return t("app.numberOperator.eq");
    case "neq":
      return t("app.numberOperator.neq");
    case "gt":
      return t("app.numberOperator.gt");
    case "gte":
      return t("app.numberOperator.gte");
    case "lt":
      return t("app.numberOperator.lt");
    case "lte":
      return t("app.numberOperator.lte");
  }
};

const renderStringOperator = (
  operator: ConditionOperator,
  value: string,
  t: TFunction
): ReactNode => {
  switch (operator) {
    case "eq":
      if (value === "") {
        return <>{t("myPage.extractionHistory.stringOperator.eq.empty")}</>;
      }
      return (
        <Trans
          i18nKey="myPage.extractionHistory.stringOperator.eq.notEmpty"
          values={{ value }}
          components={{ TextBlock: <TextBlock /> }}
        />
      );
    case "neq":
      if (value === "") {
        return <>{t("myPage.extractionHistory.stringOperator.neq.empty")}</>;
      }
      return (
        <Trans
          i18nKey="myPage.extractionHistory.stringOperator.neq.notEmpty"
          values={{ value }}
          components={{ TextBlock: <TextBlock /> }}
        />
      );
    case "contains":
      return (
        <Trans
          i18nKey="myPage.extractionHistory.stringOperator.contains"
          values={{ value }}
          components={{ TextBlock: <TextBlock /> }}
        />
      );
  }
};

const renderCondition = (condition: ExtractCondition, t: TFunction) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
      {condition.type === "number" ? (
        <>
          <TextBlock column>{condition.columnName}</TextBlock>
          <Box>{getNumberOperator(condition.operator, t)}</Box>
          <TextBlock>{condition.value}</TextBlock>
        </>
      ) : condition.type === "string" ? (
        <>
          <TextBlock column>{condition.columnName}</TextBlock>
          {renderStringOperator(condition.operator, condition.value ?? "", t)}
        </>
      ) : condition.type === "relativeDate" ? (
        <>
          <TextBlock column>{condition.columnName}</TextBlock>
          <Trans
            i18nKey={`myPage.extractionHistory.relativeDateOperator.${condition.period}`}
            components={{ TextBlock: <TextBlock /> }}
          />
        </>
      ) : condition.type === "relativeDateN" ? (
        <>
          <TextBlock column>{condition.columnName}</TextBlock>
          <Trans
            i18nKey={`myPage.extractionHistory.relativeDateNOperator.${condition.period}`}
            count={condition.n}
            values={{ value: condition.n }}
            components={{ TextBlock: <TextBlock /> }}
          />
        </>
      ) : condition.type === "absoluteDate" ? (
        <>
          <TextBlock column>{condition.columnName}</TextBlock>
          <Trans
            i18nKey="myPage.extractionHistory.absoluteDateOperator"
            values={{
              from: formatDatetime(condition.startDate),
              to: formatDatetime(condition.endDate),
            }}
            components={{ TextBlock: <TextBlock /> }}
          />
        </>
      ) : null}
    </Box>
  );
};

const ListItemExtractHistory: React.FC<Props> = ({ history }) => {
  const { isDark } = useMuiTheme();
  const { t, i18n } = useTranslation();

  const [openDetail, setOpenDetail] = useState(false);

  const formattedDatetime = useMemo(
    () => formatDatetime(history.extractionTime),
    [history.extractionTime]
  );

  const headerStyle = useMemo<SxProps>(() => {
    return {
      fontWeight: "bold",
      minWidth: "7rem",
      color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
    };
  }, [isDark]);

  const renderDetail = useMemo<ReactNode>(() => {
    return (
      <Box
        sx={{
          typography: "body2",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <Box sx={headerStyle}>
            {t("myPage.extractionHistory.field.tableName")}:
          </Box>
          <Box>{history.tableName}</Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <Box sx={headerStyle}>
            {t("myPage.extractionHistory.field.extractedData")}:
          </Box>

          <Grid container spacing={1}>
            {history.columns.map((column) => (
              <Grid item key={column}>
                <TextBlock column>{column}</TextBlock>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 1 }}>
          <Box sx={headerStyle}>
            {t("myPage.extractionHistory.field.extractedCondition")}:
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {history.conditions.map((condition, idx) => {
              return <Box key={idx}>{renderCondition(condition, t)}</Box>;
            })}
          </Box>
        </Box>
      </Box>
    );
  }, [headerStyle, i18n.language]);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpenDetail(!openDetail)}>
          <ListItemText
            primary={history.tableName}
            secondary={
              <Grid container spacing={2}>
                <Grid item>
                  {t("myPage.extractionHistory.field.extractedDatetime")}:
                  {formattedDatetime}
                </Grid>
              </Grid>
            }
          />
          {openDetail ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={openDetail}>
        <ListItem disablePadding>
          <ListItemText
            disableTypography
            sx={{ mx: 2 }}
            secondary={renderDetail}
          />
        </ListItem>
      </Collapse>
    </>
  );
};

export default ListItemExtractHistory;
