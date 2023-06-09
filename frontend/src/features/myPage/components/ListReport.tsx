import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Report } from "../../../@types/report";
import LoadingList from "../../../components/LoadingList";
import useReportState from "../../report/hooks/useReportState";
import DialogShareReport from "./DialogShareReport";

type Props = {
  reports?: Report[];
  emptyMessage?: string;
  onShare?: (reportId: string, userId: string) => Promise<boolean>;
};

const ListReport: React.FC<Props> = ({ reports, emptyMessage, onShare }) => {
  const navigate = useNavigate();

  const { setReportForCopy } = useReportState();
  const { t } = useTranslation();

  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [reportId, setReportId] = useState("");
  const [reportName, setReportName] = useState("");

  const gotoExtractionPage = useCallback((reportId: string) => {
    navigate(`/report/extract/${reportId}`);
  }, []);

  // Go to ConditionPage when copying report
  const copyReport = useCallback((report: Report) => {
    setReportForCopy(report);
    navigate(`/report/conditions/new`);
  }, []);

  return (
    <>
      <DialogShareReport
        open={openShareDialog}
        reportName={reportName}
        onRegister={(userId) => {
          return onShare
            ? onShare(reportId, userId)
            : new Promise<boolean>((resolve) => resolve(false));
        }}
        onClose={() => {
          setOpenShareDialog(false);
        }}
      />
      <List
        sx={{
          height: "50vh",
          overflow: "auto",
        }}
      >
        {!reports ? (
          <LoadingList count={10} />
        ) : reports.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {emptyMessage}
          </Box>
        ) : (
          <>
            <Divider />
            {reports.map((report, idx) => (
              <React.Fragment key={idx}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      gotoExtractionPage(report.reportId);
                    }}
                  >
                    <ListItemText primary={report.reportName} />
                  </ListItemButton>

                  <Button
                    sx={{ mr: 1 }}
                    variant="contained"
                    startIcon={<ContentCopyIcon />}
                    color="primary"
                    onClick={() => {
                      copyReport(report);
                    }}
                  >
                    {t("myPage.reportList.button.copy")}
                  </Button>

                  {onShare ? (
                    <Button
                      sx={{ mr: 1 }}
                      variant="contained"
                      startIcon={<ShareIcon />}
                      color="success"
                      onClick={() => {
                        setOpenShareDialog(true);
                        setReportId(report.reportId);
                        setReportName(report.reportName);
                      }}
                    >
                      {t("myPage.reportList.button.share")}
                    </Button>
                  ) : null}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </>
        )}
      </List>
    </>
  );
};

export default ListReport;
