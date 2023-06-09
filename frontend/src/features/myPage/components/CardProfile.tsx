import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserProfile } from "../../../@types/myPage";

type Props = {
  profile?: UserProfile;
};

const CardProfile: React.FC<Props> = ({ profile }) => {
  const { t } = useTranslation();
  const loading = useMemo(() => {
    return !profile;
  }, [profile]);

  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            mr: 3,
          }}
        >
          {loading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <Avatar>
              <PersonIcon />
            </Avatar>
          )}
        </Box>

        <Box>
          {loading ? (
            <>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={200} />
            </>
          ) : (
            <>
              <Typography variant="body1">{profile?.email}</Typography>
            </>
          )}
        </Box>
        <Box sx={{ ml: 2 }}>
          {loading ? (
            <Skeleton variant="rounded" width={100} height={30} />
          ) : (
            <>
              {profile?.downloadable ? (
                <Chip label={t("app.authority.downloadable")} color="success" />
              ) : (
                <Chip label={t("app.authority.readonly")} color="warning" />
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardProfile;
