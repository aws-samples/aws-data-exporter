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
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  reportName: string;
  onRegister: (userId: string) => Promise<boolean>;
  onClose: () => void;
};

const DialogShareReport: React.FC<Props> = ({
  open,
  reportName,
  onRegister,
  onClose,
}) => {
  const [mail, setMail] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    setMail("");
  }, []);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("myPage.shareReportDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box sx={{ mb: 1 }}>
            <Trans
              i18nKey="myPage.shareReportDialog.description"
              values={{ reportName: reportName }}
              components={{ div: <div /> }}
            />
          </Box>
          <TextField
            label={t("app.field.mailaddress")}
            fullWidth
            value={mail}
            onChange={(e) => {
              setMail(e.target.value);
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
            onRegister(mail).then((result) => {
              // Initialize Mail to continue inputting
              if (result) {
                setMail("");
              }
            });
          }}
          autoFocus
          variant="contained"
          color="success"
        >
          {t("myPage.shareReportDialog.button.share")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogShareReport;
