import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

type Props = {
  open: boolean;
  onClose: () => void;
};

const DialogSelectLanguage: React.FC<Props> = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>(
    i18n.language as (typeof LANGUAGES)[number]
  );

  const handleChangeLanguage = () => {
    i18n.changeLanguage(language);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("app.selectLanguageDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormControl>
            <FormLabel>{t("app.selectLanguageDialog.label")}</FormLabel>
            <RadioGroup
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as (typeof LANGUAGES)[number])
              }
            >
              {LANGUAGES.map((lang) => (
                <FormControlLabel
                  key={lang}
                  value={lang}
                  control={<Radio />}
                  label={t(`app.language.${lang}`)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          {t("app.button.cancel")}
        </Button>
        <Button
          onClick={() => {
            handleChangeLanguage();
          }}
          autoFocus
          variant="contained"
          color="success"
        >
          {t("app.button.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogSelectLanguage;
