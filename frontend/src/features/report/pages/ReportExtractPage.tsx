import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BackupIcon from "@mui/icons-material/Backup";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { MRT_ColumnDef } from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ExtractCondition } from "../../../@types/report";
import useExportApi from "../../../api/useExportApi";
import useExtractionApi from "../../../api/useExtractionApi";
import useReportApi from "../../../api/useReportApi";
import useAlertSnackbar from "../../../hooks/useAlertSnackbar";
import useAuth from "../../../hooks/useAuth";
import useLoading from "../../../hooks/useLoading";
import ButtonExtract from "../components/ButtonExtract";
import CardArea from "../components/CardArea";
import DialogRegisterReport from "../components/DialogRegisterReport";
import ItemExtractCondition from "../components/ItemExtractCondition";
import TableReport from "../components/TableReport";
import useReportState from "../hooks/useReportState";
import useRestoreReportState from "../hooks/useRestoreReportState";

const ReportExtractPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const modalLoading = useLoading();
  const { openSucces } = useAlertSnackbar();
  const { extractData } = useExtractionApi();
  const { registerReport } = useReportApi();
  const { canExport } = useAuth();
  const { t } = useTranslation();

  const [openConditions, setOpenConditions] = useState(true);
  const {
    reportName,
    setReportName,
    tableName,
    selectColumns,
    extractConditions,
    updateExtractCondition,
  } = useReportState();

  const { shouldRestoreReport } = useRestoreReportState(params.reportId ?? "");

  // Init Process
  useEffect(() => {
    // If the report is not restored, extract it at the initial process
    if (!shouldRestoreReport) {
      extract(
        tableName,
        selectColumns.map((col) => col.name),
        extractConditions
      );
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[][]>([]);

  const [oepnRegisterDialog, setOepnRegisterDialog] = useState(false);

  const extract = useCallback(
    (tableName: string, columns: string[], conditions: ExtractCondition[]) => {
      if (!loading) {
        setLoading(true);
        extractData({
          tableName,
          columns,
          conditions,
        })
          .then((res) => {
            setData(res.data.items);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    []
  );

  // Generate the definition of MRT from the selected columns
  const columns = useMemo<MRT_ColumnDef<string[]>[]>(
    () =>
      selectColumns.map((column, idx) => ({
        accessorFn: (row) => row[idx],
        header: column.name,
      })),
    [selectColumns]
  );

  const onClickExtract = useCallback(() => {
    extract(
      tableName,
      selectColumns.map((col) => col.name),
      extractConditions
    );
  }, [extract, tableName, selectColumns, extractConditions]);

  const onRegisterReport = useCallback(
    (reportName: string) => {
      modalLoading.open();

      registerReport({
        reportName: reportName,
        tableName,
        columns: selectColumns.map((col) => col.name),
        conditions: extractConditions,
      })
        .then((res) => {
          openSucces(t("reportPage.message.succesSaveReport"));
          setReportName(reportName);
          setOepnRegisterDialog(false);

          navigate(`/report/extract/${res.data.reportId}`);
        })
        .finally(() => {
          modalLoading.close();
        });
    },
    [tableName, selectColumns, extractConditions]
  );

  const [extracting, setExtracting] = useState(false);
  const { exportData } = useExportApi();

  // CSV Export
  const onExportResult = useCallback(() => {
    setExtracting(true);
    exportData({
      columns: selectColumns.map((col) => col.name),
      table: data,
    })
      .then((res) => {
        // Convert response to Blob
        const blob = new Blob([res.data], { type: "text/csv" });

        // Convert Blob to URL, and use the link to download the data
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = url;
        link.setAttribute("download", "test.csv");
        link.click();
        document.body.removeChild(link);
      })
      .finally(() => {
        setExtracting(false);
      });
  }, [selectColumns, data]);

  return (
    <>
      <DialogRegisterReport
        open={oepnRegisterDialog}
        onRegister={onRegisterReport}
        onClose={() => setOepnRegisterDialog(false)}
      />

      {/* Display Layout */}
      <Grid container justifyContent="center">
        <Grid item xs xl={8}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              m: 1,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                navigate({
                  pathname: `/report/conditions/${params.reportId}`,
                });
              }}
            >
              {t("reportPage.button.gotoConditionPage")}
            </Button>

            <Button
              variant="contained"
              startIcon={<BackupIcon />}
              color="secondary"
              onClick={() => {
                setOepnRegisterDialog(true);
              }}
            >
              {t("reportPage.button.saveReport")}
            </Button>
          </Box>
          <Card sx={{ p: 1, m: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t("reportPage.field.reportName")}：
              {reportName === ""
                ? t("reportPage.field.unsavedReport")
                : reportName}
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t("reportPage.field.targetTable")}：{tableName}
            </Typography>
            <Card sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemButton
                  onClick={() => {
                    setOpenConditions(!openConditions);
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h6">
                      {t("reportPage.field.extractConditions")}
                    </Typography>

                    <Box sx={{ mr: 1 }}>
                      {openConditions ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </Box>
                  </Box>
                </ListItemButton>
              </Box>

              <Collapse in={openConditions}>
                <Divider />
                <Box sx={{ m: 1 }}>
                  <CardArea height="">
                    {extractConditions.map((condition, idx) => (
                      <Box sx={{ mt: idx > 0 ? 1 : 0 }} key={idx}>
                        <ItemExtractCondition
                          condition={condition}
                          onChange={(value) => {
                            updateExtractCondition(value, idx);
                          }}
                          disableDelete
                        />
                      </Box>
                    ))}
                  </CardArea>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <ButtonExtract
                      loading={loading}
                      sx={{ mt: 1 }}
                      onClick={() => {
                        onClickExtract();
                      }}
                    />
                  </Box>
                </Box>
              </Collapse>
            </Card>
            <Card sx={{ p: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="h6">
                  {t("reportPage.field.extractResult")}
                </Typography>
                {canExport ? (
                  <LoadingButton
                    variant="contained"
                    color="warning"
                    loadingPosition="start"
                    loading={extracting}
                    disabled={loading}
                    startIcon={<BrowserUpdatedIcon />}
                    onClick={onExportResult}
                  >
                    {t("reportPage.button.export")}
                  </LoadingButton>
                ) : null}
              </Box>
              <Box>
                <TableReport
                  // Although "columns" gets an type error, it is not a problem in the library specification, so the error is suppressed with "any".
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  columns={columns as any}
                  data={data}
                  loading={loading}
                />
              </Box>
            </Card>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ReportExtractPage;
