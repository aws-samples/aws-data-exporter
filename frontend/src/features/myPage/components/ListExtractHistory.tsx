import { Box, Divider, List } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import useExtractionApi from "../../../api/useExtractionApi";
import LoadingList from "../../../components/LoadingList";
import ListItemExportHistory from "./ListItemExtractHistory";

const ListExtractHistory: React.FC = () => {
  const { getExtractionHistory } = useExtractionApi();
  const { t } = useTranslation();

  const { data } = getExtractionHistory();

  return (
    <List
      sx={{
        height: "50vh",
        overflow: "auto",
      }}
    >
      <Divider />
      {!data ? (
        <LoadingList count={10} />
      ) : data.historyRecords.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {t("myPage.extractionHistory.message.noHistory")}
        </Box>
      ) : (
        data.historyRecords.map((history, idx) => (
          <React.Fragment key={idx}>
            <ListItemExportHistory history={history} />
            <Divider />
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default ListExtractHistory;
