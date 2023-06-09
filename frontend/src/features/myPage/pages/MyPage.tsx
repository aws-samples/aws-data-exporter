import EditIcon from "@mui/icons-material/Edit";
import { Button, Card, Divider, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MenuEnum } from "../../../@types/myPage";
import useUserApi from "../../../api/useUserApi";
import useReportState from "../../report/hooks/useReportState";
import CardProfile from "../components/CardProfile";
import ListExtractHistory from "../components/ListExtractHistory";
import ListMenu from "../components/ListMenu";
import ListMyReport from "../components/ListMyReport";
import ListSharedReport from "../components/ListSharedReport";

const MyPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuEnum>("saved");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { getUser } = useUserApi();
  const { data: user } = getUser();
  const { clear } = useReportState();

  useEffect(() => {
    // Initialize ReportState on transition to MyPage
    clear();
  }, []);

  const clickCreateReport = useCallback(() => {
    navigate({
      pathname: "report/conditions/new",
    });
  }, []);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8} xl={6}>
        <Card sx={{ p: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
            }}
          >
            <CardProfile profile={user} />
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={clickCreateReport}
            >
              {t("myPage.button.newReport")}
            </Button>
          </Box>
          <Card sx={{ mt: 1 }}>
            <Grid container sx={{ height: "50vh" }}>
              <Grid item xs={3}>
                <ListMenu
                  selected={selectedMenu}
                  onClick={(selectMenu) => setSelectedMenu(selectMenu)}
                />
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs>
                {selectedMenu === "history" ? (
                  <ListExtractHistory />
                ) : selectedMenu === "saved" ? (
                  <ListMyReport />
                ) : (
                  <ListSharedReport />
                )}
              </Grid>
            </Grid>
          </Card>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MyPage;
