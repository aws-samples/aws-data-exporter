import { Box, Card, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import useTableApi from "../../../api/useTableApi";
import useAlertSnackbar from "../../../hooks/useAlertSnackbar";
import ButtonExtract from "../components/ButtonExtract";
import ContainerExtractSetting from "../components/ContainerExtractSetting";
import SelectTable from "../components/SelectTable";
import useReportState from "../hooks/useReportState";
import useRestoreReportState from "../hooks/useRestoreReportState";

const ReportConditionsPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    tableName,
    setTableName,
    clear,
    selectColumns,
    updateSelectColumnType,
    extractConditions,
  } = useReportState();

  const { getTableColumns } = useTableApi();
  const { data: resColumns } = getTableColumns(tableName);
  const alert = useAlertSnackbar();

  const { t } = useTranslation();

  useRestoreReportState(params.reportId ?? "");

  useEffect(() => {
    // Update type of SelectColmunState when a report exists.
    // NOTE: setReport and setReportForCopy in useReportState set string type to all columns
    if (resColumns?.columns) {
      updateSelectColumnType(resColumns.columns);
    }
  }, [resColumns]);

  const onClickExtract = useCallback(() => {
    if (selectColumns.length === 0) {
      alert.openError(t("reportPage.error.requiredColumns"));
    } else if (extractConditions.length === 0) {
      alert.openError(t("reportPage.error.requiredConditions"));
    } else {
      navigate({
        pathname: `/report/extract/${params.reportId}`,
      });
      return;
    }
  }, [selectColumns, extractConditions]);

  const onChangeTableId = useCallback(
    (newTableName: string) => {
      // Clear state when tableName changed
      if (tableName !== newTableName) {
        clear();
      }
      setTableName(newTableName);
    },
    [tableName]
  );

  return (
    <Grid container justifyContent="center">
      <Grid item xs xl={8}>
        <Card sx={{ m: 1, p: 1, height: "calc(100vh - 90px)" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h5" sx={{ mr: 2 }}>
                {t("reportPage.field.targetTable")}
              </Typography>
              <SelectTable tableName={tableName} onChange={onChangeTableId} />
            </Box>
            <ButtonExtract onClick={onClickExtract} />
          </Box>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <DndProvider backend={HTML5Backend}>
                <ContainerExtractSetting
                  columns={resColumns?.columns ?? []}
                  loading={!resColumns && !!tableName}
                />
              </DndProvider>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReportConditionsPage;
