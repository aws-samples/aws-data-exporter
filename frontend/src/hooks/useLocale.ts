import { enUS, jaJP, Localization } from "@mui/material/locale";
import { MRT_Localization } from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_JA } from "material-react-table/locales/ja";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hooks for i18n locale
 * @returns
 */
const useLocale = () => {
  const { i18n } = useTranslation();

  const [mrtLocale, setMrtLocale] = useState<MRT_Localization>();
  const [muiLocale, setMuiLocale] = useState<Localization>();

  useEffect(() => {
    // set locale for MRT, MUI
    if (i18n.language === "en") {
      setMrtLocale(MRT_Localization_EN);
      setMuiLocale(enUS);
    } else if (i18n.language === "ja") {
      setMrtLocale(MRT_Localization_JA);
      setMuiLocale(jaJP);
    }
  }, [i18n.language]);

  return {
    mrtLocale,
    muiLocale,
  };
};

export default useLocale;
