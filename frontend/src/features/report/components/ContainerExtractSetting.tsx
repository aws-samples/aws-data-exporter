import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableColumn } from "../../../@types/report";
import Loading from "../../../components/Loading";
import useReportState from "../hooks/useReportState";
import CardAreaDnD from "./CardAreaDnD";
import CardExtractConditionDnD from "./CardExtractConditionDnD";
import CardSelectColumnDnD from "./CardSelectColumnDnD";
import ItemColumn from "./ItemColumn";

type Props = {
  columns: TableColumn[];
  loading: boolean;
};

//  ASC:1 DESC:-1 Not Sort:0
type Direction = 1 | 0 | -1;

const ContainerExtractSetting: React.FC<Props> = ({ columns, loading }) => {
  const {
    selectColumns,
    extractConditions,
    moveSelectColumn,
    moveExtractCondition,
    addSelectColumn,
    addExtractCondition,
    updateExtractCondition,
    deleteSelectColumn,
    deleteExtractCondition,
  } = useReportState();

  const { t } = useTranslation();

  const [sortableColumns, serSortableColumns] = useState(columns);
  useEffect(() => {
    // When columns is initialized, the sort order is initialized
    if (columns.length === 0) {
      setDirection(0);
    }
    serSortableColumns(columns);
  }, [columns]);

  const [direction, setDirection] = useState<Direction>(0);

  /**
   * Sort columns
   * @param direction
   */
  const sortColumns = useCallback(
    (direction: Direction) => {
      if (columns.length === 0) {
        return;
      }
      const tmp: TableColumn[] = [];
      serSortableColumns(
        tmp
          .concat(columns)
          .sort((a, b) => (a.name > b.name ? 1 : -1) * direction)
      );
    },
    [columns]
  );

  const onClickSort = useCallback(() => {
    // Not sort -> ASC -> DESC -> Not Sort ...
    let tmp: Direction = 0;
    if (direction === 0) {
      tmp = 1;
    } else if (direction === 1) {
      tmp = -1;
    }
    sortColumns(tmp);
    setDirection(tmp);
  }, [direction]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Paper sx={{ p: 1 }} variant="outlined">
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Typography variant="h6">
              {t("reportPage.field.columns")}
            </Typography>
            <Button
              disabled={sortableColumns.length === 0}
              onClick={onClickSort}
              variant="outlined"
              size="small"
              color="inherit"
            >
              {t("reportPage.button.itemSort")}
              {direction === 1 ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : direction === -1 ? (
                <ArrowDownwardIcon fontSize="small" />
              ) : (
                ""
              )}
            </Button>
          </Box>
          <CardAreaDnD height="calc(100vh - 235px)">
            {/* Loading animation is desployed when loading */}
            {loading ? <Loading color="gray" /> : null}
            {sortableColumns.map((col, index) => (
              <ItemColumn col={col} key={index} />
            ))}
          </CardAreaDnD>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Paper sx={{ p: 1, height: "30%" }} variant="outlined">
          <Typography variant="h6">
            {t("reportPage.field.selectColumns")}
          </Typography>
          <CardSelectColumnDnD
            onDrop={(item) => addSelectColumn(item)}
            selectedColumns={selectColumns}
            moveItem={moveSelectColumn}
            onDelete={deleteSelectColumn}
          />
        </Paper>

        <Paper sx={{ p: 1, height: "66%", mt: 1 }} variant="outlined">
          <Typography variant="h6">
            {t("reportPage.field.extractConditions")}
          </Typography>
          <CardExtractConditionDnD
            onDrop={(item) => addExtractCondition(item)}
            droppedConditions={extractConditions}
            moveItem={moveExtractCondition}
            onChange={updateExtractCondition}
            onDelete={deleteExtractCondition}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContainerExtractSetting;
