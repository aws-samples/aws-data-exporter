import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onRegister: (reportName: string) => void;
  onClose: () => void;
};

const DialogRegisterReport: React.FC<Props> = ({
  open,
  onRegister,
  onClose,
}) => {
  const { t } = useTranslation();
  const [reportName, setReportName] = useState("");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("reportPage.registerReportDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box sx={{ mb: 1 }}>
            {t("reportPage.registerReportDialog.description")}
          </Box>
          <TextField
            label={t("reportPage.field.reportName")}
            fullWidth
            value={reportName}
            onChange={(e) => {
              setReportName(e.target.value);
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          {t("app.button.cancel")}
        </Button>
        <Button
          onClick={() => {
            onRegister(reportName);
          }}
          autoFocus
          variant="contained"
        >
          {t("app.button.register")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRegisterReport;
