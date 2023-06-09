import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";
import { SxProps, Theme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  sx?: SxProps<Theme>;
  onClick: () => void;
} & LoadingButtonProps;

const ButtonExtract: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  return (
    <LoadingButton
      {...props}
      loadingPosition="start"
      variant="contained"
      color="success"
      startIcon={<PlayArrowIcon />}
    >
      {t("reportPage.button.extract")}
    </LoadingButton>
  );
};

export default ButtonExtract;
